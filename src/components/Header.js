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

  const cartCount = cart_detail?.cart_count ?? 0;
const cartAmount = cart_detail?.cart_amount ?? 0;
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
  <TouchableOpacity
    onPress={() => navigation.navigate('Home', { screen: 'MyCart' })}
    style={styles.cartWrapper}
  >
    <AppIcon type="fa" name="shopping-cart" size={wp(8.5)} />

    {/* Count bubble */}
    {cartCount > 0 && (
      <View style={styles.countBubble}>
        <Text style={styles.countText}>{cartCount}</Text>
      </View>
    )}

    {/* Amount */}
    <View style={styles.amountBox}>
      <Text style={styles.amountText}>₹ {cartAmount}</Text>
    </View>
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


  // cart 


  cartWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
},

countBubble: {
  position: 'absolute',
  top: -6,
  right: -6,
  backgroundColor: '#e53935',
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 4,
},

countText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
},

amountBox: {
  position: 'absolute',
  left: -50,
  backgroundColor: 'gray',
  paddingHorizontal: wp(2.5),
  paddingVertical: wp(0.8),
  borderRadius: 6,
},

amountText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
},
});
