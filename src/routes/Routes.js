/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

/* ========== Screens ========== */

// Splash
import SplashScreen from '../screen/SplashScreen';
import { navigationRef } from './NavigationService';


// Logged Out
import MobileScreen from '../screen/MobileScreen';
import OtpScreen from '../screen/OtpScreen';
import PinScreen from '../screen/PinScreen';
import PersonalDetails from '../screen/PersonalDetails';
import BusinessDetails from '../screen/BusinessDetails';
import BusinessType from '../screen/BusinessType';
import PCSscreen from '../screen/PCSscreen';
import EnterShopCode from '../screen/EnterShopCode';
import {Demo_BottomTabNavigator} from './Demo_BottomTabNavigator';



import DrawerScreen from './DrawerScreen';
import EditProfile from '../screen/EditProfile';
import NotificationScreen from '../screen/NotificationScreen';
import ReturnProduct from '../screen/ReturnProduct';
import ScanStore from '../screen/ScanStore';
import {BottomTabNavigator} from './BottomTabNavigator';


const Stack = createStackNavigator();


function LoggedOutStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="DemoStore" component={Demo_BottomTabNavigator} />

      <Stack.Screen
        name="Mobile"
        component={MobileScreen}
        options={{animation: 'scale_from_center'}}
      />

      <Stack.Screen name="OTP" component={OtpScreen} />
      <Stack.Screen name="PIN" component={PinScreen} />

      <Stack.Screen name="PersonalDetail" component={PersonalDetails} />
      <Stack.Screen name="BusinessDetail" component={BusinessDetails} />
      <Stack.Screen name="ChooseBusinessType" component={BusinessType} />
      <Stack.Screen name="ChoosePCS" component={PCSscreen} />
      <Stack.Screen name="EnterShopCode" component={EnterShopCode} />
    </Stack.Navigator>
  );
}

function LoggedInStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>

      {/* Main tabs */}
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />

      {/* Extra screens */}
      <Stack.Screen name="DrawerScreen" component={DrawerScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfile} />
      <Stack.Screen name="ScanStoreScreen" component={ScanStore} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="ReturnProductScreen" component={ReturnProduct} />

    </Stack.Navigator>
  );
}


export default function RootNavigator({ isLoggedIn, isLoading }) {

  // ⏳ Show splash while checking auth
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <LoggedInStack /> : <LoggedOutStack />}
    </NavigationContainer>
  );
}
