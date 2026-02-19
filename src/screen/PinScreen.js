/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Pressable,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import {
  NavigationActions,
  SafeAreaView,
  StackActions,
} from 'react-navigation';
import messaging from '@react-native-firebase/messaging';

//Images
import otpImage from '../assets/image/otpImage.png';
import shape from '../assets/image/shape.png';
import rightArrow from '../assets/image/ic_rightArrow.png';
import google from '../assets/image/ic_google.png';
import facebook from '../assets/image/ic_facebook.png';
import { ImageBackground } from 'react-native';
import OTPInput from '../otpInput/OTPInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { async_keys, getData, storeData } from '../api/UserPreference';
import { showSnack } from '../components/Snackbar';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileDataRequest } from '../redux/action/profileActions';
import Header from '../components/Header';
import { loginSuccess } from '../redux/action/authActions';

const { height, width } = Dimensions.get('window');

// Screen
const OtpScreen = ({ navigation }) => {
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [filled, setFilled] = useState(false);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { profileData, isLoading } = useSelector(state => state.profile);

  //For Otp
  const maximumCodeLength = 4;
  const handleOtp = text => {
    setError('');
    setOtpCode(text.replace(/[^0-9]/g, ''));
  };

  //Enable when otp filled
  useEffect(() => {
    if (otpCode.length === maximumCodeLength) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [otpCode]);

  const handleNext = async () => {
    if (otpCode.trim() === '') {
      setError('empty');
      return true;
    }

    if (otpCode.length !== 4) {
      setError('invalid');
      return;
    }

    try {
      setLoader(true);
      const user_id = await getData(async_keys.user_id);
      const device_token = await messaging().getToken();
      const params = { user_id, pin: otpCode, device_token };

      const response = await makeRequest(`${BASE_URL}verify_otp`, params, true);
      if (response) {
        const { ResponseCode, Status, Message, Data } = response;

        if (Status === true) {
          await storeData(async_keys.user_token, Data.accessToken);
          await storeData(
            async_keys.active_store_code,
            Data.active_store_code || '',
          );
          await storeData(async_keys.is_register, Data.is_register);
          dispatch(loginSuccess({
            accessToken: Data.accessToken,
            is_register: Data.is_register,
            active_store_code: Data.active_store_code,
          }),)
            showSnack(Message);
          // navigation.navigate('LoggedIn');
        } else if (Status === false) {
          setLoader(false);
          setError('invalid');
          showSnack(Message, null, true);
        }
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  const handleLoginWithOtp = () => {
    navigation.goBack();
  };

  // if (loader) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator color="green" size="large" />
  //     </View>
  //   );
  // }
  return (
    <Pressable
      style={[styles.container, { paddingTop: inset.top }]}
      onPress={() => Keyboard.dismiss()}
    >
      {(isLoading || loader) && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            width: wp(100),
            height: hp(100),
            backgroundColor: 'rgba(255,255,255, .5)',
          }}
        >
          <ActivityIndicator color="#000080" size="large" />
          <Text
            style={{
              marginTop: 10,
              color: '#000',
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            Please wait...
          </Text>
        </View>
      )}

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ImageBackground source={otpImage} style={styles.mobile}>
        <Header
          style={{ marginBottom: hp(3), marginLeft: -20 }}
          // title="Return Products"
          width={wp(73)}
          navigation={navigation}
        />
      </ImageBackground>

      <View style={styles.homeContainer}>
        <Text style={styles.detailText}>Hello Again!</Text>
        <Text style={styles.detailText2}>Please enter your PIN</Text>

        <ImageBackground
          // style={styles.shapeContainer}
          source={shape}
          resizeMode="stretch"
          style={styles.shapeStyle}
        >
          <View style={styles.otpContainer}>
            <OTPInput
              testID="pinInput"
              code={otpCode}
              setCode={handleOtp}
              maximumLength={maximumCodeLength}
              autoFocus={true}
            />
            {error === 'empty' && (
              <Text style={styles.errorText}>Please enter PIN</Text>
            )}
            {error === 'invalid' && (
              <Text style={styles.errorText}>Please enter valid PIN</Text>
            )}
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              testID="loginButton"
              disabled={!filled}
              style={[
                styles.nextButton,
                !filled && { backgroundColor: '#999' },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextText}>Login</Text>
              <Image source={rightArrow} style={styles.nextIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              testID="loginWithOtpButton"
              onPress={handleLoginWithOtp}
            >
              <Text style={styles.loginWithPasswordText}>Login with OTP</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: height,
  },
  mobile: {
    width: wp(72.2),
    height: hp(37.6),
    alignSelf: 'center',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  detailText: {
    fontSize: wp(6.2),
    fontFamily: 'Roboto-Bold',
    color: '#000',
    marginVertical: hp(1.5),
  },
  detailText2: {
    fontSize: wp(6.2),
    fontFamily: 'Roboto-Regular',
    color: '#999',
  },
  otpContainer: {
    height: hp(6),
    width: wp(68),
    marginVertical: hp(6),
  },
  errorText: {
    color: 'red',
    fontSize: wp(2.7),
    fontFamily: 'Roboto-Bold',
    // position: 'absolute',
    bottom: wp(-0.5),
    left: wp(3.5),
  },
  resendText: {
    color: 'skyblue',
    fontFamily: 'Roboto-Bold',
    top: 4,
  },
  underlineStyleBase: {
    backgroundColor: '#fff',
    borderWidth: 0,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 4, height: 4 },
    color: '#000',
    height: hp(5.5),
    aspectRatio: 1 / 1,
  },
  shapeStyle: {
    // height: hp(52),
    width: wp(180),
    flex: 1,
    alignItems: 'center',
    // aspectRatio: 5 / 4,
    // transform: [{rotate: '-10deg'}],
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp(5),
    // top: wp(12),
  },
  nextButton: {
    backgroundColor: '#F6CE4B',
    width: wp(50),
    height: hp(5),
    borderRadius: wp(3),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: wp(3),
    alignItems: 'center',
    marginBottom: hp(3),
  },
  nextText: {
    fontFamily: 'Roboto-Bold',
    color: '#000',
    fontSize: wp(4.6),
    marginRight: wp(12),
  },
  nextIcon: {
    width: wp(7),
    aspectRatio: 1 / 1,
  },
  loginWithPasswordText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.3),
  },
});
