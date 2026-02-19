import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  HomeStack,
  OrdersStack,
  ProductStack,
  StoreStack,
  WishlistStack,
} from './StackNavigator';

import MaterialFooterComponent from './MaterialFooterComponent';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <MaterialFooterComponent {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Product" component={ProductStack} />
      <Tab.Screen name="Wishlist" component={WishlistStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Store" component={StoreStack} />
    </Tab.Navigator>
  );
};
