import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const PreventAnyTap = ({withLoader}) => {
  return (
    <View style={styles.preventAnyTap}>
      {withLoader && <ActivityIndicator color="green" size="large" />}
    </View>
  );
};

export default PreventAnyTap;

const styles = StyleSheet.create({
  preventAnyTap: {
    position: 'absolute',
    height: hp(100),
    width: wp(100),
    zIndex: 999,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
