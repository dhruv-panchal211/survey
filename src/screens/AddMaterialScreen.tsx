import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { COLORS, SPACING, FONTS, API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

export default function AddMaterialScreen({ route }) {
  const navigation = useNavigation();

  const { is_existing, poll_id } = route.params;
  const [questions, setQuestions] = useState<string[]>([]);
  const [formItems, setFormItems] = useState<
    { question: string; answer: string }[]
  >([]);
  const [availableQuestions, setAvailableQuestions] = useState<string[]>([]);

  const { control, watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      currentQuestion: '',
      currentAnswer: '',
    },
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_URL}/questions`);
      const questionSet = is_existing
        ? res.data[0].existingQuestions
        : res.data[1].proposedQuestion;
      setQuestions(questionSet);
      setAvailableQuestions(questionSet);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch material questions');
    }
  };

  const onAddItem = ({ currentQuestion, currentAnswer }) => {
    if (!currentQuestion || !currentAnswer) return;
    setFormItems((prev) => [
      ...prev,
      { question: currentQuestion, answer: currentAnswer },
    ]);
    setAvailableQuestions((prev) => prev.filter((q) => q !== currentQuestion));
    reset();
  };

  const onDeleteItem = (question: string) => {
    setFormItems((prev) => prev.filter((item) => item.question !== question));
    setAvailableQuestions((prev) => [...prev, question]);
  };

  const onSubmit = async () => {
    const payload = formItems.reduce((acc, item) => {
      acc[item.question] = item.answer;
      return acc;
    }, {});

    const poleType = is_existing ? 'existing' : 'new_proposed';
    try {
      const res = await axios.post(
        `${API_URL}/material-info/${poll_id}?poleType=${poleType}`,
        payload,
      );
      console.log({ poleType: res });
      navigation.navigate('PollForm');
      Alert.alert('Success', 'Material info submitted successfully');
    } catch (err) {
      console.log({
        err,
        payload,
        url: `${API_URL}/material-info/${poll_id}?poleType=${poleType}`,
        poll_id,
      });
      Alert.alert('Error', 'Submission failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Material Details</Text>

      <Text style={styles.label}>Select Question</Text>
      <Controller
        control={control}
        name="currentQuestion"
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            value={value}
            items={availableQuestions.map((q) => ({ label: q, value: q }))}
            placeholder={{ label: 'Select a question', value: null }}
            style={pickerSelectStyles}
          />
        )}
      />

      <Text style={styles.label}>Answer</Text>
      <Controller
        control={control}
        name="currentAnswer"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter answer"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onAddItem)}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: SPACING.large }]}>
        Added Items
      </Text>
      <FlatList
        data={formItems}
        keyExtractor={(item) => item.question}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: SPACING.small,
            }}
          >
            <Text>
              {item.question}: {item.answer}
            </Text>
            <TouchableOpacity onPress={() => onDeleteItem(item.question)}>
              <Text style={{ color: COLORS.error }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={[
          styles.button,
          formItems.length === 0 && { backgroundColor: COLORS.gray },
        ]}
        onPress={onSubmit}
        disabled={formItems.length === 0}
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
    fontSize: 22,
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
