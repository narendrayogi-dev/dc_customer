/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { CommonActions, StackActions } from '@react-navigation/native';

import ScanStore from '../screen/ScanStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clearData } from '../api/UserPreference';
import { useDispatch, useSelector } from 'react-redux';
import { applyFilterSort } from '../redux/action/productActions';
import { showSnack } from '../components/Snackbar';

//Icon
import catelogue from '../assets/image/dc.png';
import ic_user from '../assets/icons/user.png';
import AppAvatar from '../components/AppAvatar';
import AppIcon from '../components/AppIcon';
import { navigate, resetTo } from './NavigationService';
import { logoutRequest } from '../redux/action/authActions';

const DrawerScreen = ({ navigation }) => {
  const inset = useSafeAreaInsets();

  const dispatch = useDispatch();
  const { profile, version, how_to_use } = useSelector(
    state => state.home.homeData,
  );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', e => {
  //     e.preventDefault();
  //     unsubscribe();
  //     navigation.navigate('HomeScreen');
  //   });
  // }, []);

  console.log('profile data on drawer screen', profile);

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

  const openWhatsApp = async () => {
    const vendorPhoneNumber = profile.active_store_mobile; // Include the country code
    console.log(vendorPhoneNumber, 'phonenumber');
    const message = 'Hello, I would like to know more about your products!';
    // const url = `https://wa.me/${vendorPhoneNumber}?text=${encodeURIComponent(
    //   message,
    // )}`;
    const url = `whatsapp://send?phone=91${vendorPhoneNumber}&text=${message}`;
    console.log('Attempting to open WhatsApp with URL:', url);

    try {
      // Directly open the URL without checking with canOpenURL
      await Linking.openURL(url);
      console.log('WhatsApp opened successfully');
    } catch (err) {
      console.error('Failed to open WhatsApp:', err);
      Alert.alert(
        'Error',
        'Could not open WhatsApp. Make sure it is installed.',
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: inset.top, paddingBottom: inset.bottom },
      ]}
    >
      <StatusBar backgroundColor="#f1f1f1" barStyle="dark-content" />
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('BottomTabNavigator')}
      >
        <AppIcon
          raised
          type="fa"
          name="arrow-left"
          size={wp(5)}
          containerStyle={{
            left: wp(2),
            marginBottom: hp(1),
            marginHorizontal: 0,
          }}
        />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.homeContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfileScreen')}
            style={styles.profileContainer}
          >
            {profile?.image ? (
              <AppAvatar
                size={hp(9)}
                rounded
                uri={profile?.image || ''}
              />
            ) : (
              <AppAvatar
                size={hp(9)}
                rounded
                title={
                  profile?.store_name?.split(' ')?.length < 2 &&
                  profile?.store_name?.split(' ')?.length > 0
                    ? profile?.store_name?.split(' ')[0][0]?.toUpperCase()
                    : profile?.store_name?.split(' ')[0][0]?.toUpperCase() +
                        profile?.store_name
                          ?.split(' ')
                          [
                            profile?.store_name?.split(' ')?.length - 1
                          ][0]?.toUpperCase() || ''
                }
                containerStyle={{ backgroundColor: '#000080' }}
                titleStyle={{ fontSize: wp(8) }}
              />
            )}
            <View style={styles.name_number}>
              <Text style={styles.name}>{profile?.store_name}</Text>
              {/* <Text style={styles.number}>9460914020</Text> */}
              {profile?.active_store_name && (
                <>
                  {/* <AirbnbRating
                    size={wp(4)}
                    isDisabled
                    defaultRating={3}
                    showRating={false}
                    starContainerStyle={styles.rating}
                  /> */}
                  <Text style={styles.number}>
                    (By: {profile?.active_store_name})
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              // onPress={() => {
              //   alert('Coming soon');
              // }}
              onPress={() => navigation.navigate('ScanStoreScreen')}
              style={styles.actionButton}
            >
              <AppIcon
                reverse
                type="materialIcons"
                name="qrcode-scan"
                color="#45D2D0"
                size={wp(6)}
                iconStyle={{ fontSize: wp(6) }}
              />
              <Text style={styles.actionButtonText}>Scan Store</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NotificationScreen')}
            >
              <AppIcon
                reverse
                type="ionicon"
                name="notifications-outline"
                color="#FD8F06"
                size={wp(6)}
                iconStyle={{ fontSize: wp(7.5) }}
              />
              <Text style={styles.actionButtonText}>Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditProfileScreen')}
            >
              <AppIcon
                reverse
                type="fa"
                name="edit"
                color="#9A55D6"
                size={wp(6)}
                iconStyle={{ fontSize: wp(6) }}
              />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigate('BottomTabNavigator', { screen: 'Product', params: { screen: 'AllProductsScreen' } });
              dispatch(applyFilterSort({ sortBy: 'lowest_price' }));
            }}
            style={styles.catelogueImg}
          >
            <Image
              source={catelogue}
              style={{ width: '100%', borderRadius: hp(1) }}
              resizeMode="stretch"
            />
          </TouchableOpacity>

          <View style={styles.drawerContentsContainer}>
            <Text style={styles.storeHeaderText}>Stores</Text>

            <TouchableOpacity
              style={styles.drawerContentsButton}
              onPress={() => resetTo('BottomTabNavigator', {
                screen:"Store", 
                 params:{screen:"AddStoreScreen"}
              })}
            >
              <View style={styles.icon_text}>
                <AppIcon type="material" name="storefront" />
                <Text style={styles.drawerContentsButtonText}>Add Store</Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <TouchableOpacity
              style={styles.drawerContentsButton}
              onPress={() => resetTo('BottomTabNavigator', {
                screen:"Store", 
                 params:{screen:"AboutStore"}
              })}
            >
              <View style={styles.icon_text}>
                <AppIcon type="material" name="info" />

                <Text style={styles.drawerContentsButtonText}>About Store</Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <TouchableOpacity
              style={styles.drawerContentsButton}
               onPress={() => navigate('BottomTabNavigator', {
                screen:"Home", 
                 params:{screen:"HowToUseApp"}
              })}
              // onPress={() => {
              //   // alert('Coming soon');
              //   navigation.navigate('HowToUseApp', how_to_use);
              // }}
            >
              <View style={styles.icon_text}>
                <AppIcon type="material" name="info" />
                <Text style={styles.drawerContentsButtonText}>
                  How to use App
                </Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <Text style={styles.storeHeaderText}>Term & Ratings</Text>

            <TouchableOpacity
              onPress={() => {
                // alert('Coming soon');
                const url =
                  'https://play.google.com/store/apps/details?id=com.jwelerydukancustomer&hl=es_419';
                Linking.openURL(url).catch(err =>
                  console.error('Failed to open URL:', err),
                );
              }}
              style={styles.drawerContentsButton}
            >
              <View style={styles.icon_text}>
                <AppIcon type="octicon" name="thumbsup" />
                <Text style={styles.drawerContentsButtonText}>Rate Us</Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <TouchableOpacity
              onPress={() => {
                openWhatsApp();
              }}
              style={styles.drawerContentsButton}
            >
              <View style={styles.icon_text}>
                <Image
                  source={require('../assets/icons/whatsapp.png')}
                  style={{ height: 30, width: 30 }}
                />
                {/* <Icon type="foundation" name="watsapp" /> */}
                <Text style={styles.drawerContentsButtonText}>Contact Us</Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <Text style={styles.storeHeaderText}>Return</Text>

            <TouchableOpacity
              style={styles.drawerContentsButton}
              // onPress={() => navigation.navigate('ReturnProductScreen')}

               onPress={() => navigate('BottomTabNavigator', {
                screen:"Home", 
                 params:{screen:"ReturnProduct"}
              })}
              // onPress={() => {


              //   navigation.navigate('ReturnProduct');
              // }}
            >
              <View style={styles.icon_text}>
                {/* <AppIcon type="material" name="assignment-return" /> */}
                <AppIcon type="materialIcons" name="keyboard-return" />
                <Text style={styles.drawerContentsButtonText}>
                  Return Product
                </Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <Text style={styles.storeHeaderText}>Privacy</Text>

            <TouchableOpacity
              onPress={() => {
                // alert('Coming soon');
                navigation.navigate('privacyPoilcy');
              }}
              style={styles.drawerContentsButton}
            >
              <View style={styles.icon_text}>
                {/* <Icon type="material" name="assignment-return" /> */}
                <AppIcon type="material" name="privacy-tip" />
                <Text style={styles.drawerContentsButtonText}>
                  Privacy Policy
                </Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.drawerContentsButton}
            >
              <View style={styles.icon_text}>
                <AppIcon type="feather" name="power" />
                <Text style={styles.drawerContentsButtonText}>Logout</Text>
              </View>
              <AppIcon type="ionicon" name="chevron-forward" />
            </TouchableOpacity>
            <View style={styles.underline} />
            <Text style={styles.bottomText}>APP VERSION {version}</Text>
          </View>
          <View style={[styles.underline, { bottom: hp(6) }]} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
    paddingHorizontal: wp(2),
    // alignSelf: 'center',
  },
  profileContainer: {
    backgroundColor: '#7A7171',
    height: hp(15),
    borderRadius: hp(2),
    marginBottom: hp(1.5),
    marginTop: hp(1),
    flexDirection: 'row',
    paddingHorizontal: wp(3.5),
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  name_number: {
    marginLeft: wp(5),
    flex: 1,
  },
  name: {
    fontFamily: 'Roboto-Medium',
    color: '#fff',
    fontSize: wp(6),
  },
  rating: {
    alignSelf: 'flex-start',
  },
  number: {
    fontFamily: 'Roboto-Medium',
    color: '#fff',
    fontSize: wp(3.5),
  },
  actionContainer: {
    backgroundColor: '#fff',
    borderRadius: hp(1),
    elevation: 10,
    minHeight:70,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(0.7),
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3),
    // top: hp(-1),
  },
  catelogueImg: {
    width: '100%',
    marginVertical: hp(1.5),
  },
  storeHeaderText: {
    fontFamily: 'Roboto-BoldItalic',
    fontSize: wp(3),
    color: '#999',
    marginTop: hp(2.2),
    marginBottom: hp(0.5),
  },
  drawerContentsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    borderRadius: hp(2),
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
  drawerContentsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon_text: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerContentsButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.5),
    left: wp(2),
  },
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: hp(1),
  },
  bottomText: {
    fontFamily: 'Roboto-Black',
    fontSize: wp(3.5),
    color: '#c1c1c1',
    alignSelf: 'center',
    marginTop: hp(9),
  },
});
