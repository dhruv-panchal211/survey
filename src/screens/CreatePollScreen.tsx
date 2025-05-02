import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { COLORS, FONTS, SPACING, API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

const schema = z.object({
  type: z.enum(['tc', 'pole']),
  tc_number: z.string().min(1, 'TC Number is required'),
  poll_number: z.string().min(1, 'Poll Number is required'),
  status: z.enum(['existing', 'new']),
  previous_connector_type: z.enum(['tc', 'pole']),
  previous_connector_id: z.string().optional(),
});

export default function CreatePollScreen() {
  const [type, setType] = useState<'tc' | 'pole'>('tc');
  const [tcOptions, setTcOptions] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [previousConnectorType, setPreviousConnectorType] = useState<
    'tc' | 'pole'
  >('tc');
  const [previousConnectorOptions, setPreviousConnectorOptions] = useState([]);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'tc',
      status: 'new',
      previous_connector_type: 'tc',
    },
  });

  const tc_number = watch('tc_number');
  const previous_connector_type = watch('previous_connector_type');

  const poll_number = watch('poll_number');
  const previous_connector_id = watch('previous_connector_id');

  const isFormValid = !!(tc_number && poll_number && previous_connector_id);

  useEffect(() => {
    fetchTransformers();
  }, []);

  useEffect(() => {
    if (type === 'pole' && tc_number) fetchPoles(tc_number);
  }, [type, tc_number]);

  useEffect(() => {
    if (previous_connector_type === 'tc') {
      setPreviousConnectorOptions(tcOptions);
      setValue('previous_connector_id', null);
    } else if (previous_connector_type === 'pole' && tc_number) {
      fetchPreviousPoles(tc_number);
      setValue('previous_connector_id', null);
    }
  }, [previous_connector_type, tcOptions, tc_number]);

  const fetchTransformers = async () => {
    try {
      const res = await axios.get(`${API_URL}/transformer`);
      setTcOptions(res.data.tcs);
      if (previous_connector_type === 'tc')
        setPreviousConnectorOptions(res.data.tcs);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch transformers');
    }
  };

  const fetchPoles = async (tc_id: string) => {
    try {
      const res = await axios.get(`${API_URL}/poles?tc_id=${tc_id}`);
      setPollOptions(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch poles');
    }
  };

  const fetchPreviousPoles = async (tc_id: string) => {
    try {
      const res = await axios.get(`${API_URL}/poles?tc_id=${tc_id}`);
      console.log({ resPoll: res });
      console.log({ previousConnectorOptions });
      setPreviousConnectorOptions(res.data.pole_numbers);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch poles');
    }
  };

  const onSubmit = async (data: any) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const payload = {
          tc_id: data.tc_number,
          pole_number: data.poll_number,
          is_existing: data.status === 'existing',
          previous_connector_type: data.previous_connector_type,
          previous_connector_id: data.previous_connector_id,
          lat: latitude,
          long: longitude,
        };
        console.log('Submitted data:', payload);
        try {
          const res = await axios.post(`${API_URL}/pole`, payload);
          console.log({ res: res.data.pole_id });
          navigation.navigate('AddMaterial', {
            is_existing: data.status === 'existing',
            poll_id: res.data.pole_id,
          });
          Alert.alert('Success', 'Pole created successfully');
        } catch (error: any) {
          console.log({ error });
          Alert.alert(
            'Error',
            error?.response?.data?.message || 'Failed to create poll',
          );
        }
      },
      (error) => {
        Alert.alert('Error', 'Failed to get current location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Poll</Text>

      <Text style={styles.label}>TC Number</Text>
      <Controller
        control={control}
        name="tc_number"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            value={value}
            items={tcOptions.map((item) => ({
              label: item.name || item.tc_number || item.poll_number,
              value: item.id,
            }))}
            placeholder={{ label: 'Select an option', value: null }}
            style={pickerSelectStyles}
          />
        )}
      />

      <Text style={styles.label}>Poll Number</Text>
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

      <Text style={styles.label}>Status</Text>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <View style={styles.radioGroup}>
            {['existing', 'new'].map((option) => (
              <View key={option} style={styles.radioOption}>
                <RadioButton
                  value={option}
                  status={value === option ? 'checked' : 'unchecked'}
                  onPress={() => onChange(option)}
                />
                <Text>{option}</Text>
              </View>
            ))}
          </View>
        )}
      />

      <Text style={styles.label}>Previous Connector Info</Text>
      <Controller
        control={control}
        name="previous_connector_type"
        render={({ field: { onChange, value } }) => (
          <View style={styles.radioGroup}>
            {['tc', 'pole'].map((option) => (
              <View key={option} style={styles.radioOption}>
                <RadioButton
                  value={option}
                  status={value === option ? 'checked' : 'unchecked'}
                  onPress={() => {
                    onChange(option);
                    setPreviousConnectorType(option);
                  }}
                />
                <Text>{option.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}
      />

      <Controller
        control={control}
        name="previous_connector_id"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            value={value}
            items={previousConnectorOptions.map((item) => ({
              label: item.name || item.tc_number || item.pole_number,
              value: item.id,
            }))}
            placeholder={{ label: 'Select an option', value: null }}
            style={pickerSelectStyles}
          />
        )}
      />

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
  label: {
    fontSize: FONTS.medium,
    color: COLORS.black,
    marginBottom: SPACING.small,
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
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.medium,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: FONTS.medium,
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
    fontSize: FONTS.medium,
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
