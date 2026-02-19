/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Pressable,
  Keyboard,
  BackHandler,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RadioButton} from 'react-native-paper';


//shape
import top_shape from '../assets/business_type/top_shape.png';
import bottom_shape from '../assets/business_type/bottom_shape.png';

//image
import front_image_view from '../assets/business_type/Blogging-bro.png';
//icon
import ic_next from '../assets/image/forward.png';
import ic_back from '../assets/image/back.png';

const EnterShopCode = ({navigation}) => {
  // Back
  useEffect(() => {
    const eventListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => eventListener.remove();
  }, [navigation]);

  const [shopCode, setShopCode] = useState('');
  const [isShopCode, setIsShopCode] = useState(false);

  const handleShopCode = code => setShopCode(code);

  const handleDemo = () => navigation.navigate('LoggedIn');

  useEffect(() => {
    if (shopCode.trim() === '') {
      setIsShopCode(false);
    } else {
      setIsShopCode(true);
    }
  }, [shopCode, setShopCode]);

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <StatusBar backgroundColor="#8E8EE0" barStyle="light-content" />
      <Image source={top_shape} style={styles.topShape} resizeMode="contain" />
      <Image
        source={bottom_shape}
        style={styles.bottomShape}
        resizeMode="contain"
      />

      <Image
        source={front_image_view}
        style={styles.frontImage}
        resizeMode="contain"
      />

      <View style={styles.homeContainer}>
        <View style={styles.shopCodeContainer}>
          <TextInput
            testID="shopCodeInput"
            style={styles.shopCodeInput}
            placeholder="Enter shop code (Optional)"
            placeholderTextColor="#fff"
            onChangeText={handleShopCode}
          />
          <Text style={styles.orText}>OR</Text>
          <TouchableOpacity
            testID="viewDemoButton"
            style={styles.viewDemoButton}
            onPress={handleDemo}>
            <Text style={styles.viewDemoText}>View Demo Store</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="nextButton"
          disabled={!isShopCode}
          onPress={handleDemo}
          style={[styles.lower, !isShopCode && {backgroundColor: '#c1c1c1'}]}
          activeOpacity={0.8}>
          <View style={styles.upper}>
            <Text
              style={[styles.buttonText, !isShopCode && {color: '#c1c1c1'}]}>
              Next
            </Text>
          </View>
          <Image
            source={ic_next}
            style={styles.backIcon}
            // resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default EnterShopCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topShape: {
    position: 'absolute',
    width: wp(89),
    height: hp(40),
    top: hp(-7),
    right: wp(-42),
  },
  bottomShape: {
    position: 'absolute',
    width: wp(67),
    height: hp(31),
    bottom: hp(-11),
    left: wp(-26),
  },
  frontImage: {
    width: wp(65),
    height: hp(30),
    alignSelf: 'center',
    marginTop: hp(17),
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  shopCodeContainer: {
    alignItems: 'center',
    backgroundColor: '#9b9be1',
    width: wp(80),
    borderRadius: wp(1),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
    paddingVertical: hp(1.5),
    marginBottom: hp(5),
  },
  shopCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingVertical: 0,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontSize: wp(2.8),
    width: '70%',
  },
  orText: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    marginVertical: hp(1),
  },
  viewDemoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(0.5),
    borderRadius: hp(5),
    marginTop: hp(0.5),
  },
  viewDemoText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(2.5),
    color: '#000',
  },
  lower: {
    backgroundColor: '#29B1F4',
    // backgroundColor: '#999',
    width: wp(50),
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
    width: wp(40),
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
