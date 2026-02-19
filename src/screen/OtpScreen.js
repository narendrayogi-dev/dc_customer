/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Pressable,
  Keyboard,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import messaging from '@react-native-firebase/messaging';

import OTPInput from '../otpInput/OTPInput';

import { async_keys, getData, storeData } from '../api/UserPreference';

//Images
import otpImage from '../assets/image/otpImage.png';
import shape from '../assets/image/shape.png';
import rightArrow from '../assets/image/ic_rightArrow.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { showSnack } from '../components/Snackbar';
import { fetchProfileDataRequest } from '../redux/action/profileActions';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { loginSuccess } from '../redux/action/authActions';

const { height, width } = Dimensions.get('window');

//Screen
const OtpScreen = ({ route, navigation }) => {
  const [mobile, setMobile] = useState('');
  const [resendTime, setResendTime] = useState(30);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [filled, setFilled] = useState(false);
  const [loader, setLoader] = useState(false);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [email, setEmail] = useState();

  const { profileData, isLoading } = useSelector(state => state.profile);

  useEffect(() => {
    const fetchDetails = async () => {
      const mobileNum = await getData(async_keys.mobile_number);
      setMobile(mobileNum);

      const email = await getData(async_keys.email);
      setEmail(email);
    };

    fetchDetails();
  }, []);

  
  useEffect(() => {
    if (resendTime === 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setResendTime(resendTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [resendTime]);

  const handleResend = async () => {
    try {
      setLoader(true);
      const params = { mobile };

      const response = await makeRequest(
        `${BASE_URL}customer_register_login_mobile`,
        params,
        true,
      );

      if (response) {
        const { Status, ResponseCode, Message, Data } = response;

        if (Status === true) {
          setLoader(false);
          showSnack(Message);
        } else {
          setLoader(false);
          showSnack(Data, null, true);
        }
      }
    } catch (error) {
      //  console.log(error);
    }
    setResendTime(30);
  };

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
      return true;
    }

    try {
      setLoader(true);
      const user_id = await getData(async_keys.user_id);
      const test = messaging().isDeviceRegisteredForRemoteMessages;

      if (!test) {
        // console.log('rgistering device for remote message');
        await messaging().registerDeviceForRemoteMessages();
      }

      const device_token = await messaging().getToken();

      console.log(device_token, "device tokem");
      
      
      // console.log('device_token', device_token);
      const params = { user_id, otp: otpCode, device_token };

      const response = await makeRequest(`${BASE_URL}verify_otp`, params, true);
      if (response) {
        //  console.log('res-OTP_VERIFY', response);
        const { ResponseCode, Status, Message, Data } = response;
        console.log(response, "response print");
        

        if (Status === true) {
          await storeData(async_keys.user_token, Data.accessToken);
          await storeData(
            async_keys.active_store_code,
            Data.active_store_code || '',
          );
          await storeData(async_keys.is_register, Data.is_register);
         
          if (Data.is_register == 1) {

             dispatch(
            loginSuccess({
              accessToken: Data.accessToken,
              is_register: Data.is_register,
              active_store_code: Data.active_store_code,
            }),
          );
            // navigation.navigate('LoggedIn');
            setLoader(false);
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'PersonalDetail' }],
            });

            setLoader(false);
          }

          showSnack(Message);
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

  const handleLoginWithPin = () => {
    setOtpCode('');
    navigation.navigate('PIN');
  };

  // if (isLoading) {
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

        <Text style={styles.detailText2}>Please enter your OTP</Text>
        {!email ? (
          <Text style={[styles.detailText2, { fontSize: wp(4.8) }]}>
            Sent on +91 {mobile}
          </Text>
        ) : (
          <Text style={[styles.detailText2, { fontSize: wp(4.8) }]}>
            Sent on {email}
          </Text>
        )}

        <ImageBackground
          // style={styles.shapeContainer}
          source={shape}
          resizeMode="stretch"
          style={styles.shapeStyle}
        >
          <View style={styles.otpContainer}>
            <OTPInput
              testID="otpInput"
              code={otpCode}
              setCode={handleOtp}
              maximumLength={maximumCodeLength}
              autoFill
              autoFocus={true}
            />
            {error === 'empty' && (
              <Text style={styles.errorText}>Please enter OTP</Text>
            )}
            {error === 'invalid' && (
              <Text style={styles.errorText}>Please enter valid OTP</Text>
            )}
          </View>

          {resendTime === 0 ? (
            <Text style={{ color: '#999' }}>
              Didn't receive OTP?
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}> Resend</Text>
              </TouchableOpacity>
            </Text>
          ) : (
            <Text style={{ color: '#888' }}>
              <Text style={{ fontFamily: 'Roboto-Medium' }}>Resend </Text>OTP in{' '}
              {resendTime} sec
            </Text>
          )}

          <View style={styles.actionContainer}>
            <TouchableOpacity
              testID="nextButton"
              disabled={!filled}
              style={[
                styles.nextButton,
                !filled && { backgroundColor: '#999' },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextText}>Next</Text>
              <Image source={rightArrow} style={styles.nextIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              testID="loginWithPinButton"
              onPress={handleLoginWithPin}
            >
              <Text style={styles.loginWithPasswordText}>Login with PIN</Text>
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
    // borderColor: 'red',
    // borderWidth: 2,
  },
  detailText: {
    fontSize: wp(6.2),
    fontFamily: 'Roboto-Bold',
    color: '#000',
    marginVertical: hp(1.5),
  },
  detailText2: {
    fontSize: wp(6.2),
    color: '#999',
    fontFamily: 'Roboto-Regular',
  },
  otpContainer: {
    height: hp(6),
    width: wp(68),
    marginVertical: hp(3),
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
