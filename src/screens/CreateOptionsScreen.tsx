import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFeederStore } from '../stores/pollStore';
import { ThemeContext } from '@/theme/ThemeProvider/ThemeProvider';

export default function CreateOptionsScreen() {
  const navigation = useNavigation();
  const feederId = useFeederStore((state) => state.feederId);
  const theme = useContext(ThemeContext);

  return (
    <View style={[theme.layout.flex_1, theme.gutters.largePadding, theme.backgrounds.primary, { justifyContent: 'center' }]}>
      <Text style={[theme.fonts.title, theme.fonts.secondary, theme.fonts.alignCenter, theme.gutters.largeMarginBottom]}>
        Choose an action
      </Text>

      <TouchableOpacity
        style={[
          theme.backgrounds.secondary,
          theme.borders.rounded_8,
          theme.gutters.mediumPaddingVertical,
          theme.gutters.mediumPaddingHorizontal,
          theme.gutters.mediumMarginBottom,
          { alignItems: 'center' },
        ]}
        onPress={() => navigation.navigate('CreatePoll')}
      >
        <Text style={[theme.fonts.medium, theme.fonts.primary]}>Create Pole</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          theme.backgrounds.secondary,
          theme.borders.rounded_8,
          theme.gutters.mediumPaddingVertical,
          theme.gutters.mediumPaddingHorizontal,
          theme.gutters.mediumMarginBottom,
          { alignItems: 'center' },
        ]}
        onPress={() => navigation.navigate('CreateTC', { feederId })}
      >
        <Text style={[theme.fonts.medium, theme.fonts.primary]}>Create TC</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          theme.backgrounds.secondary,
          theme.borders.rounded_8,
          theme.gutters.mediumPaddingVertical,
          theme.gutters.mediumPaddingHorizontal,
          theme.gutters.mediumMarginBottom,
          { alignItems: 'center' },
        ]}
        onPress={() => navigation.navigate('PollForm')}
      >
        <Text style={[theme.fonts.medium, theme.fonts.primary]}>Change Feeder</Text>
      </TouchableOpacity>
    </View>
  );
}
