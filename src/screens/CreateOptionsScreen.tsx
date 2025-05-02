import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONTS } from '../config';

export default function CreateOptionsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feederId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose an action</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatePoll')}
      >
        <Text style={styles.buttonText}>Create Poll</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateTC', { feederId })}
      >
        <Text style={styles.buttonText}>Create TC</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PollForm')}
      >
        <Text style={styles.buttonText}>Change Feeder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.large,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '500',
  },
});
