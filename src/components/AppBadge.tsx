import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppBadgeProps {
  value?: number | string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: any;
}

const AppBadge: React.FC<AppBadgeProps> = ({
  value,
  size = 18,
  backgroundColor = '#e53935', // error red
  textColor = '#fff',
  style,
}) => {
  if (!value || value === 0) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          minWidth: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {value}
      </Text>
    </View>
  );
};

export default AppBadge;
const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
