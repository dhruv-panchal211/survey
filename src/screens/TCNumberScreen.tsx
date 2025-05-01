import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { COLORS, SPACING, FONTS } from '../config';

const tcNumberSchema = z.object({
  tc_number: z.string().min(1, 'TC Number is required'),
  poll_number: z.string().min(1, 'Poll Number is required'),
});

type TCNumberForm = z.infer<typeof tcNumberSchema>;

export default function TCNumberScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [location, setLocation] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TCNumberForm>({
    resolver: zodResolver(tcNumberSchema),
  });

  React.useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  const onSubmit = (data: TCNumberForm) => {
    if (location) {
      navigation.navigate('Wizard', {
        ...route.params,
        ...data,
        ...location,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TC Number Details</Text>

      <Controller
        control={control}
        name="tc_number"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="TC Number"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.tc_number && (
        <Text style={styles.errorText}>{errors.tc_number.message}</Text>
      )}

      <Controller
        control={control}
        name="poll_number"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Poll Number"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.poll_number && (
        <Text style={styles.errorText}>{errors.poll_number.message}</Text>
      )}

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={!location}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xl,
    color: COLORS.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
    backgroundColor: COLORS.white,
    fontSize: FONTS.medium,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.medium,
    fontSize: 14,
  },
  locationInfo: {
    backgroundColor: COLORS.white,
    padding: SPACING.medium,
    borderRadius: 8,
    marginVertical: SPACING.medium,
  },
  locationText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.large,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '500',
  },
});
