/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Pressable,
  Keyboard,
  ImageBackground,
  ActivityIndicator,
  Linking
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {async_keys, getData, storeData} from '../api/UserPreference';

//Images
import img_mobile from '../assets/image/mobile.png';
import ic_shape from '../assets/image/shape.png';
import ic_arrow from '../assets/image/ic_targetArrow.png';
import ic_rightArrow from '../assets/image/ic_rightArrow.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller'
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from '../components/Scaling';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showSnack} from '../components/Snackbar';
import VersionCheck from 'react-native-version-check';

const {width, height} = Dimensions.get('window');


const MobileScreen = ({navigation}) => {
  const [loader, setLoader] = useState(true);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const inset = useSafeAreaInsets();
  const [email, setEmail] = useState();
  const [selectEmail, setSelectEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    fetchDetails();
  }, []);



  const openPlayStore = async () => {
    const packageName = 'com.jwelerydukancustomer';
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=en`;
    const marketUrl = `market://details?id=${packageName}`;
    try {
      const supported = await Linking.canOpenURL(marketUrl);
      if (supported) {
        await Linking.openURL(marketUrl);
      } else {
        await Linking.openURL(playStoreUrl); // Fallback to web link
      }
    } catch (error) {
      console.error("Can't open URL:", error);
      await Linking.openURL(playStoreUrl); // Last fallback
    }
  };

  const checkAppUpdate = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion(); // Play Store se latest version
      const currentVersion = VersionCheck.getCurrentVersion(); // App ka current version
      if (latestVersion !== currentVersion) {
        console.log('latest version check', latestVersion, currentVersion);
        Alert.alert(
          'Update Available',
          'A new version of the app is available. Please update to continue.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Update', onPress: openPlayStore}, // Direct function call
          ],
        );
      }
    } catch (error) {
      console.error('Error checking update:', error);
    }
  };
  // useEffect(() => {
  //   checkAppUpdate();
  // }, []);

  const aa = () => {
    fetch(`${BASE_URL}get_demo_store`)
      .then(res => res.json())
      .then(result => console.log('result', result));
  };

  const fetchDetails = async () => {
    const id = await getData(async_keys.user_type);

    if (id) {
     const routeNames = [
  'PersonalDetail',
  'BusinessDetail',
  'ChooseBusinessType',
  'ChoosePCS',
];

navigation.reset({
  index: routeNames.length - 1, // 3
  routes: routeNames.map(name => ({ name })),
});

      return true;
    }

    const businessName = await getData(async_keys.business_name);
    const state = await getData(async_keys.state);
    const city = await getData(async_keys.city);
    const pin = await getData(async_keys.pin);

    if (businessName && state && city && pin) {
    const routeNames = [
  'PersonalDetail',
  'BusinessDetail',
  'ChooseBusinessType',
];

navigation.reset({
  index: routeNames.length - 1, // 2
  routes: routeNames.map(name => ({ name })),
});

      return true;
    }

    const userName = await getData(async_keys.personal_name);
    const gender = await getData(async_keys.gender);
    const dob = await getData(async_keys.dob);

  if (userName && gender && dob) {
  navigation.reset({
    index: 1,
    routes: [
      {name: 'PersonalDetail'},
      {name: 'BusinessDetail'},
    ],
  });
  return true;
}

    const token = await getData(async_keys.user_token);
    if (token) {
    navigation.reset({
  index: 0,
  routes: [{name: 'PersonalDetail'}],
});


      return true;
    }
    setLoader(false);
  };

  const handleMobileNo = num => {
    setError('');
    const number = num.replace(/[^0-9]/g, '');

    let replacedText;
    if (number.length >= 10) {
      replacedText = number.substring(number.length - 10);
    } else {
      replacedText = number;
    }
    setMobile(replacedText);
  };

  const handleEmail = email => {
    setEmail(email);
  };


  const handleNext = async () => {
    try {
      setLoader(true); // Start loader at the beginning
      let params = {};

      if (!selectEmail) {
        // Validation for mobile
        const mobileRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (mobile.trim() === '') {
          setError('empty');
          setLoader(false);
          return;
        }
        if (!mobileRegex.test(mobile)) {
          setError('invalid');
          setLoader(false);
          return;
        }

        params = {mobile};
        await storeData(async_keys.mobile_number, mobile);
      } else {
        // Validation for email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.trim() === '') {
          setEmailError('empty');
          setLoader(false);
          return;
        }
        if (!emailRegex.test(email)) {
          setEmailError('invalid');
          setLoader(false);
          return;
        }

        params = {email};
        // Optionally store email in async storage
        await storeData(async_keys.email, email);
      }

      console.log('Params for login:', params);

      // API Request
      const response = await makeRequest(
        `${BASE_URL}customer_register_login_mobile`,
        params,
        true,
      );
      console.log('login response show', response);

      if (response) {
        const {Status, Message, Data} = response;
        console.log(Data);

        if (Status) {
          await storeData(async_keys.user_id, Data.user_id);

          navigation.navigate('OTP');
          showSnack(Message);
        } else {
          showSnack(Data, null, true);
        }
      }
    } catch (error) {
      console.log('hdsbnxc 22', error);

      console.error(error);
    } finally {
      setLoader(false); // Stop loader in both success and failure
    }
  };

  return (
    <Pressable
      style={[styles.container, {paddingTop: inset.top}]}
      onPress={() => Keyboard.dismiss()}>
      {loader && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            width: wp(100),
            height: hp(100),
            backgroundColor: 'rgba(255,255,255, .5)',
          }}>
          <ActivityIndicator color="#000080" size="large" />
          <Text
            style={{
              marginTop: 10,
              color: '#000',
              fontSize: 16,
              textAlign: 'center',
            }}>
            Please wait...
          </Text>
        </View>
      )}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={styles.scrollviewContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Image source={img_mobile} style={styles.mobile} resizeMode="contain" />

    

        <View style={styles.homeContainer}>
          <ImageBackground
            source={ic_shape}
            resizeMode="cover"
            style={[
              styles.shapeStyle,
              // {left: 10},
              // os === 'ios' && {top: verticalScale(-35)},
            ]}>
            <View style={styles.ImageBackgroundHomeContainer}>
              <View style={styles.detailContainer}>
                <Text style={styles.detailText}>We want to know you!</Text>
                <Text style={styles.detailText2}>
                  Enter Your{`\n`}Mobile Number Here!
                </Text>
                <Image source={ic_arrow} style={styles.arrowStyle} />
              </View>

              {!selectEmail ? (
                <View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      testID="mobileInput"
                      placeholder="Enter Mobile No."
                      placeholderTextColor="#888"
                      style={styles.mobileInput}
                      // maxLength={10}
                      keyboardType="phone-pad"
                      onChangeText={handleMobileNo}
                      value={mobile}
                      // onFocus={getNumber}
                      textContentType="telephoneNumber"
                      autoComplete="tel"
                    />
                    {error === 'empty' && (
                      <Text style={styles.errorText}>
                        Please enter mobile number
                      </Text>
                    )}
                    {error === 'invalid' && (
                      <Text style={styles.errorText}>
                        Please enter valid mobile number
                      </Text>
                    )}
                  </View>
                  <Text
                    onPress={() => {
                      setSelectEmail(true);
                    }}
                    style={{
                      color: '#fff',
                      top: error ? 15 : 5,
                      fontSize: 12,
                      left: 3,
                    }}>
                    Login With Email
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      testID="emailInput"
                      placeholder="Enter Your Email"
                      placeholderTextColor="#888"
                      style={styles.mobileInput}
                      // maxLength={10}
                      keyboardType="email-address"
                      onChangeText={handleEmail}
                      value={email}
                      // onFocus={getNumber}
                      textContentType="emailAddress"
                      autoComplete="email"
                      autoCapitalize="none"
                    />
                    {emailError === 'empty' && (
                      <Text style={styles.errorText}>Please enter Email</Text>
                    )}
                    {emailError === 'invalid' && (
                      <Text style={styles.errorText}>
                        Please enter valid Email
                      </Text>
                    )}
                  </View>
                  <Text
                    onPress={() => {
                      setSelectEmail(false);
                    }}
                    style={{
                      color: '#fff',
                      top: emailError ? 15 : 5,
                      fontSize: 12,
                      left: 3,
                    }}>
                    Login With Number
                  </Text>
                </View>
              )}

              <TouchableOpacity
                testID="nextButton"
                onPress={handleNext}
                style={styles.nextButton}>
                <Text style={styles.nextText}>Next</Text>
                <Image source={ic_rightArrow} style={styles.nextIcon} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAwareScrollView>
    </Pressable>
  );
};

