/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const SuccessFull = () => {
  return (
    <View style={styles.container}>
      <Text>Account create</Text>
      <Text>SUCCESSFULLY</Text>
    </View>
  );
};

export default SuccessFull;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6CE4B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
