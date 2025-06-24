import React, { useEffect, useState,useContext } from 'react';
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
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { COLORS, SPACING, FONTS, API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '@/theme/ThemeProvider/ThemeProvider';

export default function AddExistingPoleMaterial({ route }) {
  const navigation = useNavigation();

  const { is_existing, poll_id } = route.params;
  const [questions, setQuestions] = useState<string[]>([]);
  const [formItems, setFormItems] = useState<
    { question: string; answer: string }[]
  >([]);
  const [availableQuestions, setAvailableQuestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    [{label:'', value:''}]);

  const { control, watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      currentQuestion: '',
      currentAnswer: '',
    },
  });
  
  const theme = useContext(ThemeContext);
 
  // Watch the values of the form fields
  const currentQuestion = watch('currentQuestion');
  const currentAnswer = watch('currentAnswer');

  useEffect(() => {
    setItems(availableQuestions.map((question) => ({
      label: question,
      value: question,
    })))},[availableQuestions]);
  useEffect(() => {
    fetchQuestions();
  }, []);
  const pickerSelectStyles = 
  {
    fontSize: FONTS.medium,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    color: COLORS.black,
    paddingRight: 30,
    marginBottom: SPACING.small,
    height: 48
  };


  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_URL}/questions`);
      const existingSet = res.data[0].existingQuestions;
      // const proposedSet = new Set(res.data[0].proposedQuestions);
      // const questionSet = is_existing
        // ? new Set([...existingSet, ...proposedSet])
        // : new Set(res.data[1].proposedQuestion);
        // const questionSetArray = Array.from(questionSet);
        // console.log(questionSetArray);
      setQuestions(existingSet);
      setAvailableQuestions(existingSet);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch material questions');
    }
  };

  const onAddItem = ({ currentQuestion, currentAnswer }) => {
    console.log(65, currentQuestion, currentAnswer);
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
      navigation.navigate('AddNewPoleMaterial',{
        is_existing: false,
        poll_id: poll_id,
      });
      Alert.alert('Success', 'Existing Material info submitted successfully');
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
    <View style={[styles.container, theme.backgrounds.primary]}>
      <Text style={[styles.title, theme.fonts.secondary]}>Add Existing Material Details</Text>

      <Text style={[styles.label, theme.fonts.secondary]}>Select Question</Text>
      <Controller
        control={control}
        name="currentQuestion"
        render={({ field: { onChange, value } }) => {

          return (
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => {
                const selectedValue = typeof callback === 'function' ? callback(value) : callback;
                onChange(selectedValue); // Update the form state with the selected value
              }}
              setItems={setItems}
              searchable={true}
              placeholder="Select a question"
              placeholderTextColor={theme.colors.placeholder}
              style={[pickerSelectStyles, theme?.fonts.secondary, theme.backgrounds.secondary]}
              dropDownContainerStyle={[{ zIndex: 3000, height: 200, overflow: 'scroll' },theme?.backgrounds.secondary]}
              dropDownDirection="AUTO"
              listMode="SCROLLVIEW"
              scrollViewProps={{ nestedScrollEnabled: true }}
              flatListProps={{ nestedScrollEnabled: true }}
            />
          );
        }}
      />

      <Text style={[styles.label, theme.fonts.secondary]}>Answer</Text>
      <Controller
        control={control}
        name="currentAnswer"
        render={({ field: { onChange, value } }) => {
          // Conditional rendering based on the selected question
          if (watch('currentQuestion') === 'Type of Arrangement') {
            return (
              <View>
                <Text style={[styles.label, theme.fonts.secondary]}>Select Type of Arrangement</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
                    onPress={() => onChange('3Ph')}
                  >
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.colors.secondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 5,
                      }}
                    >
                      {value === '3Ph' && (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: theme.colors.secondary,
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ color: theme.colors.secondary }}>3Ph</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => onChange('1Ph')}
                  >
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.colors.secondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 5,
                      }}
                    >
                      {value === '1Ph' && (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: theme.colors.secondary,
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ color: theme.colors.secondary }}>1Ph</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          // Default TextInput for other questions
          return (
            <TextInput
              style={styles.input}
              placeholder="Enter answer"
              onChangeText={onChange}
              value={value}
            />
          );
        }}
      />

      <TouchableOpacity style={[
        styles.button,{ backgroundColor: theme?.colors.purple250 },
        (!currentQuestion || !currentAnswer) && { backgroundColor: theme?.colors.purple500 }, // Change button style when disabled
      ]}
      onPress={handleSubmit(onAddItem)}
      disabled={!currentQuestion || !currentAnswer} // Disable the button if either field is empty
>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <Text style={[styles.label, theme?.fonts.secondary,{ marginTop: SPACING.large }]}>
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
            <Text style={[theme.fonts.secondary, { flex: 1 }]}>
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
          styles.button,{ backgroundColor: theme?.colors.purple250 },
          formItems.length === 0 && { backgroundColor: theme?.colors.purple500 },
        ]}
        onPress={onSubmit}
        disabled={formItems.length === 0}
      >
        <Text style={[styles.buttonText, theme?.fonts.secondary]}>Submit</Text>
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

