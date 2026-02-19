/* eslint-disable prettier/prettier */
import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Logo
import ic_logo from '../assets/icons/dc_muscat.png';
import ic_diamond from '../assets/icons/dc_daimond.png';
import {FadeOut} from 'react-native-reanimated';
import {scale, verticalScale} from '../components/Scaling';
import {async_keys, getData} from '../api/UserPreference';
import {fetchProfileDataRequest} from '../redux/action/profileActions';
import {useDispatch} from 'react-redux';
import VersionCheck from 'react-native-version-check';
import { navigate } from '../routes/NavigationService';

const {height, width} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  const spinValue = new Animated.Value(0);
  const opacityValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  useEffect(() => {
    TextAnim();
    LogoAnim();
    const timeoutID = setTimeout(handleRoute, 2000);
    return () => clearTimeout(timeoutID);
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

  const handleRoute = async () => {
    const token = await getData(async_keys.user_token);
    const registered = await getData(async_keys.is_register);
    // //  console.log('registered', registered);
    // if (token && registered == 1) {
    //   // dispatch(fetchProfileDataRequest(navigation, 'HomeScreen'));
    //   navigate('LoggedIn');
    // } else if (registered == 0 || registered === null) {
    //   navigate('LoggedOut');
    // }
  };

  //For Diamond
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 550,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  //For Text

  const resultWidth = wp(47.5);

  const TextAnim = () => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  //For Opacity of Logo

  const LogoAnim = () => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <Animated.View style={{opacity: opacityValue}}>
        <Image source={ic_logo} style={styles.logo} />
        <Animated.Image
          source={ic_diamond}
          style={[{transform: [{rotateY: spin}]}, styles.diamond]}
        />
      </Animated.View>

      <Animated.View
        style={[styles.text1Container, {transform: [{scaleX: fadeValue}]}]}>
        <Text style={styles.text1} numberOfLines={1}>
          DC <Text style={{color: '#d1b338'}}>JEWELRY</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: height,
    // transform: [],
  },
  logo: {
    height: hp(20),
    aspectRatio: 1 / 1,
  },
  diamond: {
    height: hp(5.5),
    width: wp(11),
    position: 'absolute',
    right: verticalScale(8),
    bottom: verticalScale(50),
  },
  text1Container: {
    width: wp(100),
    alignItems: 'center',
    // borderWidth: 1,
  },
  text1: {
    fontSize: wp(7),
    color: '#250a06',
    letterSpacing: wp(0.5),
    lineHeight: hp(3),
    paddingTop: hp(2),
  },
});
