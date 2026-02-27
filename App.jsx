/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';



import FlashMessage from 'react-native-flash-message';
import setupNotifications from './src/fireBase/useFirebaseListeners';

import RootNavigator from './src/routes/Routes';
import { useDispatch, useSelector } from 'react-redux';
import {bootstrapAuth} from './src/redux/action/authActions';
import { Animated, AppState, Easing, Linking } from 'react-native';
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
        onUpdate={openPlayStore}
      />
      <FlashMessage position="top" />
      </KeyboardProvider>
    </>
  );
};

export default App;
