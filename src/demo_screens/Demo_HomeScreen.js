/* eslint-disable prettier/prettier */
import React, {useRef, useState, useEffect, memo} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import Gradient from '../components/Gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets} from 'react-native-safe-area-context';

//REDUX
import {useDispatch, useSelector} from 'react-redux';

import Swiper from 'react-native-swiper';



//Component
import CategoryListForHome from '../components/CategoryListForHome';


//Image
import ic_banner1 from '../assets/image/banner1.jpg';
import ic_banner2 from '../assets/image/banner2.jpg';
import Demo_Header from './Demo_Header';
import {fetchDemoDataRequest} from '../redux/action/demoActions';
import Demo_AutoScrollingProductList from './Demo_AutoScrollingProductList';
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

const Demo_HomeScreen = props => {
  const {navigation} = props;
  const [barColor, setBarColor] = useState('#DBD9F6');
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const dispatch = useDispatch();
  const {demoHomeData, isLoading, error, banner} = useSelector(
    state => state.demoHome,
  );
  const {cart_detail, categories, help_mobile_number} = demoHomeData;

  // const checkAppUpdate = async () => {
  //   try {
  //     const latestVersion = await VersionCheck.getLatestVersion(); // Play Store se latest version
  //     const currentVersion = VersionCheck.getCurrentVersion(); // App ka current version
  //     console.log('jksdcuvi4jrnfdc', latestVersion, currentVersion);

  //     if (latestVersion !== currentVersion) {
  //       console.log('jksdcuvi4jrnfdc', latestVersion, currentVersion);
  //       Alert.alert(
  //         'Update Available',
  //         'A new version of the app is available. Please update to continue.',
  //         [
  //           {text: 'Cancel', style: 'cancel'},
  //           {
  //             text: 'Update',
  //             onPress: () => Linking.openURL(VersionCheck.getPlayStoreUrl()),
  //           },
  //         ],
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error checking update:', error);
  //   }
  // };

  // useEffect(() => {
  //   checkAppUpdate();
  // }, []);

  console.log(
    'demoHomeData print data 0909090909',
    useSelector(state => state.demoHome),
  );

  useEffect(() => {
    if (props.isFocused) {
      scrollToTop();
      setBarColor('#DBD9F6');
    }

    // aaaaa();
  }, [props.isFocused]);

  useEffect(() => {
    dispatch(fetchDemoDataRequest(navigation));
  }, [dispatch]);

  console.log('mobile print here', help_mobile_number);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    dispatch(fetchDemoDataRequest(navigation));
  };

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <StatusBar backgroundColor={barColor} barStyle="dark-content" />
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <Demo_Header
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
              {/* <AnimatedScroll bannerItem={bannerItem} height={hp(16)} width={wp(83.5)} /> */}
              {isLoading ? (
               <ShimmerLoader
  loading={isLoading}
  width="100%"
  height="100%"
  borderRadius={wp(3)}
/>

              ) : (
                demoHomeData?.banner.length > 0 && (
                  <Swiper
                    autoplay
                    activeDotStyle={[
                      {top: 20},
                      bannerItem.length < 2 && {display: 'none'},
                    ]}
                    dotStyle={{top: 20}}>
                    {demoHomeData?.banner.map((item, index) => (
                      <Image
                        key={index}
                        source={{uri: item.image}}
                        style={{width: '100%', height: '100%'}}
                        resizeMode="stretch"
                      />
                    ))}
                  </Swiper>
                )
              )}
            </View>

            <View style={styles.newArrivalHeading}>
              <Text style={styles.newArrivalText}>New Arrival</Text>

              <TouchableOpacity
                testID="viewAllButton"
                onPress={() =>
                  navigate('Demo_Product', {
                    screen: 'Demo_ProductsScreen',
                    params: {id: 0},
                  })
                  // navigation.navigate('Demo_ProductsScreen', {id: 0})
                }>
                <Text style={styles.newArrivalText1}>View All</Text>
              </TouchableOpacity>
            </View>

            <Demo_AutoScrollingProductList navigation={navigation} />

            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>Category</Text>
            </View>
            <CategoryListForHome
              navigation={navigation}
              category={categories}
              loading={isLoading}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{position: 'absolute', right: 20, bottom: 80}}
          onPress={async () => {
            // console.log('help_mobile_number WhatsApp with URL:', help_mobile_number);

            const vendorPhoneNumber = help_mobile_number; // Include the country code
            const message =
              'Hello, I would like to know more about your products!';
            // const url = `https://wa.me/${vendorPhoneNumber}?text=${encodeURIComponent(
            //   message,
            // )}`;
            const url = `whatsapp://send?phone=91${vendorPhoneNumber}&text=${message}`;

            console.log('Attempting to open WhatsApp with URL:', url);

            try {
              // Directly open the URL without checking with canOpenURL
              await Linking.openURL(url);
              console.log('WhatsApp opened successfully');
            } catch (err) {
              console.error('Failed to open WhatsApp:', err);
              Alert.alert(
                'Error',
                'Could not open WhatsApp. Make sure it is installed.',
              );
            }
          }}>
          <Image
            source={require('../assets/icons/whatsapp.png')}
            style={{
              height: 40,
              width: 40,
            }}
          />
        </TouchableOpacity>
      </View>
    </Gradient>
  );
};

export default memo(Demo_HomeScreen);

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
    height: hp(16),
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
