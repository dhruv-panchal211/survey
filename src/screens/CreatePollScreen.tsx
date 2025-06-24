import React, { useEffect, useState,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '@/theme/ThemeProvider/ThemeProvider';

const schema = z.object({
  type: z.enum(['tc', 'pole']),
  tc_number: z.string().min(1, 'TC Number is required'),
  poll_number: z.string().min(1, 'Poll Number is required'),
  status: z.enum(['existing', 'new']),
  previous_connector_type: z.enum(['tc', 'pole']),
  previous_connector_id: z.string().min(1, 'Previous Connector is required'),
});

export default function CreatePollScreen() {
  const [tcOptions, setTcOptions] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [previousConnectorOptions, setPreviousConnectorOptions] = useState([]);

  const [tcOpen, setTcOpen] = useState(false);
  const [previousOpen, setPreviousOpen] = useState(false);

  const [previousConnectorType, setPreviousConnectorType] = useState<'tc' | 'pole'>('tc');
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility state
  const [spanLength, setSpanLength] = useState(''); // Non-editable span length
  const [sag, setSag] = useState(''); // Editable sag value
  const [poleId, setPoleId] = useState(''); // Store the pole ID
  const [poleStatus, setPoleStatus] = useState(''); // Store the pole status
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

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
    mode: 'onChange',
  });

  const type = watch('type');
  const tc_number = watch('tc_number');
  const poll_number = watch('poll_number');
  const previous_connector_type = watch('previous_connector_type');
  const previous_connector_id = watch('previous_connector_id');

  const isFormValid = !!(tc_number && poll_number && previous_connector_id);

  useEffect(() => {
    fetchTransformers();
  }, []);

  useEffect(() => {
    if (type === 'pole' && tc_number) {
      fetchPoles(tc_number);
    }
  }, [type, tc_number]);

  useEffect(() => {
    setValue('previous_connector_id', '');
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
      const transformed = res.data.tcs.map((item) => ({
        label: item.name || item.tc_number || item.poll_number,
        value: item.id,
      }));
      setTcOptions(transformed);
      if (previous_connector_type === 'tc') setPreviousConnectorOptions(transformed);
    } catch {
      Alert.alert('Error', 'Failed to fetch transformers');
    }
  };

  const fetchPoles = async (tc_id: string) => {
    try {
      console.log('Fetching poles for TC ID:', tc_id);
      const res = await axios.get(`${API_URL}/poles?tc_id=${tc_id}`);
      setPollOptions(res.data);
    } catch {
      Alert.alert('Error', 'Failed to fetch poles');
    }
  };

  const fetchPreviousPoles = async (tc_id: string) => {
    try {
      console.log('Fetching previous poles for TC ID:', tc_id);
      const res = await axios.get(`${API_URL}/poles?tc_id=${tc_id}`);
      // setPreviousConnectorOptions(res.data.pole_numbers);
      const poles = res.data.pole_numbers.map((item) => ({
        label: item.name || item.pole_number,
        value: item.id,
      }));
      setPreviousConnectorOptions(poles);
    } catch {
      Alert.alert('Error', 'Failed to fetch previous poles');
    }
  };
  
  const onSubmit = async (data: any) => {
    let hasResponded = false;
  
    const getLocation = (onSuccess, onError) => {
      const optionsHigh = { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 };
      Geolocation.getCurrentPosition(
        (position) => {
          if (!hasResponded) {
            hasResponded = true;
            onSuccess(position);
          }
        },
        () => {
          // Fallback to low accuracy if high accuracy fails
          const optionsLow = { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 };
          Geolocation.getCurrentPosition(
            (position) => {
              if (!hasResponded) {
                hasResponded = true;
                onSuccess(position);
              }
            },
            (error) => {
              if (!hasResponded) {
                hasResponded = true;
                onError(error);
              }
            },
            optionsLow
          );
        },
        optionsHigh
      );
    };
  
    const onSuccess = async (position: any) => {
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
  
      try {
        const res = await axios.post(`${API_URL}/pole`, payload);
        const span_length = res.data.span_length;
        console.log('Span Length:', span_length);
        console.log('Response:', res.data);
        setSpanLength(span_length);
        setIsPopupVisible(true);
        setPoleId(res.data.pole_id);
        setPoleStatus(data.status);
      } catch (error: any) {
        Alert.alert('Error', error?.response?.data?.message || 'Failed to create poll');
      }
    };
  
    const onError = () => {
      Alert.alert('Error', 'Failed to get current location');
    };
  
    getLocation(onSuccess, onError);
  };
  
  const handlePopupSubmit = async() => {
    // Handle the popup submission logic
    try {
      // Make a PATCH API call to update span_length and sag
      console.log({span_length: spanLength,
        sag: parseInt(sag)});
      const response = await axios.patch(`${API_URL}/pole`, {
        span_length: spanLength, // Send span_length in the payload
        sag: parseInt(sag), // Send sag in the payload
      }, {
        params: {
          pole_id: poleId, // Pass pole_id as a query parameter
        },
      });
      console.log('Patch Response:', response.data);
      // Check the response and show appropriate alerts
      if (response.status === 200) {
        console.log('Patch Response:', response.data);
  
        // Show success alert
        Alert.alert('Success', 'Pole details updated successfully');
  
        // Close the popup and navigate to the next screen
        setIsPopupVisible(false);
        poleStatus === 'existing' ? navigation.navigate('AddMaterial', {
          is_existing: poleStatus === 'existing',
          poll_id: poleId,
        }): navigation.navigate('AddNewPoleMaterial', {
          is_existing: poleStatus === 'existing',
          poll_id: poleId,
        });
      } else {
        // Show a generic error alert if the status is not 200
        Alert.alert('Error', 'Failed to update pole details. Please try again.');
      }
    } catch (error) {
      console.log('Error updating pole:', error);
  
      // Show error alert with specific message if available
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'An unexpected error occurred. Please try again.'
      );
    }
  };
  const inputStyle = {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.secondary,
    color: theme.colors.primary,
    fonts: theme?.colors.primary,
    marginBottom: 10,
  };

  const buttonStyle = {
    height: 48,
    backgroundColor: isFormValid ? theme.colors.purple250 : theme.colors.purple500,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  };
  console.log(spanLength);
  return (
    <KeyboardAvoidingView
      style={ [theme.layout.flex_1, theme.backgrounds.primary ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 24, color: theme.colors.secondary }}>
          Create Pole
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 8,color: theme.colors.secondary }}>TC Number</Text>
        <Controller
          control={control}
          name="tc_number"
          render={({ field: { onChange, value } }) => (
            <DropDownPicker
              open={tcOpen}
              setOpen={setTcOpen}
              value={value}
              items={tcOptions}
              setValue={(callback) => {
                const selectedValue = typeof callback === 'function' ? callback(value) : callback;
                console.log('Transformer Selected (setValue):', selectedValue); // Log the selected value
                onChange(selectedValue); // Update the form state with the selected value
              }}
              // onChangeValue={(val) => {
              //   console.log('Transformer Selected:', val); // Log the selected value
              //   onChange(v
              // al); // Update the form state with the selected value
              // }}

              searchable={true}
              placeholder="Select TC Number"
              placeholderTextColor={theme.colors.placeholder}
              // containerStyle={{ marginBottom: tcOpen ? 200 : 10 }}
              style={inputStyle}
              dropDownContainerStyle={[{ zIndex: 3000, height: 200, overflow: 'scroll' },theme?.backgrounds.secondary]}
              dropDownDirection="AUTO"
              listMode="SCROLLVIEW"
              scrollViewProps={{ nestedScrollEnabled: true }}
              flatListProps={{ nestedScrollEnabled: true }}
              
            />
          )}
        />
        <Text style={{ fontSize: 16, marginBottom: 8,color: theme.colors.secondary }}>Pole Number</Text>
        <Controller
          control={control}
          name="poll_number"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={inputStyle}
              placeholder="Poll Number"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={theme.colors.placeholder}
            />
          )}
        />

        <Text style={{ fontSize: 16, marginBottom: 8,color: theme.colors.secondary }}>Status</Text>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', marginBottom: 10,color: theme.colors.secondary }}>
              {['existing', 'new'].map((option) => (
                <View key={option} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                  <RadioButton
                    value={option}
                    status={value === option ? 'checked' : 'unchecked'}
                    onPress={() => onChange(option)}
                  />
                  <Text style={{color: theme.colors.secondary}}>{option}</Text>
                </View>
              ))}
            </View>
          )}
        />

        <Text style={{ fontSize: 16, marginBottom: 8,color: theme.colors.secondary }}>Previous Connector Type</Text>
        <Controller
          control={control}
          name="previous_connector_type"
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: 'row', marginBottom: 10,color: theme.colors.secondary }}>
              {['tc', 'pole'].map((option) => (
                <View key={option} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                  <RadioButton
                    value={option}
                    status={value === option ? 'checked' : 'unchecked'}
                    onPress={() => {
                      onChange(option);
                      setPreviousConnectorType(option);
                    }}
                  />
                  <Text style={{color: theme.colors.secondary}}>{option.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          )}
        />

        <Text style={{ fontSize: 16, marginBottom: 8,color: theme.colors.secondary }}>Previous Connector</Text>
        <View style={{ flex: 1, overflow: 'visible' }}>
          <Controller
            control={control}
            name="previous_connector_id"
            render={({ field: { onChange, value } }) => (
              <DropDownPicker
                open={previousOpen}
                setOpen={setPreviousOpen}
                value={value}
                items={previousConnectorOptions}
                setValue={(callback) => {
                  const selectedValue = typeof callback === 'function' ? callback(value) : callback;
                  console.log('Previous Connector Selected:', selectedValue); // Log the selected value
                  onChange(selectedValue); // Update the form state with the selected value
                }}
                searchable={true}
                placeholder="Select Previous Connector"
                placeholderTextColor={theme.colors.placeholder}
                // containerStyle={{ marginBottom: previousOpen ? 200 : 10, zIndex: 2000 }}
                style={inputStyle}
                dropDownContainerStyle={[{ zIndex: 3000, overflow:'visible' },theme?.backgrounds.secondary]}
                scrollViewProps={{ nestedScrollEnabled: true }} // Enable nested scrolling
                flatListProps={{ nestedScrollEnabled: true }} // Enable nested scrolling for FlatList
                dropDownDirection="AUTO"
                listMode="SCROLLVIEW"
              />
            )}
          />
        </View>

        <TouchableOpacity style={buttonStyle} onPress={handleSubmit(onSubmit)} disabled={!isFormValid}>
          <Text style={{ color: theme.colors.onPrimary, fontSize: 16, fontWeight: '500', opacity: isFormValid?1:0.5 }}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Popup Modal */}
      <Modal visible={isPopupVisible} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.secondary }]}>Additional Details</Text>

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Span Length</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.secondary, color: theme.colors.secondary }]}
            value={spanLength.toString()}
            editable={false} // Non-editable
          />

          <Text style={[styles.label, { color: theme.colors.secondary }]}>Sag</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.secondary, color: theme.colors.secondary }]}
            value={sag}
            onChangeText={setSag} // Editable
            placeholder="Enter Sag"
            placeholderTextColor={theme.colors.secondary}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.purple250 }]}
            onPress={handlePopupSubmit}
          >
            <Text style={[{ fontSize: 16, fontWeight: '500' }]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#E5E7EB",
    marginBottom: 10,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
});