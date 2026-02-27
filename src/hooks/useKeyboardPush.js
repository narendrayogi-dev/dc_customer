import { useAnimatedStyle, useDerivedValue, runOnJS } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { scheduleOnRN } from 'react-native-worklets';

export const useKeyboardPush = (extraSpace = 20, onKeyboardClose) => {
  const { height, progress } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => {
    const offset = height.value * progress.value ;

    return {
      transform: [{ translateY: offset }],
    };
  });

  // 👇 Detect close
  useDerivedValue(() => {
    if (progress.value === 0 && onKeyboardClose) {
      scheduleOnRN(onKeyboardClose);
    }
  });

  return { animatedStyle };
};