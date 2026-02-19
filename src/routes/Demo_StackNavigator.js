import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Demo_HomeScreen from '../demo_screens/Demo_HomeScreen';
import Demo_ProductsScreen from '../demo_screens/Demo_ProductsScreen';
import Demo_ProductDetails from '../demo_screens/Demo_ProductDetails';

const Stack = createStackNavigator();

/* ================= HOME STACK ================= */

export function Demo_HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>

      <Stack.Screen
        name="Demo_HomeScreen"
        component={Demo_HomeScreen}
      />

    </Stack.Navigator>
  );
}


export function Demo_ProductStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>

      <Stack.Screen
        name="Demo_ProductsScreen"
        component={Demo_ProductsScreen}
      />

      <Stack.Screen
        name="Demo_ProductDetails"
        component={Demo_ProductDetails}
      />

    </Stack.Navigator>
  );
}
