import type { UnionConfiguration } from '@/theme/types/config';
import type { FontColors, FontSizes } from '@/theme/types/fonts';
import type { TextStyle } from 'react-native';

import { config } from '@/theme/_config';

export const generateFontColors = (configuration: UnionConfiguration) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.entries(configuration.fonts.colors).reduce<FontColors>(
    (accumulator, [key, value]) => {
      return Object.assign(accumulator, {
        [key]: {
          color: value,
        },
      });
    },
    {} as FontColors,
  );
};

export const generateFontSizes = () => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return config.fonts.sizes.reduce<FontSizes>((accumulator, size) => {
    return Object.assign(accumulator, {
      [`size_${size}`]: {
        fontSize: size,
      },
    });
  }, {} as FontSizes);
};

export const staticFontStyles = {
  alignCenter: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  "title": { "fontSize": 24, "fontWeight": "bold" },
  "medium": { "fontSize": 16 },
  "small": { "fontSize": 12 },
} as const satisfies Record<string, TextStyle>;
