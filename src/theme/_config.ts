import type { ThemeConfiguration } from '@/theme/types/config';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const enum Variant {
  DARK = 'dark',
}

const colorsLight = {
  gray50: '#F8F9FA',
  gray100: '#EDEDED',
  gray200: '#D1D5DB',
  gray400: '#9CA3AF',
  gray800: '#374151',
  purple50: '#F4F3FF',
  purple100: '#DDD6FE',
  purple250: '#7289DA',
  purple500: '#7C3AED',
  red500: '#F87171',
  skeleton: '#D1D5DB',
  inputBackground: '#FDFDFD',
  placeholder: '#A0AEC0',
  primary: '#FAFAFA',
  secondary: '#2D2D2D',
  error: '#F87171',
  link: '#3B82F6',
} as const;

const colorsDark = {
  gray50: '#2C2C2C',
  gray100: '#3B3B3B',
  gray200: '#555555',
  gray400: '#A0A0A0',
  gray800: '#D1D5DB',
  purple50: '#2F2B45',
  purple100: '#4C4177',
  purple250: '#7289DA',
  purple500: '#B4A9F3',
  red500: '#F87171',
  skeleton: '#4B5563',
  inputBackground: '#2A2A2A',
  placeholder: '#888888',
  primary: '#2F2F2F',
  secondary: '#E5E7EB',
  error: '#F87171',
  link: '#60A5FA',
} as const;

const sizes = [12, 16, 24, 32, 40, 80] as const;

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 8,12, 16],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
