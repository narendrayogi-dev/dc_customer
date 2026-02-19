/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {showSnack} from './Snackbar';
import {clearData} from '../api/UserPreference';
import AppBadge from './AppBadge';
import AppIcon from './AppIcon';
import { useDispatch } from 'react-redux';
import { logoutRequest } from '../redux/action/authActions';
import { goBack } from '../routes/NavigationService';

const Header = ({
  title,
  style,
  rightIcon,
  titleColor,
  navigation,
  params,
  disabledBackButton,
  cart_detail,
  fromWishlist,
}) => {
  console.log('cart_detail 090', cart_detail, fromWishlist);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    Alert.alert('Are you sure', 'Do you want to Logout', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          // await clearData();

          // navigation.navigate('LoggedOut');
          dispatch(logoutRequest())
          showSnack('You have been logged out successfully');
        },
      },
    ]);
  };
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        style={{
          borderRadius: 20,
          elevation: 3,
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOpacity: 0.3,
          backgroundColor:"#fff",
          shadowRadius: 2,
          shadowOffset: {width: -1, height: -1},
        }}
        disabled={disabledBackButton}
        activeOpacity={0.9}
        onPress={() => {

          goBack()
          // if (disabledBackButton) {
          //   handleLogout();
          // } else {
          // if (goBack) {
          //   navigation.navigate(goBack);
          // } else {
          //   navigation.goBack();
          // }
          // }
        }}>
        <AppIcon
          raised
          color={disabledBackButton ? '#ddd' : 'black'}
          type="fa"
          name="arrow-left"
          size={wp(6)}
          containerStyle={{margin: 0}}
        />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.headerTitle,
            titleColor ? {color: titleColor} : {color: '#000'},
          ]}>
          {title}
        </Text>
      </View>
      {disabledBackButton ? (
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <View>{rightIcon}</View>
      )}

      {fromWishlist && (
        <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'MyCart' })}>
          <AppIcon type="fa" name="shopping-cart" size={wp(8.5)} />
          <AppBadge
            value={cart_detail?.cart_count || 0}
            status="error"
            style={styles.badgeContainer}
          />
          <AppBadge
            value={`₹ ${cart_detail?.cart_amount || 0}`}
            status=""
            
            containerStyle={[
              styles.badgeContainer1,
              {
                left:
                  cart_detail?.cart_amount?.toString().length < 5 ? -45 : -55,
              },
            ]}
            badgeStyle={{
              width:
                cart_detail?.cart_amount?.toString().length < 5
                  ? wp(13)
                  : wp(17),
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: hp(9),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(4),
  },
  backButton: {
    fontSize: wp(8),
    marginLeft: wp(2),
  },
  titleContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    // zIndex: -9999,
  },
  headerTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
  },
  logoutButton: {
    backgroundColor: 'red',
    borderRadius: 3,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
  },
  logoutButtonText: {
    fontSize: wp(3),
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  badgeContainer: {
    position: 'absolute',
    right: wp(-1),
    top: -13,
  },
  badgeContainer1: {
    position: 'absolute',
    // left: wp(-12.5),
    top: -8,
    borderRadius: hp(3),
    backgroundColor: '#999',
  },
});