export default MobileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: '#fff',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollviewContainer: {
    flex: 1,
  },
  mobile: {
    height: verticalScale(7 * 45.1),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
  },
  detailContainer: {
    right: scale(3.6 * -12),
    // bottom: verticalScal7(7*-8),
    top: verticalScale(7 * 4),
  },
  detailText: {
    fontSize: verticalScale(7 * 3.2),
    color: '#777',
    fontFamily: 'Roboto-Regular',
  },
  shapeStyle: {
    height: verticalScale(7 * 47),
    width: width,
  },
  ImageBackgroundHomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: 'red',
    paddingRight: scale(20),
    top: -20,
  },
  detailText2: {
    fontSize: scale(3.6 * 6),
    marginTop: verticalScale(7 * 3.2),
    fontFamily: 'Roboto-Bold',
  },
  arrowStyle: {
    width: scale(3.6 * 35),
    height: verticalScale(7 * 13),
    right: scale(3.6 * -35),
    transform: [{rotate: '-30deg'}],
  },
  inputContainer: {
    backgroundColor: '#fff',
    height: verticalScale(7 * 5),
    width: scale(3.6 * 60),
    borderRadius: verticalScale(7 * 0.8),
    paddingLeft: scale(3.6 * 2),
    borderWidth: 1,
    marginTop: verticalScale(7 * 6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileInput: {
    flex: 1,
    fontSize: scale(3.6 * 4),
    height: verticalScale(7 * 5.8),
    color: '#000',
    fontFamily: 'Roboto-Regular',
    paddingVertical: 0,
  },
  errorText: {
    color: 'red',
    fontSize: scale(3.6 * 2.8),
    fontFamily: 'Roboto-Bold',
    position: 'absolute',
    bottom: scale(3.6 * -4),
  },
  nextButton: {
    backgroundColor: '#F6CE4B',
    width: scale(3.6 * 30),
    height: verticalScale(7 * 4.8),
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: verticalScale(7 * 4),
    marginBottom: verticalScale(7 * 7),
  },
  nextText: {
    fontSize: scale(3.6 * 4.5),
    fontFamily: 'Roboto-Bold',
  },
  nextIcon: {
    width: scale(3.6 * 7),
    aspectRatio: 1 / 1,
  },
});
