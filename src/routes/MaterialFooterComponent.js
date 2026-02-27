/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import XD from '../assets/image/Path8.png';

// Icon
import ic_active_product from '../assets/icons/active_product.png';
import ic_product from '../assets/icons/product.png';
import ic_active_wishlist from '../assets/icons/active_wishlist.png';
import ic_wishlist from '../assets/icons/wishlist.png';
import ic_active_orders from '../assets/icons/active_orders.png';
import ic_orders from '../assets/icons/orders.png';
import ic_active_store from '../assets/icons/active_store.png';
import ic_store from '../assets/icons/store.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  applyFilterSort,
  applyResetFilterSort,
  fetchProductRequest,
} from '../redux/action/productActions';
import { setMainRoute } from '../redux/action/routeActions';
import { fetchProfileDataRequest } from '../redux/action/profileActions';
import messaging from '@react-native-firebase/messaging';
import { fetchHomeDataRequest } from '../redux/action/homeActions';
import { fetchStoresRequest } from '../redux/action/storeActions';
import AppIcon from '../components/AppIcon';
import { navigate, resetTo } from './NavigationService';

// API Info
// import {BASE_URL, makeRequest} from '../api/ApiInfo';

// // User Preference
// import {async_keys, clearData, storeData, getData} from '../api/UserPreference';

const windowWidth = Dimensions.get('window').width;

const WaveBottomTabBar = props => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const { homeData, isLoading, error } = useSelector(state => state.home);

  // console.log('FOOTER', homeData);
  const active_store_code = homeData?.profile?.active_store_code;

  //GETTING ROUTE INDEX
  const { index } = props.state;

  const home = index === 0;
  const product = index === 1;
  const wishlist = index === 2;
  const orders = index === 3;
  const store = index === 4;

  const color = '#838383';
  const active_color = '#000080';

  useEffect(() => {
    if (index !== 1) {
      dispatch(applyResetFilterSort());
    }

    dispatch(setMainRoute(index));

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log(
        'materialFooterComponent---on notification receive',
        remoteMessage,
      );
      const { navigation } = props;

      if (remoteMessage?.data?.type === 'active_store') {
        console.log('active_store');
        dispatch(fetchHomeDataRequest(navigation, true));
      }

      if (remoteMessage?.data?.type === 'deactive_store') {
        console.log('deactive_store');
        dispatch(fetchHomeDataRequest(navigation, true));
      }
    });

    return () => unsubscribeOnMessage();
  }, [index]);

  const jumpToPage = pageName => {
    const { navigation } = props;
    if (active_store_code) {
      navigation.navigate(pageName);
    }
  };

  const bothStyle = Platform.OS === 'android' ? styles : iosStyles;

  return (
    <View style={bothStyle.MainContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={bothStyle.button}
        disabled={!active_store_code}
        onPress={() =>
          navigate('Home', {
            screen: 'HomeScreen',
          })
        }
      >
        <AppIcon
          type="fa"
          name="home"
          size={30}
          // color="#000080"
          color={home ? active_color : color}
          containerStyle={[
            { top: 4 },
            !active_store_code && !isLoading && { opacity: 0.2 },
          ]}
        />

        <Text
          style={[
            styles.NavigationText,
            // {color: '#000080'},
            { color: home ? '#000080' : '#838383' },
            !active_store_code && !isLoading && { opacity: 0.2 },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <ImageBackground
        source={XD}
        // resizeMode="stretch"
        style={bothStyle.ImageBackground}
      >
        <View style={styles.devideByTwo}>
          <View style={styles.devideByTwo}>
            <TouchableOpacity
              style={styles.NavigationImageContainer}
              disabled={!active_store_code}
              onPress={
                () =>
                  navigate('Product', {
                    screen: 'AllProductsScreen',
                  })
                // jumpToPage('AllProductsScreen')
              }
            >
              <Image
                source={ic_active_product}
                style={[
                  { width: 26, height: 26 },
                  !active_store_code && !isLoading && { opacity: 0.2 },
                  !product && { tintColor: '#838383' },
                ]}
              />

              <Text
                style={[
                  styles.NavigationText,
                  { color: product ? '#000080' : '#838383' },
                  !active_store_code && !isLoading && { opacity: 0.2 },
                ]}
              >
                Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.NavigationImageContainer}
              disabled={!active_store_code}
              onPress={() =>
                navigate('Wishlist', {
                  screen: 'WishlistScreen',
                })
              }
            >
              <Image
                source={ic_active_wishlist}
                style={[
                  { width: 26, height: 26 },
                  !active_store_code && !isLoading && { opacity: 0.2 },
                  !wishlist && { tintColor: '#838383' },
                ]}
              />

              <Text
                style={[
                  styles.NavigationText,
                  { color: wishlist ? '#000080' : '#838383' },
                  !active_store_code && !isLoading && { opacity: 0.2 },
                ]}
              >
                Wishlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.devideByTwo}>
          <TouchableOpacity
            style={styles.NavigationImageContainer}
            disabled={!active_store_code}
            onPress={
              () =>
                navigate('Orders', {
                  screen: 'OrdersHistoryScreen',
                })
              // jumpToPage('OrdersHistoryScreen')
            }
          >
            <Image
              source={ic_active_orders}
              style={[
                { width: 26, height: 26 },
                !active_store_code && !isLoading && { opacity: 0.2 },
                !orders && { tintColor: '#838383' },
              ]}
            />

            <Text
              style={[
                styles.NavigationText,
                { color: orders ? '#000080' : '#838383' },
                !active_store_code && !isLoading && { opacity: 0.2 },
              ]}
            >
              Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.NavigationImageContainer}
            // disabled={!active_store_code}
            onPress={
              () => {
                navigate('Store', {
                  screen: 'StoreScreen',
                });
              }
              // props.navigation.navigate('StoreScreen')
            }
          >
            <Image
              source={ic_active_store}
              style={[
                { width: 26, height: 26 },
                !store && { tintColor: '#838383' },
                // !active_store_code && !isLoading && {opacity: 0.2},
              ]}
            />

            <Text
              style={[
                styles.NavigationText,
                { color: store ? '#000080' : '#838383' },
              ]}
            >
              Store
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    // </SafeAreaView>
  );
};
export default WaveBottomTabBar;

const iosStyles = StyleSheet.create({
  MainContainer: {
    // bottom: 68,
    height: 33,
    // borderWidth: 1,
    backgroundColor: '#f1f1f1',
  },
  ImageBackground: {
    width: windowWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 113,
    tintColor: 'yellow',
  },
  button: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    zIndex: 1,
    elevation: 3,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
    bottom: 70,
  },
});

const styles = StyleSheet.create({
  MainContainer: {
    bottom: -2,
    position: 'absolute',
    // borderWidth: 1,
    // backgroundColor: 'rgba(255,255,255, 0)',
  },
  ImageBackground: {
    width: windowWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: wp(2),
  },
  plusIcon: {
    width: 24,
    height: 24,
  },
  button: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    zIndex: 1,
    elevation: 3,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
    marginBottom: -45,
  },
  //   actionBtn: {
  //     backgroundColor: '#fff',
  //     textShadowOffset: {width: 5, height: 5},
  //     textShadowRadius: 10,
  //   },
  NavigationImageContainer: {
    alignSelf: 'center',
    width: 70,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  NavigationText: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#838383',
  },
  devideByTwo: {
    flexDirection: 'row',
    // borderWidth: 1,
    width: wp(40),
    justifyContent: 'space-around',
  },
});
