import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { COLORS, SPACING, FONTS, API_URL } from '../config';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const schema = z.object({
  tc_name: z.string().min(1, 'TC Name is required'),
  tc_number: z.string().min(1, 'TC Number is required'),
  capacity: z.string().min(1, 'Capacity is required'),
});

export default function CreateTCScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { feederId } = route.params;
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const watchAllFields = watch();
  const isFormValid = !!(
    watchAllFields.tc_name &&
    watchAllFields.tc_number &&
    watchAllFields.capacity
  );

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const result = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }) as any,
      );
      console.log({ result });

      return result === RESULTS.GRANTED;
    } catch (err) {
      Alert.alert('Error requesting location permission', err.message);
      return false;
    }
  };

  const onSubmit = async (data) => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to proceed',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const result = await axios.post(`${API_URL}/transformer`, {
            tc_number: data.tc_number,
            tc_name: data.tc_name,
            capacity: data.capacity,
            lat: coords.latitude,
            long: coords.longitude,
            feeder_id: feederId,
          });
          console.log({ result });
          navigation.navigate('CreateOptions', { feederId: feederId });
          Alert.alert('Success', 'TC created successfully');
        } catch (err) {
          console.log({ err });
          Alert.alert('Error', 'Failed to create TC');
        }
      },
      (error) => Alert.alert('Location Error', error.message),
      { enableHighAccuracy: true },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create TC</Text>

      {['tc_name', 'tc_number', 'capacity'].map((field) => (
        <Controller
          key={field}
          control={control}
          name={field}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={field.replace('_', ' ').toUpperCase()}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      ))}

      {Object.keys(errors).map((key) => (
        <Text key={key} style={styles.errorText}>
          {errors[key]?.message}
        </Text>
      ))}

      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && { backgroundColor: COLORS.gray },
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Save</Text>
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
    marginBottom: SPACING.large,
    color: COLORS.text.primary,
    textAlign: 'center',
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
    marginBottom: SPACING.small,
    fontSize: 14,
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '500',
  },
});
