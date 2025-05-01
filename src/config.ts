export const API_URL = 'https://polllocator-1.onrender.com';

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  background: '#f8fafc',
  white: '#ffffff',
  black: '#000000', // ✅ added for styles.color: COLORS.black
  gray: '#d1d5db',   // ✅ added for picker border color
  error: '#ef4444',
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
  },
};

export const SPACING = {
  xs: 4,
  small: 8,     // ✅ added to match SPACING.small used in styles
  medium: 16,   // ✅ added to match SPACING.medium
  large: 24,    // ✅ added to match SPACING.large
  xl: 32,
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: 16, // ✅ added as used as fontSize: FONTS.medium
  bold: 18,
};