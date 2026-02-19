/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
import {useDispatch, useSelector} from 'react-redux';

import {setMainRoute} from '../redux/action/routeActions';
import messaging from '@react-native-firebase/messaging';
import {fetchHomeDataRequest} from '../redux/action/homeActions';
import {fetchStoresRequest} from '../redux/action/storeActions';
import {goForLogin} from '../components/globalFunctions';
import {applyResetFilterSort_page_demo} from '../redux/action/demoProductActions';
import AppIcon from '../components/AppIcon';
import { resetTo } from './NavigationService';



const windowWidth = Dimensions.get('window').width;

const WaveBottomTabBar = props => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const {state, navigation} = props;

  // ✅ NEW WAY (v7)
  const index = state.index;

  const home = index === 0;
  const product = index === 1;
  const wishlist = index === 2;
  const orders = index === 3;
  const store = index === 4;

  const color = '#838383';
  const active_color = '#000080';

  useEffect(() => {
    dispatch(setMainRoute(index));

    if (index !== 1) {
      dispatch(applyResetFilterSort_page_demo());
    }

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.type === 'active_store') {
        dispatch(fetchStoresRequest());
      }

      if (remoteMessage?.data?.type === 'deactive_store') {
        dispatch(fetchHomeDataRequest(navigation));
      }
    });

    return unsubscribeOnMessage;
  }, [index]);

  const jumpToPage = pageName => {
    navigation.navigate(pageName);
  };

  const bothStyle = Platform.OS === 'android' ? styles : iosStyles;

  return (
    <View style={bothStyle.MainContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={bothStyle.button}
        onPress={() => resetTo('Demo_Home')}>

        <AppIcon
          type="fa"
          name="home"
          size={30}
          color={home ? active_color : color}
          containerStyle={{top: 4}}
        />

        <Text style={[styles.NavigationText, {color: home ? active_color : color}]}>
          Home
        </Text>
      </TouchableOpacity>

      <ImageBackground source={XD} style={bothStyle.ImageBackground}>

        <View style={styles.devideByTwo}>
          <TouchableOpacity
            style={styles.NavigationImageContainer}
            onPress={() => resetTo('Demo_Product')}>

            <Image
              source={product ? ic_active_product : ic_product}
              style={{width: 26, height: 26}}
            />

            <Text style={[styles.NavigationText, {color: product ? active_color : color}]}>
              Product
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.NavigationImageContainer}
            onPress={() => goForLogin(navigation)}>

            <Image
              source={wishlist ? ic_active_wishlist : ic_wishlist}
              style={{width: 26, height: 26}}
            />

            <Text style={[styles.NavigationText, {color: wishlist ? active_color : color}]}>
              Wishlist
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.devideByTwo}>
          <TouchableOpacity
            style={styles.NavigationImageContainer}
            onPress={() => goForLogin(navigation)}>

            <Image
              source={orders ? ic_active_orders : ic_orders}
              style={{width: 26, height: 26}}
            />

            <Text style={[styles.NavigationText, {color: orders ? active_color : color}]}>
              Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.NavigationImageContainer}
            onPress={() => goForLogin(navigation)}>

            <Image
              source={store ? ic_active_store : ic_store}
              style={{width: 26, height: 26}}
            />

            <Text style={[styles.NavigationText, {color: store ? active_color : color}]}>
              Store
            </Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
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
    shadowOffset: {width: 0, height: 1},
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
    shadowRadius: 2,
    borderRadius: 30,
    zIndex: 1,
    elevation: 3,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
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
