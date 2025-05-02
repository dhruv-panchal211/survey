import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL, COLORS, SPACING, FONTS } from '../config';

const pollFormSchema = z.object({
  division: z.string().min(1, 'Division is required'),
  subdivision: z.string().min(1, 'Sub-division is required'),
  feeder: z.string().min(1, 'Feeder is required'),
});

type PollForm = z.infer<typeof pollFormSchema>;

export default function PollFormScreen() {
  console.log('in pole form screen');
  const navigation = useNavigation();
  const [divisions, setDivisions] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [feeders, setFeeders] = useState([]);

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
      console.log(response.data);
      setDivisions(response.data.divisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchSubdivisions = async (divisionId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/recommendations?division_id=${divisionId}`,
      );
      console.log({ response });
      setSubdivisions(response.data.subdivisions);
    } catch (error) {
      console.error('Error fetching subdivisions:', error);
    }
  };

  const fetchFeeders = async (subdivisionId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/recommendations?subdivision_id=${subdivisionId}`,
      );
      console.log({ response });
      setFeeders(response.data.feeders);
    } catch (error) {
      console.error('Error fetching feeders:', error);
    }
  };

  const onSubmit = (data: PollForm) => {
    console.log('Form Data:', data);
    // Handle form submission
    navigation.navigate('CreateOptions', { feederId: data.feeder });
  };

  console.log({ divisions });
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Division</Text>
      {divisions.length && (
        <Controller
          control={control}
          name="division"
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              onValueChange={onChange}
              items={divisions?.map((division) => ({
                label: division.name,
                value: division.id,
              }))}
              value={value}
              placeholder={{ label: 'Select a division', value: null }}
              style={pickerSelectStyles}
            />
          )}
        />
      )}
      {/* {errors.division && <Text style={styles.error}>{errors.division.message}</Text>} */}

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
            style={pickerSelectStyles}
          />
        )}
      />
      {/* {errors.subdivision && <Text style={styles.error}>{errors.subdivision.message}</Text>} */}

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
            style={pickerSelectStyles}
          />
        )}
      />
      {/* {errors.feeder && <Text style={styles.error}>{errors.feeder.message}</Text>} */}

      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && { backgroundColor: COLORS.gray },
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    paddingTop: '50%',
  },
  label: {
    fontSize: FONTS.medium,
    color: COLORS.black,
    marginBottom: SPACING.small,
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.small,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    alignItems: 'center',
    marginTop: SPACING.large,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    color: COLORS.black,
    paddingRight: 30,
    marginBottom: SPACING.small,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    color: COLORS.black,
    paddingRight: 30,
    marginBottom: SPACING.small,
  },
};
