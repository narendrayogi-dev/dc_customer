/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';



import FlashMessage from 'react-native-flash-message';
import setupNotifications from './src/fireBase/useFirebaseListeners';

import RootNavigator from './src/routes/Routes';
import { useDispatch, useSelector } from 'react-redux';
import {bootstrapAuth} from './src/redux/action/authActions';
import { Animated, AppState, Easing, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import UpdateModal from './src/components/UpdateModal';

const App = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;
const dispatch = useDispatch();
  const [showUpdateModal, setShowUpdateModal] = useState(false);


  // ✅ Now it's properly used
  const { isAuthenticated, flow , isLoading} = useSelector(state => state.auth);


  console.log(isAuthenticated, flow);


  useEffect(() => {
    setupNotifications();
    dispatch(bootstrapAuth());

  }, []);

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]),
    );

    rotation.start();

    return () => {
      rotation.stop();
      rotateValue.setValue(0);
    };
  }, []);




const openStore = async () => {
  const packageName = 'com.jwelerydukancustomer';
  const appleAppId = '6471483523'; 

  const urls = Platform.select({
    ios: {
      market: `itms-apps://itunes.apple.com/app/id${appleAppId}`,
      web: `https://apps.apple.com/app/id${appleAppId}`,
    },
    android: {
      market: `market://details?id=${packageName}`,
      web: `https://play.google.com/store/apps/details?id=${packageName}`,
    },
  });

  try {
    const supported = await Linking.canOpenURL(urls.market);
    if (supported) {
      await Linking.openURL(urls.market);
    } else {
      await Linking.openURL(urls.web);
    }
  } catch (error) {
    console.error("Store link error:", error);
    await Linking.openURL(urls.web);
  }
};

  

   useEffect(() => {
    const checkUpdateOnce = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion();
        const currentVersion = VersionCheck.getCurrentVersion();

        console.log('Latest:', latestVersion);
        console.log('Current:', currentVersion);

        const needUpdate = await VersionCheck.needUpdate({
          currentVersion,
          latestVersion,
        });
        console.log(needUpdate, "needUpdate");
        

        if (needUpdate?.isNeeded) {
          setShowUpdateModal(true);
        }
      } catch (e) {
        console.log('Update check failed:', e);
      }
    };

    checkUpdateOnce();

    const subscription = AppState.addEventListener('change', state => {
      console.log('app status changed', state);

      if (state === 'active') {
        checkUpdateOnce();
      }
    });

    return () => subscription.remove();
  }, []);
  console.log('isAuthenticated', isAuthenticated);

  


  return (
    <>
    <KeyboardProvider>
      <RootNavigator isLoggedIn={isAuthenticated}  isLoading={isLoading}/>

       <UpdateModal
        visible={showUpdateModal}
        // onCancel={() => setShowUpdateModal(false)}
        onUpdate={openStore}
      />
      <FlashMessage position="top" />
      </KeyboardProvider>
    </>
  );
};

export default App;
