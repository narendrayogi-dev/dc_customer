/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';

//Components
import Gradient from '../components/Gradient';
import Header from '../components/Header';

//image
import img_profile from '../assets/image/download.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEditProfileRequest,
  fetchUploadProfileImageRequest,
} from '../redux/action/profileActions';
import ImagePickerComponent from '../components/ImagePickerComponent';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { showSnack } from '../components/Snackbar';
import { clearData } from '../api/UserPreference';
import moment from 'moment';
import { fetchHomeDataRequest } from '../redux/action/homeActions';
import { ActivityIndicator } from 'react-native-paper';
import OTPInput from '../otpInput/OTPInput';
import AppIcon from '../components/AppIcon';
import ShimmerLoader from '../components/ShimmerLoader';
import AppAvatar from '../components/AppAvatar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const gender = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const EditProfile = ({ navigation }) => {
  // const params =
  //   navigation.getState().routes[navigation.getState().index].params;
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [profileImage, setProfileImage] = useState({});
  const [otpError, setOtpError] = useState('');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [otpCode, setOTPCode] = useState('');
  const pinRef = useRef(null)

  const maximumCodeLength = 4;
  const handleOtp = text => {
    setOtpError('');
    setOTPCode(text?.replace(/[^0-9]/g, ''));
  };
  const [inputs, setInputs] = useState({
    name: '',
    store_name: '',
    email: '',
  });
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { profile, error } = useSelector(state => state.home.homeData);
  const { isLoading } = useSelector(state => state.profile);
  useEffect(() => {
    console.log('profile data render on edit profile', profile.pin);
    setInputs({
      name: profile?.name,
      store_name: profile?.store_name,
      email: profile?.email,
    });
    setOTPCode(profile?.pin);
    if(profile?.pin){
      pinRef.current.setValue(profile?.pin)
    }
    setValue(profile?.gender);
    setDate(moment(profile?.dob, 'YYYY-MM-DD').toDate());
    setProfileImage({ uri: profile?.image });
  }, []);

  const handleInputs = (text, key) => {
    setInputs({ ...inputs, [key]: text });
  };

  const handlePicDone = async picData => {
    console.log(picData);
    
    setProfileImage(picData);
  };

  console.log('PROFILE _ IMAGE', profileImage);

  const handleUpdate = () => {

    if(!otpCode){
      setOtpError('error');
      return
    }
    if(otpCode.length !== 4){
      setOtpError('invalid');
      return
    }
    if (profileImage?.type) {
      const { base64, ...image } = profileImage;
      dispatch(fetchUploadProfileImageRequest({ image }));
    }

    const params = {
      dob: moment(date).format('YYYY-MM-DD'),
      name: inputs.name,
      gender: value,
      store_name: inputs.store_name,
      state: profile?.state,
      city: profile?.city,
      email: inputs.email,
      pin: Number(otpCode),
    };
    console.log(params, 'editt');
    dispatch(fetchEditProfileRequest(params));
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure do you want to delete your profile',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => deletingAccount(),
        },
      ],
    );

    const deletingAccount = async () => {
      try {
        const result = await makeRequest(`${BASE_URL}delete_account`);
        if (result) {
          const { Status, Message } = result;
          if (Status === true) {
            console.log('response of delete account ', result);
            showSnack(Message);
            await clearData();
            navigation.navigate('LoggedOut');
          } else {
            showSnack(Message, null, true);
          }
        }
      } catch (error) {
        showSnack(
          'Oops something went wrong. Please try again later',
          // error.message,
          null,
          true,
        );
        //  console.log('error---', error);
      }
    };
  };

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    dispatch(fetchHomeDataRequest(navigation));
  };

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <View
        style={[
          styles.container,
          { paddingTop: inset.top, paddingBottom: inset.bottom },
        ]}
      >
        <StatusBar backgroundColor="#DBD9F6" barStyle="dark-content" />
        <Header
          title="Edit Profile"
          width={wp(65)}
          navigation={navigation}
          // params={params}
        />

        <ImagePickerComponent
          isVisible={imagePickerModal}
          setIsVisible={setImagePickerModal}
          handleDone={handlePicDone}
        />

        {isLoading && (
          <View
            style={{
              position: 'absolute',
              height: hp(100),
              width: wp(100),
              backgroundColor: 'rgba(0,0,0,.5)',
              zIndex: 9999,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                alignSelf: 'center',
                padding: wp(3),
                borderRadius: wp(1),
              }}
            >
              <ActivityIndicator color={'green'} size="large" />
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
          </View>
        )}

        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={colors}
            />
          }
          // contentContainerStyle={{paddingBottom: hp(10)}}
        >
          <View style={styles.homeContainer}>
            {isLoading ? (
              <ShimmerLoader
                loading={true}
                width={wp(30.5)}
                height={wp(30.5)}
                borderRadius={wp(20)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <View style={{ position: 'relative', alignSelf: 'center' }}>
                <AppAvatar
                  uri={profileImage?.uri}
                  placeholder={require('../assets/icons/store_placeholder.jpg')}
                  size={wp(30.5)}
                />

                {/* Camera overlay – SAME as Avatar.Accessory */}
                <TouchableOpacity
                  onPress={() => setImagePickerModal(true)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    bottom: wp(1),
                    right: wp(1),
                    width: wp(9),
                    height: wp(9),
                    borderRadius: wp(4.5),
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 4,
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <AppIcon
                    family="fa"
                    name="camera"
                    size={wp(4.5)}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.personalDetailsContainer}>
              <Text style={styles.title}>PERSONAL DETAILS</Text>

              <View style={styles.nameContainer}>
                <Text style={styles.nameHeader}>Full Name*</Text>
                <AppIcon type="fa" name="user" style={styles.iconStyle} />

                {isLoading ? (
                  <ShimmerLoader
                    loading={true}
                    width={wp(20)}
                    height={wp(3)}
                    borderRadius={wp(20)}
                    style={{ marginLeft: wp(3) }}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <TextInput
                    style={styles.inputBox}
                    value={inputs.name}
                    onChangeText={text => handleInputs(text, 'name')}
                  />
                )}
              </View>

              <View
                style={[styles.nameContainer, { backgroundColor: '#f1f1f1' }]}
              >
                <Text style={styles.nameHeader}>Email*</Text>
                <AppIcon type="fa" name="user" style={styles.iconStyle} />

                {isLoading ? (
                  <ShimmerLoader
                    loading={true} // or isLoading
                    width={wp(20)}
                    height={wp(3)}
                    borderRadius={wp(20)}
                    style={{ marginLeft: wp(3) }}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <TextInput
                    editable={!profile?.email ? true : false}
                    style={styles.inputBox}
                    value={inputs.email}
                    onChangeText={text => handleInputs(text, 'email')}
                    autoCapitalize="none"
                  />
                )}
              </View>

              <View style={styles.secondLineContainer}>
                <View style={styles.DOBContainer}>
                  <Text style={styles.nameHeader}>Gender*</Text>
                  <AppIcon
                    type="fa"
                    name="transgender"
                    size={wp(5)}
                    style={styles.iconStyle}
                  />

                  {isLoading ? (
                    <ShimmerLoader
                      loading={true} // or isLoading
                      width={wp(20)}
                      height={wp(3)}
                      borderRadius={wp(20)}
                      style={{ marginLeft: wp(3) }}
                      shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                    />
                  ) : (
                    <Dropdown
                      style={styles.genderDropdown}
                      placeholderStyle={styles.genderText}
                      selectedTextStyle={styles.genderText}
                      data={gender}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder="Selet Gender"
                      value={value}
                      onChange={item => {
                        setValue(item.value);
                      }}
                    />
                  )}
                </View>

                <TouchableOpacity
                  style={styles.DOBContainer}
                  onPress={() => setOpen(true)}
                >
                  <Text style={styles.nameHeader}>DOB*</Text>
                  <AppIcon
                    type="fa"
                    name="calendar"
                    size={wp(5)}
                    style={styles.iconStyle}
                  />

                  {isLoading ? (
                    <ShimmerLoader
                      loading={true} // or isLoading
                      width={wp(20)}
                      height={wp(3)}
                      borderRadius={wp(20)}
                      style={{ marginLeft: wp(3) }}
                      shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                    />
                  ) : (
                    <Text style={styles.DOBText}>
                      {moment(date).format('DD/MM/YYYY')}
                    </Text>
                  )}
                  <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    maximumDate={new Date()}
                    theme="light"
                    textColor="#000"
                    onConfirm={d => {
                      setOpen(false);
                      setDate(d);
                      setDateSelected(true);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.title, { marginTop: hp(1) }]}>
                BUSINESS DETAILS
              </Text>
              <View
                style={[
                  styles.addressContainer,
                  Platform.OS === 'ios' && { paddingVertical: hp(1.5) },
                ]}
              >
                <Text style={styles.nameHeader}>Business Name*</Text>
                <AppIcon type="material" name="location-on" />

                {isLoading ? (
                  <View>
                    <ShimmerLoader
                      loading={true} // or isLoading
                      width={wp(30)}
                      height={wp(3)}
                      borderRadius={wp(20)}
                      style={{
                        marginLeft: wp(3),
                        marginVertical: wp(2.5),
                      }}
                      shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                    />

                    <ShimmerLoader
                      loading={true} // or isLoading
                      width={wp(30)}
                      height={wp(3)}
                      borderRadius={wp(20)}
                      style={{
                        marginLeft: wp(3),
                        marginBottom: wp(2.5),
                      }}
                      shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                    />
                  </View>
                ) : (
                  <TextInput
                    multiline
                    textAlignVertical="center"
                    style={styles.addressInputBox}
                    value={inputs.store_name}
                    onChangeText={text => handleInputs(text, 'store_name')}
                  />
                )}
              </View>

              <View style={styles.mobNoContainer}>
                <Text style={styles.nameHeader2}>Contact Number*</Text>
                <AppIcon
                  type="fa"
                  name="mobile"
                  style={{ marginLeft: wp(2) }}
                />

                {isLoading ? (
                  <ShimmerLoader
                    loading={true} // or isLoading
                    width={wp(30)}
                    height={wp(3)}
                    borderRadius={wp(20)}
                    style={{ marginLeft: wp(3) }}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <Text style={styles.mobNoText}>{profile?.mobile}</Text>
                )}
              </View>

              <View style={styles.mobNoContainer}>
                <Text style={styles.nameHeader2}>State*</Text>
                <AppIcon type="material" name="location-on" />

                {isLoading ? (
                  <ShimmerLoader
                    loading={isLoading} // or true
                    width={wp(30)}
                    height={wp(3)}
                    borderRadius={wp(20)}
                    style={{ marginLeft: wp(3) }}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <Text style={styles.mobNoText}>{profile?.state}</Text>
                )}
              </View>

              <View style={styles.mobNoContainer}>
                <Text style={styles.nameHeader2}>City*</Text>
                <AppIcon type="material" name="location-on" />

                {isLoading ? (
                  <ShimmerLoader
                    loading={true} // or isLoading
                    width={wp(30)}
                    height={wp(3)}
                    borderRadius={wp(20)}
                    style={{ marginLeft: wp(3) }}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <Text style={styles.mobNoText}>{profile?.city}</Text>
                )}
              </View>

              <View style={styles.mobNoContainer}>
                <Text style={styles.nameHeader2}>Type*</Text>
                <AppIcon type="material" name="category" />

                {isLoading ? (
                  <ShimmerLoader
                    loading={isLoading} // or true
                    width={wp(30)}
                    height={wp(3)}
                    borderRadius={wp(20)}
                    style={{ marginLeft: wp(3) }}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <Text style={styles.mobNoText}>{profile?.user_type}</Text>
                )}
              </View>
            </View>

            <View
              style={[
                styles.dropDownContainer,
                { paddingVertical: wp(1) },
                (otpError === 'error' || otpError === 'invalid') &&
                  styles.error,
              ]}
            >
              <Text style={styles.dropDownHeader}>Create Pin</Text>
              <OTPInput
              ref={pinRef}
                testID="pinInput"
                code={String(otpCode)}
                isPinCode
                setCode={handleOtp}
                maximumLength={maximumCodeLength}
                border="bottom"
                autoFocus={true}
              />
            
            </View>
  {otpError === 'error' && (
                <Text style={styles.errorText}>Please enter PIN</Text>
              )}
              {otpError === 'invalid' && (
                <Text style={styles.errorText}>Please enter valid PIN</Text>
              )}
            <TouchableOpacity
              onPress={handleUpdate}
              style={styles.updateButton}
            >
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete Profile</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Gradient>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: hp(7),
    borderTopRightRadius: hp(7),
    alignItems: 'center',
    paddingTop: hp(1),
    elevation: 5,
    shadowOffset: { x: 0, y: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.5,
    marginTop: hp(0.5),
  },
  profileEditContainer: {
    backgroundColor: '#F6CE4B',
    width: wp(8),
    height: hp(4),
    borderRadius: hp(5),
  },
  personalDetailsContainer: {
    width: wp(80),
    marginVertical: hp(3),
  },
  title: {
    color: '#838383',
    fontSize: wp(3.5),
    marginBottom: hp(2),
    fontFamily: 'Roboto-Black',
  },
  iconStyle: {
    marginLeft: wp(1.5),
  },
  nameContainer: {
    // borderWidth: 0.5,
    height: hp(5.5),
    marginVertical: hp(2),
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(0.7),
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: '#fff',
  },
  nameHeader: {
    position: 'absolute',
    fontWeight: '600',
    fontSize: wp(3),
    top: hp(-1.1),
    left: wp(2),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  inputBox: {
    flex: 1,
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(3),
    color: '#666',
  },
  secondLineContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  DOBContainer: {
    // borderWidth: 0.5,
    height: hp(5.5),
    marginVertical: hp(2),
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(38),
    borderRadius: wp(0.7),
    backgroundColor: '#fff',
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  genderDropdown: {
    flex: 1,
    marginLeft: wp(2),
    paddingHorizontal: 8,
  },
  genderText: {
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(1),
    color: '#838383',
  },
  DOBText: {
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(3),
    color: '#838383',
  },
  addressContainer: {
    // borderWidth: 0.5,
    marginVertical: hp(2),
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(0.7),
    backgroundColor: '#fff',
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  addressInputBox: {
    flex: 1,
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(3),
  },
  mobNoContainer: {
    // borderWidth: 0.5,
    backgroundColor: '#f1f1f1',
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    height: hp(6.5),
    marginVertical: hp(1.5),
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(0.7),
  },
  nameHeader2: {
    position: 'absolute',
    fontWeight: '600',
    fontSize: wp(3),
    top: hp(-1.1),
    left: wp(2),
    // backgroundColor: '#f1f1f1',
    textAlign: 'center',
  },
  mobNoText: {
    flex: 1,
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(3),
    color: '#838383',
  },
  updateButton: {
    backgroundColor: '#F6CE4B',
    height: hp(6),
    width: wp(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(1),
    marginTop: hp(3),
  },
  updateButtonText: {
    fontWeight: '700',
  },
  deleteButton: {
    borderBottomColor: '#FF1717',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(6),
  },
  deleteButtonText: {
    fontFamily: 'Roboto-Black',
    color: '#FF1717',
  },
  dropDownContainer: {
    borderWidth: 0.5,
    height: hp(5.5),
    width: wp(75),
    // marginVertical: hp(2),
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
  errorText:{
    color:'red',
    fontSize:wp(3)
  }
});
