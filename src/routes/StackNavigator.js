import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* ================= SCREENS ================= */

// Home Stack
import HomeScreen from '../screen/HomeScreen';
import MyCart from '../screen/MyCart';
import OrderPlaced from '../screen/OrderPlaced';
import ReturnProduct from '../screen/ReturnProduct';
import HowToUseApp from '../screen/howToUseApp';
import privacyPoilcy from '../screen/privacyPoilcy';

// Orders Stack
import OrdersHistory from '../screen/OrdersHistory';
import OrderDetail from '../screen/OrderDetail';

// Product Stack
import AllProductsScreen from '../screen/AllProductsScreen';
import ProductDetails from '../screen/ProductDetails';

// Wishlist Stack
import WishList from '../screen/WishList';

// Store Stack
import ExploreShops from '../screen/ExploreShops';
import AboutStore from '../screen/AboutStore';

/* ================= STACKS ================= */

const Home = createStackNavigator();
const Product = createStackNavigator();
const Wishlist = createStackNavigator();
const Orders = createStackNavigator();
const Store = createStackNavigator();

/* ================= COMMON OPTIONS ================= */

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right', // closest to SlideFromRightIOS
};

/* ================= HOME STACK ================= */

export const HomeStack = () => (
  <Home.Navigator screenOptions={screenOptions}>
    <Home.Screen name="HomeScreen" component={HomeScreen} />
    <Home.Screen name="MyCart" component={MyCart} />
    <Home.Screen name="OrderPlaced" component={OrderPlaced} />
    <Home.Screen name="ReturnProduct" component={ReturnProduct} />
    <Home.Screen name="HowToUseApp" component={HowToUseApp} />
    <Home.Screen name="privacyPoilcy" component={privacyPoilcy} />
  </Home.Navigator>
);

/* ================= PRODUCT STACK ================= */

export const ProductStack = () => (
  <Product.Navigator screenOptions={screenOptions}>
    <Product.Screen name="AllProductsScreen" component={AllProductsScreen} />
    <Product.Screen name="ProductDetails" component={ProductDetails} />
  </Product.Navigator>
);

/* ================= WISHLIST STACK ================= */

export const WishlistStack = () => (
  <Wishlist.Navigator screenOptions={screenOptions}>
    <Wishlist.Screen name="WishlistScreen" component={WishList} />
  </Wishlist.Navigator>
);

/* ================= ORDERS STACK ================= */

export const OrdersStack = () => (
  <Orders.Navigator screenOptions={screenOptions}>
    <Orders.Screen name="OrdersHistoryScreen" component={OrdersHistory} />
    <Orders.Screen name="OrderDetailScreen" component={OrderDetail} />
  </Orders.Navigator>
);

/* ================= STORE STACK ================= */

export const StoreStack = () => (
  <Store.Navigator screenOptions={screenOptions}>
    <Store.Screen name="StoreScreen" component={ExploreShops} />
    <Store.Screen name="AboutStore" component={AboutStore} />
  </Store.Navigator>
);
