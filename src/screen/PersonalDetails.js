/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
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
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

//Shapes
import top_shape from '../assets/personal_detail/top_shape.png';
import bottom_shape from '../assets/personal_detail/bottom_shape.png';

//icon
import ic_back from '../assets/image/back.png';
import ic_next from '../assets/image/forward.png';
import ic_down from '../assets/image/ic_down.png';
import {
  async_keys,
  clearData,
  getData,
  removeItem,
  storeData,
} from '../api/UserPreference';
import { showSnack } from '../components/Snackbar';
import AppIcon from '../components/AppIcon';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { createAnimatedComponent } from 'react-native-reanimated';
import { useKeyboardPush } from '../hooks/useKeyboardPush';

const AnimatedPressable = createAnimatedComponent(Pressable)


const PersonalDetails = ({ navigation }) => {
  const maximumDate = new Date();

  const [open, setOpen] = useState(false);
  const isFocused = useIsFocused();
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState('');
  const [dateSelected, setDateSelected] = useState(false);
  const [value, setValue] = useState(null);
  const [gender, setGender] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ]);
  const {animatedStyle} = useKeyboardPush()

  const handleName = text => {
    setNameError('');
    setName(text);
  };

  const handleGender = item => {
    setGenderError(false);
    setValue(item.value);
  };

  const handleDOB = dob => {
    setDobError(false);
    setDateExist('');
    setOpen(false);
    setDate(dob);
    setDateSelected(true);
  };

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

  const handleBack = async () => {
    await clearData();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Mobile' }],
    });
  };

  const [loader, setLoader] = useState(true);
  const [dateExist, setDateExist] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const userName = await getData(async_keys.personal_name);
      const gender = await getData(async_keys.gender);
      const dob = await getData(async_keys.dob);

      // console.log('personal', token);

      if (userName && gender && dob) {
        setValue(gender);
        setName(userName);
        setDateSelected(true);
        setDate(moment(dob, 'DD/MM/YYYY').toDate());
      }
    };

    fetchData().then(setLoader(false));
  }, []);

  // Validation
  const [nameError, setNameError] = useState('');
  const [genderError, setGenderError] = useState(false);
  const [dobError, setDobError] = useState(false);

  const handleNext = async () => {
    if (name.trim() === '') {
      setNameError('error');
    } else if (name.length < 3) {
      setNameError('invalid');
    }

    if (!value) {
      setGenderError(true);
    }

    if (!dateSelected && !dateExist) {
      setDobError(true);
    }

    if (
      name.trim() === '' ||
      name.length < 3 ||
      !value ||
      (!dateSelected && !dateExist)
    ) {
      return true;
    }

    await storeData(async_keys.personal_name, name);
    await storeData(async_keys.gender, value);
    await storeData(async_keys.dob, moment(date).format('DD/MM/YYYY'));
    const data = {
      name: name,
      gender: value,
      dob: moment(date).format('DD/MM/YYYY'),
    };
    // showSnack('Submited Successfully');
    navigation.navigate('BusinessDetail', { data });
  };

  const renderItem = item => (
    <Text style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
      {item.label}
    </Text>
  );

  const os = Platform.OS;

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="green" size="large" />
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
    );
  }
  return (
  
     <AnimatedPressable style={[styles.container, animatedStyle]} onPress={() => Keyboard.dismiss()}> 
      <StatusBar
        backgroundColor="#1C1CC2"
        barStyle={os === 'android' ? 'light-content' : 'dark-content'}
      />
      <Image source={top_shape} style={styles.topShape} resizeMode="contain" />
      <Image
        source={bottom_shape}
        style={styles.bottomShape}
        resizeMode="contain"
      />

      <View style={styles.homeContainer}>
        <Text style={styles.header}>Personal Details</Text>

        <View
          style={[
            styles.inputContainer,
            (nameError === 'error' || nameError === 'invalid') && {
              borderColor: 'red',
            },
          ]}
        >
          <Text style={styles.inputHeader}>Name</Text>
          <TextInput
            testID="nameInput"
            maxLength={50}
            style={styles.inputBox}
            onChangeText={handleName}
            value={name}
            placeholder="Please enter your name"
            placeholderTextColor="#888"
          />
          {nameError === 'error' && (
            <Text style={styles.errorText}>Please enter name</Text>
          )}
          {nameError === 'invalid' && (
            <Text style={styles.errorText}>Minimum 3 letters required</Text>
          )}
        </View>

        <View
          style={[
            styles.dropDownContainer,
            genderError && { borderColor: 'red' },
          ]}
        >
          <Text style={styles.dropDownHeader}>Gender</Text>

          <Dropdown
            testID="genderDropdown"
            style={{ flex: 1, paddingHorizontal: 8 }}
            placeholderStyle={styles.dropDownPlaceholder}
            selectedTextStyle={styles.dropDownSelectedText}
            data={gender}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Please choose your gender"
            value={value}
            onChange={handleGender}
            renderRightIcon={() => (
              <Image source={ic_down} style={styles.dropDownIcon} />
            )}
            renderItem={renderItem}
          />
          {genderError && (
            <Text style={styles.errorText}>Please select gender</Text>
          )}
        </View>

        <TouchableOpacity
          testID="dobContainerButton"
          activeOpacity={0.6}
          style={[
            styles.dropDownContainer,
            { paddingHorizontal: wp(2.5) },
            dobError && { borderColor: 'red' },
          ]}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.dropDownHeader}>DOB</Text>

          <Text
            style={[
              styles.dropDownPlaceholder,
              dateExist && styles.dropDownSelectedText,
              dateSelected && styles.dropDownSelectedText,
            ]}
          >
            {dateSelected
              ? moment(date).format('DD / MM / YYYY')
              : 'DD / MM / YYYY'}
          </Text>
          <AppIcon type="fa" name="calendar" color="#000" />
          <DatePicker
            testID="datePicker"
            modal
            theme="light"
            textColor="#000"
            mode="date"
            open={open}
            date={date}
            onConfirm={handleDOB}
            minimumDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 100))
            }
            maximumDate={new Date()}
            onCancel={() => {
              setOpen(false);
            }}
          />
          {dobError && <Text style={styles.errorText}>Please select DOB</Text>}
        </TouchableOpacity>
        <TouchableOpacity testID="changeMobileButton" onPress={handleBack}>
          <Text style={styles.mobChange}>Change Mobile No.</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        testID="nextButton"
        style={styles.lower}
        activeOpacity={0.8}
        onPress={handleNext}
      >
        <View style={styles.upper}>
          <Text style={styles.buttonText}>Next</Text>
        </View>
        <Image source={ic_next} style={styles.backIcon} />
      </TouchableOpacity>
    </AnimatedPressable>
  
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: hp(5),
    color: '#000',
  },
  inputContainer: {
    borderWidth: 0.5,
    height: hp(5.5),
    width: wp(70),
    marginVertical: hp(2),
    paddingHorizontal: wp(2),
  },
  errorText: {
    color: 'red',
    fontSize: wp(2.7),
    fontFamily: 'Roboto-Bold',
    position: 'absolute',
    bottom: wp(-4),
    // left: wp(4.5),
  },
  inputHeader: {
    position: 'absolute',
    fontFamily: 'Roboto-Bold',
    color: '#000',
    top: -9.5,
    left: wp(2),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  inputBox: {
    flex: 1,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    paddingVertical: 0,
    paddingHorizontal: 0,
    textTransform: 'capitalize',
  },

  dropDownContainer: {
    borderWidth: 0.5,
    height: hp(5.5),
    width: wp(70),
    marginVertical: hp(2),
    // paddingHorizontal: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownHeader: {
    position: 'absolute',
    fontFamily: 'Roboto-Bold',
    color: '#000',
    top: -9.5,
    left: wp(2),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  dropDownIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
  },
  dropDownPlaceholder: {
    fontSize: wp(3.8),
    color: '#999',
    fontFamily: 'Roboto-Regular',
  },
  dropDownSelectedText: {
    fontSize: wp(3.8),
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  mobChange: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Roboto-Bold',
    // fontSize: wp(3.5),
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
    shadowOffset: { width: 5, height: 5 },
    bottom: hp(5),
    alignSelf: 'flex-end',
    right: wp(7.5),
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
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: '#000',
  },
});
