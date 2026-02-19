/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';



import FlashMessage from 'react-native-flash-message';
import setupNotifications from './src/fireBase/useFirebaseListeners';

import RootNavigator from './src/routes/Routes';
import { useDispatch, useSelector } from 'react-redux';
import {bootstrapAuth} from './src/redux/action/authActions';
import { Animated, Easing } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const App = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;
const dispatch = useDispatch();

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

  console.log('isAuthenticated', isAuthenticated);

  


  return (
    <>
    <KeyboardProvider>
      <RootNavigator isLoggedIn={isAuthenticated}  isLoading={isLoading}/>
      <FlashMessage position="top" />
      </KeyboardProvider>
    </>
  );
};

export default App;
