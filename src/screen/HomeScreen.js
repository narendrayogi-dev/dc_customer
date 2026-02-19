/* eslint-disable prettier/prettier */
import React, {useRef, useState, useEffect, memo, useCallback} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  BackHandler,
  Platform,
  Alert,
  Linking
} from 'react-native';
import Gradient from '../components/Gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import VersionCheck from 'react-native-version-check';

//REDUX
import {useDispatch, useSelector} from 'react-redux';

import Swiper from 'react-native-swiper';

//Component
import CategoryListForHome from '../components/CategoryListForHome';
import ProductList from '../components/homeComponents/AutoScrollingProductList';
import Header from '../components/homeComponents/Header';

//Image
import ic_banner1 from '../assets/image/banner1.jpg';
import ic_banner2 from '../assets/image/banner2.jpg';
import {fetchHomeDataRequest} from '../redux/action/homeActions';
import {fetchProductRequest} from '../redux/action/productActions';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ShimmerLoader from '../components/ShimmerLoader';
import { navigate } from '../routes/NavigationService';

const bannerItem = [
  {
    id: 1,
    image: ic_banner1,
  },
  {
    id: 2,
    image: ic_banner2,
  },
];

const HomeScreen = props => {
  const {navigation} = props;
  const isFocused = useIsFocused();
  const [barColor, setBarColor] = useState('#DBD9F6');
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const dispatch = useDispatch();
  const {homeData, isLoading, error} = useSelector(state => state.home);
  const {cart_detail, categories, banner} = homeData;

  const {
    allProductsData,
    filteredProductsData,
    othersProductData,
    filterBy,
    sortBy,
    page,
    // isLoading,
    indexOfProduct,
    loader,
  } = useSelector(state => state.product);



  

  console.log('homeData ----->>>>>>>', banner);
  console.log('categories print ', categories);

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
        console.log('latest version check', latestVersion, currentVersion);
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

useFocusEffect(
  useCallback(() => {
    if (Platform.OS !== 'android') return;

    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => BackHandler.exitApp()},
      ]);
      return true; // block default behavior
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => subscription.remove();
  }, []),
);


  useEffect(() => {
    if (isFocused) {
      scrollToTop();
    }
  }, [isFocused]);

  useEffect(() => {
    dispatch(
      fetchProductRequest(`page=${1}&sort_by=${sortBy}&category=${filterBy}`),
    );
    dispatch(fetchHomeDataRequest(navigation));
  }, [dispatch]);

  // WHEN STORE UPDATED
  const isUpdated = useSelector(state => state.store.isStoreUpdated);
  useEffect(() => {
    if (isUpdated) {
      dispatch(fetchHomeDataRequest(navigation));
    }
  }, [isUpdated]);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    dispatch(fetchHomeDataRequest(navigation));
  };

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <StatusBar backgroundColor={barColor} barStyle="dark-content" />
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <Header
          navigation={navigation}
          cartItems={cart_detail}
          // data={}
        />

        <ScrollView
          ref={scrollRef}
          // bounces={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={colors}
            />
          }
          contentContainerStyle={{paddingBottom: hp(10)}}>
          <View style={styles.homeContainer}>
            <View style={[styles.banner]}>
              {isLoading ? (
               <ShimmerLoader
  loading={isLoading}
  width="100%"
  height="100%"
  borderRadius={wp(3)}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

              ) : (
                banner?.length > 0 && (
                  <Swiper
                    autoplay
                    activeDotStyle={[
                      {top: 20},
                      // banner?.length < 2 && {display: 'none'},
                    ]}
                    dotStyle={{top: 20}}>
                    {banner.map((item, index) => (
                      <Image
                        key={index}
                        source={{uri: item?.image}}
                        style={{width: '100%', height: '100%'}}
                        resizeMode="stretch"
                      />
                    ))}
                  </Swiper>
                )
              )}
            </View>

            <View style={styles.newArrivalHeading}>
              <Text style={styles.newArrivalText}>New Arrivals</Text>

              <TouchableOpacity
                testID="viewAllButton"
                onPress={() =>
                  navigate('Product', {
                    screen:'AllProductsScreen',
                    params: {id: 0},
                  })
                  // navigation.navigate('AllProductsScreen', {id: 0})
                }>
                <Text style={styles.newArrivalText1}>View All</Text>
              </TouchableOpacity>
            </View>

            <ProductList navigation={navigation} />

            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>Categories</Text>
            </View>
            <CategoryListForHome
              navigation={navigation}
              category={categories}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </View>
    </Gradient>
  );
};

export default memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp(100),
    display: 'flex',
    // backgroundColor: '#DBD9F6',
  },
  homeContainer: {
    flex: 1,
    paddingTop: wp(4),
    backgroundColor: '#fff',
    // alignItems: 'center',
  },
  sliderContainer: {
    height: hp(16),
    // width: wp(83.5),
    marginHorizontal: wp(4),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  banner: {
    // width: wp(83.5),
    marginHorizontal: wp(4),
    height: hp(22),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  newArrivalHeading: {
    // width: wp(83.5),
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(2.5),
  },
  newArrivalText: {
    color: '#999',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
  },
  newArrivalText1: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  categoryTextContainer: {
    // width: wp(95),
    paddingHorizontal: wp(4),
  },
  categoryText: {
    marginVertical: hp(1),
    color: '#999',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
  },
});
