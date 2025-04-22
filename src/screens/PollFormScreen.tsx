import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL, COLORS, SPACING, FONTS } from '../config';

const pollFormSchema = z.object({
  division: z.string().min(1, 'Division is required'),
  subdivision: z.string().min(1, 'Sub-division is required'),
  feeder: z.string().min(1, 'Feeder is required'),
});

type PollForm = z.infer<typeof pollFormSchema>;

export default function PollFormScreen() {
  const navigation = useNavigation();
  const [divisions, setDivisions] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [feeders, setFeeders] = useState([]);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<PollForm>({
    resolver: zodResolver(pollFormSchema),
  });

  const division = watch('division');
  const subdivision = watch('subdivision');

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (division) {
      fetchSubdivisions(division);
    }
  }, [division]);

  useEffect(() => {
    if (division && subdivision) {
      fetchFeeders(division, subdivision);
    }
  }, [division, subdivision]);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/division`);
      setDivisions(response.data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchSubdivisions = async (division: string) => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/subdivision?division=${division}`);
      setSubdivisions(response.data);
    } catch (error) {
      console.error('Error fetching subdivisions:', error);
    }
  };

  const fetchFeeders = async (division: string, subdivision: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/recommendations/feeder?division=${division}&subdivision=${subdivision}`
      );
      setFeeders(response.data);
    } catch (error) {
      console.error('Error fetching feeders:', error);
    }
  };

  const onSubmit = (data: PollForm) => {
    navigation.navigate('TCNumber', data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Poll</Text>

      <Controller
        control={control}
        name="division"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Division"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.division && (
        <Text style={styles.errorText}>{errors.division.message}</Text>
      )}

      <Controller
        control={control}
        name="subdivision"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Sub-division"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.subdivision && (
        <Text style={styles.errorText}>{errors.subdivision.message}</Text>
      )}

      <Controller
        control={control}
        name="feeder"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Feeder"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.feeder && (
        <Text style={styles.errorText}>{errors.feeder.message}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    marginBottom: SPACING.xl,
    color: COLORS.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    fontSize: 14,
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.medium,
    fontSize: 16,
  },
});