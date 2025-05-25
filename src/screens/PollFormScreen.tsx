import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL } from '../config';
import { useFeederStore } from '../stores/pollStore';
import { ThemeContext } from '@/theme/ThemeProvider/ThemeProvider';

const pollFormSchema = z.object({
  division: z.string().min(1, 'Division is required'),
  subdivision: z.string().min(1, 'Sub-division is required'),
  feeder: z.string().min(1, 'Feeder is required'),
});

type PollForm = z.infer<typeof pollFormSchema>;

export default function PollFormScreen() {
  const navigation = useNavigation();
    const theme = useContext(ThemeContext); // Access the theme from context
  const [divisions, setDivisions] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [feeders, setFeeders] = useState([]);
  const { setFeederId } = useFeederStore(); // Access Zustand store function

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PollForm>({
    resolver: zodResolver(pollFormSchema),
  });

  const division = watch('division');
  const subdivision = watch('subdivision');
  const feeder = watch('feeder');
  const isFormValid = !!(division && subdivision && feeder);

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (division) {
      fetchSubdivisions(division);
    }
  }, [division]);

  useEffect(() => {
    if (subdivision) {
      fetchFeeders(subdivision);
    }
  }, [subdivision]);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations`);
      setDivisions(response.data.divisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchSubdivisions = async (divisionId: string) => {
    try {
      const response = await axios.get(`${API_URL}/recommendations?division_id=${divisionId}`);
      setSubdivisions(response.data.subdivisions);
    } catch (error) {
      console.error('Error fetching subdivisions:', error);
    }
  };

  const fetchFeeders = async (subdivisionId: string) => {
    try {
      const response = await axios.get(`${API_URL}/recommendations?subdivision_id=${subdivisionId}`);
      setFeeders(response.data.feeders);
    } catch (error) {
      console.error('Error fetching feeders:', error);
    }
  };

  const onSubmit = (data: PollForm) => {
    try {
      setFeederId(data.feeder); // Update Zustand store
      navigation.navigate('CreateOptions');
    } catch (error) {
      console.error('Error setting feeder ID:', error);
    }
  };
  console.log(theme);
  return (
    <ScrollView
      style={[theme.backgrounds.primary, {flex: 1}] }
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={[styles.title,  theme.backgrounds.primary ]}>Poll Form</Text>

      <Text style={[styles.label, theme.backgrounds.primary]}>Division</Text>
      {divisions.length > 0 && (
        <Controller
          control={control}
          name="division"
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              onValueChange={onChange}
              items={divisions.map((division) => ({
                label: division.name,
                value: division.id,
              }))}
              value={value}
              placeholder={{ label: 'Select a division', value: null }}
              style={{
                inputIOS: [{ ...styles.input, color: theme.colors.secondary }, theme.borders.rounded_16,theme?.gutters.marginBottom_32],
                inputAndroid: [{ ...styles.input, color: theme.colors.secondary },theme.borders.rounded_16,theme?.gutters.marginBottom_32],
              }}
            />
          )}
        />
      )}
      {errors.division && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.division.message}</Text>}

      <Text style={styles.label}>Sub-division</Text>

      <Controller
        control={control}
        name="subdivision"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            items={subdivisions.map((subdivision) => ({
              label: subdivision.name,
              value: subdivision.id,
            }))}
            value={value}
            placeholder={{ label: 'Select a sub-division', value: null }}
            style={{
              inputIOS: [{ ...styles.input, color: theme.colors.secondary }, theme.borders.rounded_12,theme?.gutters.marginBottom_32],
              inputAndroid: [{ ...styles.input, color: theme.colors.secondary },theme.borders.rounded_12, theme?.gutters.marginBottom_32],
            }}
          />
        )}
      />
      {errors.subdivision && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{errors.subdivision.message}</Text>
      )}

      <Text style={styles.label}>Feeder</Text>
      <Controller
        control={control}
        name="feeder"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            items={feeders.map((feeder) => ({
              label: feeder.name,
              value: feeder.id,
            }))}
            value={value}
            placeholder={{ label: 'Select a feeder', value: null }}
            style={{
              inputIOS: [{ ...styles.input, color: theme.colors.secondary},theme?.gutters.marginBottom_32],
              inputAndroid: [{ ...styles.input, color: theme.colors.secondary},theme?.gutters.marginBottom_32 ],
            }}
          />
        )}
      />
      {errors.feeder && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.feeder.message}</Text>}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? theme.colors.purple250 : theme.colors.purple500 },
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isFormValid}
      >
        <Text style={{ color: theme.colors.gray800, fontSize: 16, fontWeight: '500' }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#FFFFFF', // Ensures title text is visible on dark background
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF', // Improves label visibility
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#1F1F1F', // Dark but distinct background for inputs
    color: '#FFFFFF', // Ensures input text is visible
  },
  error: {
    fontSize: 14,
    marginBottom: 8,
    color: '#FF6B6B', // More visible error color
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
