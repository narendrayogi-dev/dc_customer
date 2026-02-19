import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Demo_Footer from './Demo_Footer';

import {
  Demo_HomeStack,
  Demo_ProductStack,
} from './Demo_StackNavigator';

import {
  OrdersStack,
  StoreStack,
  WishlistStack,
} from './StackNavigator';

const Tab = createBottomTabNavigator();

export function Demo_BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <Demo_Footer {...props} />}>
      <Tab.Screen name="Demo_Home" component={Demo_HomeStack} />
      <Tab.Screen name="Demo_Product" component={Demo_ProductStack} />
      <Tab.Screen name="Wishlist" component={WishlistStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Store" component={StoreStack} />

    </Tab.Navigator>
  );
}
