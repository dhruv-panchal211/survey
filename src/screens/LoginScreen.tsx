// LoginScreen.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/stores/authStore';
import { ThemeContext } from '@/theme/ThemeProvider/ThemeProvider';

const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation: any = useNavigation();
  const { login } = useAuthStore();
  const theme = useContext(ThemeContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '7984013359',
      password: 'Neel@3315',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.phone, data.password);
      navigation.navigate('PollForm');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  console.log(theme)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          theme.layout.flex_1,
          theme.gutters.largePadding,
          theme.backgrounds.primary,
          { justifyContent: 'center' },
        ]}
      >
        <Text style={[
          theme.fonts.title,
          theme.fonts.secondary,
          theme.fonts.alignCenter,
          theme.gutters.mediumMarginBottom
        ]}>
          Welcome Back
        </Text>

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                theme.borders.rounded_12,
                theme.borders.w_1,
                theme.borders.gray200,
                theme.gutters.mediumPaddingHorizontal,
                theme.gutters.smallMarginBottom,
                theme.fonts.medium,
                theme.fonts.secondary,
                theme.backgrounds.inputBackground,
                { height: 48 }
              ]}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={theme.colors.placeholder}
            />
          )}
        />
        {errors.phone && (
          <Text style={[
            theme.fonts.small,
            theme.fonts.error,
            theme.gutters.smallMarginBottom
          ]}>
            {errors.phone.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                theme.borders.rounded_12,
                theme.borders.w_1,
                theme.borders.gray200,
                theme.gutters.mediumPaddingHorizontal,
                theme.gutters.mediumMarginBottom,
                theme.fonts.medium,
                theme.fonts.secondary,
                theme.backgrounds.inputBackground,
                { height: 48 }
              ]}
              placeholder="Password"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              placeholderTextColor={theme.colors.placeholder}
            />
          )}
        />
        {errors.password && (
          <Text style={[
            theme.fonts.small,
            theme.fonts.error,
            theme.gutters.smallMarginBottom
          ]}>
            {errors.password.message}
          </Text>
        )}

        <TouchableOpacity
          style={[
            theme.backgrounds.purple250,
            theme.borders.rounded_12,
            theme.gutters.mediumMarginTop,
            theme.gutters.mediumPaddingHorizontal,
            { height: 48, justifyContent: 'center', alignItems: 'center' },
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[
            theme.fonts.medium,
            theme.fonts.secondary,
            theme?.fonts.bold,
          ]}>
            Login
          </Text>
        </TouchableOpacity>

          {/* Code For Theme Change */}
        {/* <TouchableOpacity
          style={[
            theme.backgrounds.gray100,
            theme.borders.rounded_12,
            theme.gutters.mediumMarginTop,
            theme.gutters.mediumPaddingHorizontal,
            { height: 48, justifyContent: 'center', alignItems: 'center' },
          ]}
          onPress={() => {
            if (theme?.variant !== 'dark') {
              theme.changeTheme('dark');
            } else {
              theme.changeTheme('default');
            }
          }}
        >
          <Text style={[
            theme.fonts.medium,
            theme.fonts.secondary
          ]}>
            Change Theme
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={[theme.gutters.largeMarginTop, { alignItems: 'center' }]}
        >
          <Text style={[theme.fonts.medium, theme.fonts.link]}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
