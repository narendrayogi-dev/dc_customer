import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

const OTPInput = forwardRef(
  (
    {
      code,
      setCode,
      maximumLength,
      border,
      autoFill,
      autoFocus,
      isPinCode = false,
    },
    ref
  ) => {
    return (
      <View style={styles.OtpInputContainer}>
        <OtpInput
          ref={ref}
          numberOfDigits={maximumLength}
          focusColor="#f7f1ab"
          autoFocus={autoFocus}
          hideStick
          value={code}
          onTextChange={setCode}
          secureTextEntry={false}
          keyboardType="phone-pad"
          textContentType="oneTimeCode"
          autoComplete={autoFill ? 'sms-otp' : 'off'}
          theme={{
            containerStyle: styles.splitBoxContainer,
            pinCodeContainerStyle: isPinCode ? styles.splitBox2 : styles.splitBox,
            pinCodeTextStyle: isPinCode ? styles.pinCodeText : styles.otpText,
            focusedPinCodeContainerStyle: border ? styles.focus2 : styles.focus,
          }}
        />
      </View>
    );
  }
);

export default OTPInput;


const styles = StyleSheet.create({
  OtpInputContainer: {
    justifyContent: 'center',
    width: '100%',
  },

  splitBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  splitBox: {
    borderRadius: 5,
    minWidth: '19%',
    minHeight: '95%',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    backgroundColor: '#fff',
    borderWidth: 0.3,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },

  splitBox2: {
    width: '16%',
    height: 30,
    marginTop: 18,
    borderRadius: 0,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  focus: {
    borderColor: '#f7f1ab',
    borderWidth: 2,
  },

  focus2: {
    borderBottomColor: '#f7f1ab',
    borderBottomWidth: 2,
  },

  otpText: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  pinCodeText: {
    color: '#000',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
  },
});
