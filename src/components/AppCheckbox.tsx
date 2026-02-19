import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import AppIcon from './AppIcon';

interface AppCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  style?: any;
}

const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked,
  onPress,
  size = 24,
  checkedColor = 'green',
  uncheckedColor = '#000',
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <AppIcon
        type="materialIcons"
        name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={size}
        color={checked ? checkedColor : uncheckedColor}
      />
      {/* <Text>hey</Text> */}
    </TouchableOpacity>
  );
};

export default AppCheckbox;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
