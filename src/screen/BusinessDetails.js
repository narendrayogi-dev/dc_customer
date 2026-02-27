/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  Pressable,
  Keyboard,
  Dimensions,
  Platform,
  FlatList,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {scale, verticalScale} from '../components/Scaling';
import {Dropdown} from 'react-native-element-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller'

import {async_keys, getData, storeData} from '../api/UserPreference';

//Component
import OTPInput from '../otpInput/OTPInput';

//Shapes
import top_shape from '../assets/personal_detail/top_shape.png';
import bottom_shape from '../assets/personal_detail/bottom_shape.png';

//icon
import ic_back from '../assets/image/back.png';
import ic_next from '../assets/image/forward.png';
import ic_down from '../assets/image/ic_down.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showSnack} from '../components/Snackbar';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import AppIcon from '../components/AppIcon';
import { createAnimatedComponent } from 'react-native-reanimated';
import { useKeyboardPush } from '../hooks/useKeyboardPush';

const {height, width} = Dimensions.get('window');


const AnimatedPressable = createAnimatedComponent(Pressable)

const BusinessDetails = ({navigation, route}) => {
  const [name, setName] = useState('');
  //Custom Dropdown
  const [state, setState] = useState([]);

  const [city, setCity] = useState([]);

  const [itemsState, setItemsState] = useState([]);
  const [itemsCity, setItemsCity] = useState([]);
  const [selectedState, setSelectedState] = useState({
    name: '',
    id: '',
  });
  const [selectedCity, setSelectedCity] = useState({
    name: '',
    id: '',
  });
  const [searchText, setSearchText] = useState('');
  const [searchText1, setSearchText1] = useState('');
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [loader, setLoader] = useState(true);
  //Validation
  const [nameError, setNameError] = useState('');
  const [stateError, setStateError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [otpError, setOtpError] = useState('');
  const inset = useSafeAreaInsets();
  const os = Platform.OS;
  

  const {animatedStyle} = useKeyboardPush()

  //For Otp
  const [otpCode, setOTPCode] = useState('');
  const maximumCodeLength = 4;
  const handleOtp = text => {
    setOtpError('');
    setOTPCode(text.replace(/[^0-9]/g, ''));
  };

  const handleName = text => {
    setNameError('');
    setName(text);
  };

  useEffect(() => {
    fetchData().then(setLoader(false));
    console.log('get props data on business detail', route);
  }, []);

  useEffect(() => {
    fetchCities();
  }, [selectedState, setSelectedState]);

  const fetchData = async () => {
    const businessName = await getData(async_keys.business_name);
    const state = await getData(async_keys.state);
    const city = await getData(async_keys.city);
    const pin = await getData(async_keys.pin);

    if (businessName && state && city && pin) {
      setName(businessName);
      setSelectedState(state);
      setSelectedCity(city);
      setOTPCode(pin);
    }

    try {
      const response = await makeRequest(`${BASE_URL}get_states`);

      if (response) {
        const {Status, Message} = response;
        if (Status === true) {
          const {Data} = response;
          setState(Data);
          setItemsState(Data);
        } else {
          // showSnack('Oops! something went wrong, please try later')
        }
      }
    } catch (error) {
      //  console.log(error.message);
    }
  };

  const fetchCities = async () => {
    try {
      const params = {
        state_id: selectedState.id,
      };

      const response = await makeRequest(`${BASE_URL}get_cities`, params, true);
      if (response) {
        const {Status, Message} = response;
        if (Status === true) {
          const {Data} = response;
          setCity(Data);
          setItemsCity(Data);
          // console.log('data---------->>>', Data);
        }
      }
    } catch (error) {
      //  console.log(error.message);
    }
  };

  // State
  const handleEnableStateDropDown = () => {
    setCheck1(true);

    setSearchText('');
    setItemsState(state);
  };

  let localItemsState = state;
  const handleSearchSourceLocation = text => {
    setSearchText(text);

    const filteredData = localItemsState.filter(item => {
      const searchPattern = text.toUpperCase();

      const {name} = item;
      let newLabel = name.toUpperCase();
      let found = newLabel.indexOf(searchPattern) > -1;

      return found;
    });

    setItemsState(filteredData);
  };

  const handleState = async item => {
    setStateError(false);
    setSelectedState(item);
    setCheck1(false);
  };

  // City
  const handleEnableCityDropDown = () => {
    setCheck2(true);

    setSearchText1('');
    setItemsCity(city);
  };

  let localItemsCity = city;
  const handleSearchSourceLocation1 = text => {
    setSearchText1(text);

    const filteredData = localItemsCity.filter(item => {
      const searchPattern = text.toUpperCase();

      const {name} = item;
      let newLabel = name.toUpperCase();
      let found = newLabel.indexOf(searchPattern) > -1;

      return found;
    });

    setItemsCity(filteredData);
  };

  const handleCity = async item => {
    setCityError(false);
    setSelectedCity(item);
    setCheck2(false);
  };

  // Back
  useEffect(() => {
    const eventListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBack();
        return true;
      },
    );

    return () => eventListener.remove();
  }, [navigation]);

  const handleBack = () => navigation.goBack();

  //Last
  const handleNext = async () => {
    if (name.trim() === '') {
      setNameError('error');
    } else if (name.length < 3) {
      setNameError('invalid');
    }

    if (selectedState.name.trim() === '') {
      setStateError(true);
    }

    if (selectedCity.name.trim() === '') {
      setCityError(true);
    }

    if (otpCode.trim() === '') {
      setOtpError('error');
    } else if (otpCode.length !== 4) {
      setOtpError('invalid');
    }

    if (
      name.trim() === '' ||
      name.length < 3 ||
      selectedState.name.trim() === '' ||
      selectedCity.name.trim() === '' ||
      otpCode.trim() === '' ||
      otpCode.length !== 4
    ) {
      return true;
    }

    await storeData(async_keys.business_name, name);
    await storeData(async_keys.state, selectedState);
    await storeData(async_keys.city, selectedCity);
    await storeData(async_keys.pin, otpCode);

    // showSnack('Submited Successfully');
    navigation.navigate('ChooseBusinessType');
  };

  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="green" size="large" />
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
    );
  }
  return (
    
    <AnimatedPressable style={[styles.container,animatedStyle]} onPress={() => Keyboard.dismiss()}>
      <StatusBar backgroundColor="#1C1CC2" barStyle="light-content" />

      <View style={{height: verticalScale(180)}}>
        <Image
          source={top_shape}
          style={styles.topShape}
          resizeMode="contain"
        />
      </View>
      <Image
        source={bottom_shape}
        style={styles.bottomShape}
        resizeMode="contain"
      />

      <View style={styles.homeContainer}>
        <Text style={styles.header}>Business Details</Text>

        <View
          style={[
            styles.inputContainer,
            (nameError === 'error' || nameError === 'invalid') && styles.error,
          ]}>
          <Text style={styles.inputHeader}>Business Name</Text>
          <TextInput
            testID="nameInput"
            maxLength={50}
            style={styles.inputBox}
            value={name}
            placeholder="Please enter business name"
            placeholderTextColor="#888"
            onChangeText={handleName}
          />
          {nameError === 'error' && (
            <Text style={styles.errorText}>Please enter business name</Text>
          )}
          {nameError === 'invalid' && (
            <Text style={styles.errorText}>Minimum 3 letters required</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.dropDownContainer, stateError && styles.error]}
          onPress={handleEnableStateDropDown}
          activeOpacity={1}>
          <Text style={styles.inputHeader}>State</Text>

          <Text style={styles.loginFormTextInput}>
            {selectedState.name || `Please select state`}
          </Text>

          <Image source={ic_down} style={styles.dropDownIcon} />

          <Modal
            useNativeDriver={true}
            onBackButtonPress={() => {
              setCheck1(false);
            }}
            style={[
              {
                paddingTop: inset.top,
                paddingBottom: inset.bottom,
              },
            ]}
            isVisible={check1}
            onBackdropPress={() => {
              setCheck1(false);
            }}>
            <KeyboardAwareScrollView style={{flex: 1}} behavior="padding">
              <View
                style={{
                  flex: 1,
                  // maxHeight: 800,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                }}>
                <AppIcon
                  reverse
                  type="fa"
                  name="remove"
                  size={wp(5)}
                  color="red"
                  iconStyle={{fontSize: wp(4)}}
                  containerStyle={{
                    position: 'absolute',
                    right: 10,
                    top: 0,
                  }}
                  onPress={() => setCheck1(false)}
                />
                <View style={styles.dropdownList}>
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor={'#838383'}
                    value={searchText}
                    onChangeText={handleSearchSourceLocation}
                    style={styles.dropdownSearchBox}
                  />
                  <FlatList
                    keyExtractor={(item, index) => item?.id || index}
                    data={itemsState}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          style={{
                            height: hp(6),
                            width: wp(80),
                            marginVertical: hp(0.5),
                            borderWidth: 1,
                            borderColor: '#bbb',
                            borderRadius: wp(0.5),
                            flexDirection: 'row',
                          }}
                          onPress={() => handleState(item)}>
                          {/* <Image source={ic_down} style={styles.dropDownIcon} /> */}

                          <Text
                            style={{alignSelf: 'center', marginLeft: wp(2)}}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </Modal>
          {stateError && (
            <Text style={styles.errorText}>Please select state</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dropDownContainer, cityError && styles.error]}
          onPress={handleEnableCityDropDown}
          activeOpacity={1}>
          <Text style={styles.inputHeader}>City</Text>

          <Text style={styles.loginFormTextInput}>
            {selectedCity.name || `Please select city`}
          </Text>

          <Image source={ic_down} style={styles.dropDownIcon} />

          <Modal
            useNativeDriver={true}
            onBackButtonPress={() => {
              setCheck2(false);
            }}
            style={[
              {
                paddingTop: inset.top,
                paddingBottom: inset.bottom,
              },
            ]}
            isVisible={check2}
            onBackdropPress={() => {
              setCheck2(false);
            }}>
            <View
              style={{
                flex: 1,
                // maxHeight: 800,
                borderRadius: 5,
                backgroundColor: '#fff',
              }}>
              <AppIcon
                reverse
                type="fa"
                name="remove"
                size={wp(5)}
                color="red"
                iconStyle={{fontSize: wp(4)}}
                containerStyle={{
                  position: 'absolute',
                  right: 10,
                  top: 0,
                }}
                onPress={() => setCheck2(false)}
              />
              <View style={styles.dropdownList}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor={'#838383'}
                  value={searchText1}
                  onChangeText={handleSearchSourceLocation1}
                  style={styles.dropdownSearchBox}
                />
                <FlatList
                  keyExtractor={(item, index) => item?.id || index}
                  data={itemsCity}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        style={{
                          height: hp(6),
                          width: wp(80),
                          marginVertical: hp(0.5),
                          borderWidth: 1,
                          borderColor: '#bbb',
                          borderRadius: wp(0.5),
                          flexDirection: 'row',
                          // elevation: 1,
                          backgroundColor: '#fff',
                        }}
                        onPress={() => handleCity(item)}>
                        <Text style={{alignSelf: 'center', marginLeft: wp(2)}}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            </View>
          </Modal>
          {cityError && (
            <Text style={styles.errorText}>Please select city</Text>
          )}
        </TouchableOpacity>

        <View
          style={[
            styles.dropDownContainer,
            {paddingVertical: wp(1)},
            (otpError === 'error' || otpError === 'invalid') && styles.error,
          ]}>
          <Text style={styles.dropDownHeader}>Create Pin</Text>
          <OTPInput
            testID="pinInput"
            code={otpCode}
            setCode={handleOtp}
            maximumLength={maximumCodeLength}
            border="bottom"
            isPinCode={true}
            autoFocus={true}
          />
          {otpError === 'error' && (
            <Text style={styles.errorText}>Please enter PIN</Text>
          )}
          {otpError === 'invalid' && (
            <Text style={styles.errorText}>Please enter valid PIN</Text>
          )}
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          testID="backButton"
          style={styles.lower}
          activeOpacity={0.8}
          onPress={handleBack}>
          <Image source={ic_back} style={styles.backIcon} />
          <View style={styles.upper}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          testID="nextButton"
          style={styles.lower}
          activeOpacity={0.8}
          onPress={handleNext}>
          <View style={styles.upper}>
            <Text style={styles.buttonText}>Next</Text>
          </View>
          <Image source={ic_next} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
    </AnimatedPressable>
     
  );
};

export default BusinessDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error: {
    borderColor: 'red',
  },
  topShape: {
    // width: wp(57.7),
    height: hp(30),
    aspectRatio: 1 / 1,
    // position: 'absolute',
    top: hp(-7),
    left: wp(-15),
  },
  bottomShape: {
    width: wp(90),
    height: hp(45),
    position: 'absolute',
    bottom: hp(-17.6),
    right: wp(-35.5),
  },
  homeContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Roboto-Bold',
    marginBottom: hp(3),
  },
  inputContainer: {
    borderWidth: 0.5,
    height: hp(5.5),
    width: wp(70),
    marginVertical: hp(2),
    paddingHorizontal: wp(2),
  },
  inputHeader: {
    position: 'absolute',
    fontFamily: 'Roboto-Bold',
    top: -9.5,
    left: wp(2),
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#000',
  },
  inputBox: {
    flex: 1,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    paddingVertical: 0,
    paddingHorizontal: 0,
    textTransform: 'capitalize',
  },
  errorText: {
    color: 'red',
    fontSize: wp(2.7),
    fontFamily: 'Roboto-Bold',
    position: 'absolute',
    bottom: wp(-4),
    // left: wp(4.5),
  },
  dropDownContainer: {
    borderWidth: 0.5,
    height: hp(5.5),
    width: wp(70),
    marginVertical: hp(2),
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownHeader: {
    position: 'absolute',
    fontFamily: 'Roboto-Bold',
    top: -9.5,
    left: wp(2),
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#000',
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    // flex: 1,
    color: '#000',
  },
  dropdownList: {
    alignItems: 'center',
    flex: 1,
    // marginBottom: hp(3),
    marginHorizontal: wp(3),
    marginVertical: hp(2),
  },
  dropDownIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
  },
  dropdownSearchBox: {
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#c1c1c1',
    width: wp(80),
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dropDownPlaceholder: {
    fontSize: hp(2),
    color: '#999',
    fontFamily: 'Roboto-Regular',
  },
  dropDownSelectedText: {
    fontSize: hp(2),
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  otpContainer: {
    flex: 1,
    marginVertical: hp(2),
    // padding: hp(1),
  },
  underlineStyleBase: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 4, height: 4},
    color: '#000',
    height: hp(4),
    width: wp(12),
    paddingBottom: wp(1),
    textAlign: 'center',
  },
  actionContainer: {
    // bottom: hp(2),
    flexDirection: 'row',
    width: wp(85),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  lower: {
    backgroundColor: '#29B1F4',
    width: wp(28),
    height: hp(5),
    borderRadius: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
  },
  backIcon: {
    width: wp(8),
    height: hp(2.8),
  },
  upper: {
    backgroundColor: '#fff',
    width: wp(20),
    height: hp(5),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
  },
});
