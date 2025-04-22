import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePollStore } from '../stores/pollStore';
import { COLORS, SPACING, FONTS } from '../config';

const DEFAULT_INPUTS = Array.from({ length: 20 }, (_, i) => ({
  id: `input_${i + 1}`,
  label: `Input ${i + 1}`,
  defaultValue: '0',
}));

export default function WizardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { submitPoll } = usePollStore();

  const { control, handleSubmit } = useForm({
    defaultValues: DEFAULT_INPUTS.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.defaultValue,
    }), {}),
  });

  const onSubmit = async (data) => {
    try {
      await submitPoll({
        ...route.params,
        inputs: data,
      });
      navigation.navigate('TCNumber');
    } catch (error) {
      console.error('Error submitting poll:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Poll Details</Text>

      {DEFAULT_INPUTS.map((input) => (
        <View key={input.id} style={styles.inputContainer}>
          <Text style={styles.label}>{input.label}</Text>
          <Controller
            control={control}
            name={input.id}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.medium,
    fontSize: 16,
  },
});