import React from 'react';
import {StyleSheet} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerLoader = ({
  loading = true,
  width = '100%',
  height = 20,
  borderRadius = 6,
  style,
  shimmerColors = ['#E5E4E2', '#f2f2f2', '#E5E4E2'],
}) => {
  return (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient}
      visible={!loading}
      shimmerColors={shimmerColors}
      style={[
        styles.base,
        {width, height, borderRadius},
        style,
      ]}
    />
  );
};

export default ShimmerLoader;

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
