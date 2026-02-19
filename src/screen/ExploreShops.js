/* eslint-disable prettier/prettier */
import React, {useState, useRef, useEffect, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import Gradient from '../components/Gradient';
import Header from '../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//REDUX
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchDeleteStoreRequest,
  fetchStoresRequest,
  searchActiveStores,
  storeJustUpdated,
} from '../redux/action/storeActions';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {async_keys, getData, storeData} from '../api/UserPreference';
import {showSnack} from '../components/Snackbar';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {
  fetchNewArrivalProductRequest,
  fetchProductRequest,
  modifyAllProduct,
  modifyFilterProduct,
} from '../redux/action/productActions';
import FastImage from '@d11/react-native-fast-image';
import {fetchProfileDataRequest} from '../redux/action/profileActions';

//icon
import ic_search from '../assets/image/loupe.png';
import ic_link from '../assets/icons/link.png';
import img_shop from '../assets/image/shops.png';
import ic_store_placeholder from '../assets/icons/store_placeholder.jpg';
import ic_prod_placholder from '../assets/icons/diamond.png';
import {fetchHomeDataRequest} from '../redux/action/homeActions';
import PreventAnyTap from '../components/PreventAnyTap';
import {LinkStoreView} from './exploreShopApi/exploreShopView';
import {linkStoreData} from './exploreShopApi/exploreShopPresenter';
import AppIcon from '../components/AppIcon';
import { useIsFocused } from '@react-navigation/native';
import ShimmerLoader from '../components/ShimmerLoader';
import { resetTo } from '../routes/NavigationService';

const ExploreShops = props => {
  const {navigation} = props;

  const [storeCode, setStoreCode] = useState('');
  const [tabPosition, setTabPosition] = useState(1);
  const [allStoreLists, setAllStoreList] = useState([]);
  const [showStoreCodeInput, setShowStoreCodeInput] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [imageError, setImageError] = useState([]);
  const [switchStoreLoader, setSwitchStoreLoader] = useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [number, setNummber] = useState();
  const [message, setMessage] = useState();
  const inset = useSafeAreaInsets();

  const isFocused  = useIsFocused()

  //GETTING DATA FROM REDUX
  const dispatch = useDispatch();
  const {
    isLoading,
    loader,
    activeStoreList,
    pendingStoreList,
    cartItems,
    allStoreList,
  } = useSelector(state => state.store);

  const {profile} = useSelector(state => state.home.homeData);

  console.log(
    'profile',
    useSelector(state => state.home.homeData),
  );

  console.log('list of store pending 87re8347re', allStoreList);

  const statusOne = allStoreList.filter(store => store.status === '1');
  const otherStatus = allStoreList.filter(store => store.status !== '1');

  console.log('statusOne list of array', statusOne);
  console.log('statusOne list of array 2', otherStatus);

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchStoresRequest());
    } else {
      setImageError([]);
    }
  }, [isFocused]);

  const linkStoreView: LinkStoreView = {
    linkStoreSuccess: res => {
      if (res) {
        console.log('response of link new store', res);
        showSnack(res.Message);
        dispatch(fetchStoresRequest());
        setStoreCode('');
      } else {
        Alert.alert(res.Message);
      }
    },
    linkStoreFailure: err => {
      console.log('error of store code');
    },
  };

  const handleSearch = text => {
    setSearchValue(text);
    dispatch(searchActiveStores(text));
  };
  //HANDLING TAB
  const handleTabPosition = event => {
    // Alert.alert('hii');
    event.persist();

    const pos =
      Math.floor(event.nativeEvent.contentOffset.x) / Math.floor(wp(100)) + 1;
    pos !== tabPosition && setTabPosition(Math.floor(pos));
  };

  const scrollViewRef = useRef(null);

  const activeTab = () => {
    setTabPosition(1);

    scrollViewRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  };

  const pendingTab = () => {
    setTabPosition(2);

    scrollViewRef.current?.scrollTo({
      x: wp(100),
      animated: true,
    });
  };
  //DELETING STORE
  const handleDelete = id => {
    Alert.alert('Remove Store', 'Are you sure you want to remove this store', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => deleteUser()},
    ]);
    const deleteUser = () => {
      dispatch(fetchDeleteStoreRequest({id}));
    };
  };

  const buttonPosition =
    tabPosition === 1 ? styles.activeTabButton : styles.pendingTabButton;

  const buttonTextPosition =
    tabPosition === 1
      ? styles.activeTabButtonText
      : styles.pendingTabButtonText;

  const handleLinkStore = () => {
    // if (!showStoreCodeInput) {
    //   setShowStoreCodeInput(true);
    //   let formData = new FormData();
    //   formData.append('storeCode', storeCode);

    //   linkStoreData(linkStoreView, formData);
    //   return true;

    if (!showStoreCodeInput) {
      // First time clicking, show the input field
      setShowStoreCodeInput(true);
    } else {
      console.log('storeCode print here', storeCode);
      // When input field is visible, call the API with the store code
      if (storeCode?.trim() === '') {
        Alert.alert('Please enter store code first! ');
        // console.log('Please enter a store code');
        return;
      }
      let formData = new FormData();
      formData.append('store_code', storeCode);

      // Call API
      linkStoreData(linkStoreView, formData);
    }

    console.log('handle link store ', storeCode);
  };

  const handleStoreCode = async text => {
    const upper = await text.toUpperCase();
    setStoreCode(upper);
  };

  const handleSelectedStore = async store_code => {
    try {
      setSwitchStoreLoader(true);
      await storeData(async_keys.active_store_code, store_code);

      const response = await makeRequest(
        `${BASE_URL}update_active_store`,
        {store_code},
        true,
      );

      if (response) {
        const {Message, Status} = response;
        if (Status === true) {
          navigation.navigate('HomeScreen');
          dispatch(modifyAllProduct([]));
          dispatch(storeJustUpdated(true));
          showSnack(Message);
        } else {
          showSnack(Message, null, true);
        }
      }

      setSwitchStoreLoader(false);
    } catch (error) {
      setSwitchStoreLoader(false);
      console.log(error);
    }
  };

  //IMAGE ERROR ON LOADING
  const handleImageError = id => setImageError([...imageError, id]);
  const onImageErrorClear = id => {
    //  console.log('clearring image error');
    setImageError(imageError.filter(item => item !== id));
  };
  //REFRESHING
  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    setImageError([]);
    dispatch(fetchStoresRequest());
  };
  //LIST HEADER
  const listHeaderComponent = () =>
    // !profile?.active_store_code && (
    !activeStoreList.length > 0 && (
      <View style={styles.notActiveContainer}>
        <Text style={styles.notActiveText}>
          You have not any active store!{`\n`}
          <Text style={styles.notActiveText2}>
            Please choose a store first.
          </Text>
        </Text>
        <Text style={styles.notActiveMobileText}>
          Your mobile No. is: {profile?.mobile}
        </Text>

        {/* {activeStoreList.length === 0 && (
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 30,
              elevation: 5,
              paddingVertical: 15,
              paddingHorizontal: 20,
              marginHorizontal: 15,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                textAlign: 'center',
              }}>
              Contact US
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                textAlign: 'center',
              }}>
              Fill the form and we'll get back to you soon
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View style={{}}>
                <Text>First Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      width: 150,
                    },
                  ]}
                  value={firstName}
                  onChangeText={text => setFirstName(text)}
                  placeholder="Enter First Name"
                />
              </View>
              <View>
                <Text>Last Name</Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      width: 150,
                    },
                  ]}
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChangeText={value => setLastName(value)}
                />
              </View>
            </View>

            <View>
              <Text>Email</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={email}
                onChangeText={value => setEmail(value)}
              />
            </View>
            <View>
              <Text>Mobile</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Mobile"
                value={number}
                onChangeText={value => setNummber(value)}
              />
            </View>
            <View>
              <Text>Message</Text>

              <TextInput
                style={{
                  height: 80,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  marginBottom: 20,
                }}
                placeholder="Enter Message"
                value={message}
                onChangeText={value => setMessage(value)}
              />
            </View>
          </View>
        )} */}
      </View>
    );

  //LIST RENDER ACTIVE
  const renderItemActive = ({item, index}) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.7}
      disabled={profile?.active_store_code !== item.store_code}
      onPress={() => resetTo('Home', {screen: 'HomeScreen'})}
      style={[
        styles.shopContainer,
        profile?.active_store_code === item.store_code && {
          backgroundColor: 'rgba(0,200,0, .1)',
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: {width: 0, height: 0},
        },
      ]}>
      {!isLoading && (
        <AppIcon
          type="antdesign"
          name="delete"
          color="red"
          size={wp(3.6)}
          reverse
          containerStyle={{
            position: 'absolute',
            zIndex: 1,
            right: wp(0.4),
            top: wp(0.4),
          }}
          iconStyle={{fontSize: wp(4.5)}}
          onPress={() => handleDelete(item.id)}
        />
      )}

      {isLoading ? (
        <ShimmerLoader
  loading={true} // or isLoading
  width={hp(13)}
  height={hp(13)}
  borderRadius={wp(1)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

      ) : imageError.includes(item.id) ? (
        <Image source={ic_store_placeholder} style={styles.shopImage} />
      ) : (
        <Image
          source={{uri: item.store_image}}
          style={styles.shopImage}
          onError={() => handleImageError(item.id)}
          onLoad={() => onImageErrorClear(item.id)}
        />
      )}

      <View style={styles.descriptionContainer}>
        {isLoading ? (
          <ShimmerLoader
  loading={true} // or isLoading
  width={wp(50)}
  height={wp(3)}
  borderRadius={wp(20)}
  style={{
    marginLeft: wp(3),
    marginVertical: wp(1),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text style={styles.shopName}>{item.store_name}</Text>
        )}
        {isLoading ? (
          <ShimmerLoader
  loading={true} // or isLoading
  width={wp(24)}
  height={wp(3)}
  borderRadius={wp(20)}
  style={{
    marginLeft: wp(3),
    marginVertical: wp(1),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text style={styles.vendorName}>By {item.vendor_name}</Text>
        )}
       

        {isLoading ? (
          <ShimmerLoader
  loading={true} // or isLoading
  width={wp(28)}
  height={wp(3)}
  borderRadius={wp(20)}
  style={{
    marginLeft: wp(3),
    marginVertical: wp(1),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text style={styles.storeCode}>Store Code: {item.store_code}</Text>
        )}
      </View>

      {!isLoading && profile?.active_store_code !== item.store_code && (
        <TouchableOpacity
          style={[styles.viewMoreButton]}
          onPress={() => handleSelectedStore(item.store_code)}>
          <Text style={styles.viewMoreText}>View Store</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
  //LIST RENDER PENDING
  const renderItemPending = ({item, index}) => (
    <View key={index} style={styles.shopContainer}>
      {!isLoading && (
        <AppIcon
          type="antdesign"
          name="delete"
          color="red"
          size={wp(3.6)}
          reverse
          containerStyle={{
            position: 'absolute',
            zIndex: 1,
            right: wp(0.4),
            top: wp(0.4),
          }}
          iconStyle={{fontSize: wp(4.5)}}
          onPress={() => handleDelete(item.id)}
        />
      )}

      {isLoading ? (
        <ShimmerLoader
  loading={true} // or isLoading
  width={hp(13)}
  height={hp(13)}
  borderRadius={wp(1)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

      ) : (
        <FastImage
          style={styles.shopImage}
          source={{
            uri: item.store_image,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          defaultSource={ic_prod_placholder}
          resizeMode={FastImage.resizeMode.stretch}
        />
      )}

      <View style={styles.descriptionContainer}>
        {isLoading ? (
          <ShimmerLoader
  loading={true} // or isLoading
  width={wp(50)}
  height={wp(3)}
  borderRadius={wp(20)}
  style={{
    marginLeft: wp(3),
    marginVertical: wp(1),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text style={styles.shopName}>{item.store_name}</Text>
        )}
        {isLoading ? (
         <ShimmerLoader
  loading={true} // or isLoading
  width={wp(30)}
  height={wp(3)}
  borderRadius={wp(20)}
  style={{
    marginLeft: wp(3),
    marginVertical: wp(1),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text style={styles.vendorName}>by {item.vendor_name}</Text>
        )}
        {isLoading ? (
          <View>
  <ShimmerLoader
    loading={isLoading} // or true
    width={wp(40)}
    height={wp(3)}
    borderRadius={wp(20)}
    style={{
      marginLeft: wp(3),
      marginVertical: wp(1),
    }}
    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
  />

  <ShimmerLoader
    loading={isLoading} // or true
    width={wp(42)}
    height={wp(3)}
    borderRadius={wp(20)}
    style={{
      marginLeft: wp(3),
      marginVertical: wp(1),
    }}
    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
  />
</View>

        ) : (
          <Text style={styles.description}>
            A Moment of Precious Craft.{`\n`}Style with Precious Simplicity
          </Text>
        )}

        {isLoading ? (
          <ShimmerLoader
  loading={isLoading} // or true
  width={wp(33)}
  height={wp(3)}
  borderRadius={wp(20)}
  style={{
    marginLeft: wp(3),
    marginVertical: wp(1),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text style={styles.storeCode}>Store Code: {item.store_code}</Text>
        )}
      </View>

      {!isLoading && <Text style={styles.pendingText}>Pending</Text>}
    </View>
  );

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff" gh="29%">
      <View style={[styles.container, {paddingTop: inset.top}]}>
        <Header
          title="Explore Shops"
          width={wp(71)}
          navigation={navigation}
          // params={params}
          goBack="HomeScreen"
          disabledBackButton={!profile?.active_store_code}
        />

        {(switchStoreLoader || loader) && <PreventAnyTap />}

        <View style={styles.tabButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={activeTab}
            style={buttonPosition}>
            <Text style={buttonTextPosition}>Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={pendingTab}
            style={
              tabPosition === 2
                ? styles.activeTabButton
                : styles.pendingTabButton
            }>
            <Text
              style={
                tabPosition === 2
                  ? styles.activeTabButtonText
                  : styles.pendingTabButtonText
              }>
              Pending
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Image source={ic_search} style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchValue}
            style={styles.searchInput}
            onChangeText={handleSearch}
          />

          {searchValue && (
            <AppIcon
              onPress={() => {
                dispatch(searchActiveStores(''));
                setSearchValue('');
              }}
              reverse
              type="fa"
              name="remove"
              color="#999"
              size={wp(2)}
              iconStyle={{fontSize: wp(4)}}
              containerStyle={{}}
            />
          )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={handleTabPosition}>
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <View style={styles.homeContainer}>
              {!activeStoreList.length > 0 && (
                <View
                  style={{
                    // top: hp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(100),
                    // borderWidth: 1,
                  }}>
                  <Text>No stores to display</Text>
                </View>
              )}

              <FlatList
                keyExtractor={(item, index) => item?.id || index}
                data={activeStoreList}
                renderItem={renderItemActive}
                ListHeaderComponent={listHeaderComponent}
                refreshControl={
                  <RefreshControl
                    refreshing={loader || switchStoreLoader}
                    onRefresh={handleRefresh}
                    colors={colors}
                  />
                }
                contentContainerStyle={{paddingBottom: hp(10)}}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <View style={styles.homeContainer}>
              {!otherStatus.length > 0 && (
                <View
                  style={{
                    // top: hp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(100),
                  }}>
                  <Text>No stores to display</Text>
                </View>
              )}

              <FlatList
                keyExtractor={(item, index) => item?.id || index}
                data={otherStatus}
                renderItem={renderItemPending}
                refreshControl={
                  <RefreshControl
                    refreshing={loader}
                    onRefresh={handleRefresh}
                    colors={colors}
                  />
                }
                contentContainerStyle={{paddingBottom: hp(10)}}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
<KeyboardAvoidingView>
        <View style={styles.linkStoreContainer}>
          {showStoreCodeInput && (
            <View style={styles.storeCodeInputContainer}>
              <TextInput
                placeholder="Store Code/Number"
                placeholderTextColor="#999"
                style={styles.storeCodeInput}
                // maxLength={25}`
                keyboardType="number-pad"
                onChangeText={handleStoreCode}
                value={storeCode}
              />
            </View>
          )}

          {/* Always show the button regardless of input visibility */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.storeLinkButton}
            onPress={handleLinkStore}>
            <Image source={ic_link} style={styles.storeLinkImage} />
            <Text style={styles.storeLinkButtonText}>Link New Store</Text>
          </TouchableOpacity>
        </View>
</KeyboardAvoidingView>

      </View>
    </Gradient>
  );
};

export default memo(ExploreShops);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchContainer: {
//     height: hp(4),
//     width: wp(83.5),
//     borderColor: '#c1c1c1',
//     borderWidth: 0.3,
//     borderRadius: hp(3),
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: wp(4),
//     backgroundColor: '#fff',
//     elevation: 5,
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     shadowOffset: {width: 5, height: 5},
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//   },
//   searchInput: {
//     flex: 1,
//     height: hp(5.8),
//     color: '#000',
//     marginLeft: wp(2),
//     fontFamily: 'Roboto-Regular',
//   },
//   tabButtonContainer: {
//     flexDirection: 'row',
//     height: hp(6),
//     overflow: 'hidden',
//     backgroundColor: '#f1f1f1',
//     elevation: 5,
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     shadowOffset: {width: 5, height: 5},
//     marginVertical: hp(2),
//   },
//   activeTabButton: {
//     flex: 1,
//     backgroundColor: '#F6CE4B',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pendingTabButton: {
//     flex: 1,
//     backgroundColor: '#838383',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   activeTabButtonText: {
//     fontFamily: 'Roboto-Bold',
//     color: '#333',
//   },
//   pendingTabButtonText: {
//     color: '#fff',
//     fontFamily: 'Roboto-Bold',
//   },
//   homeContainer: {
//     flex: 1,
//     // marginVertical: hp(1),
//     // alignItems: 'center',
//   },
//   shopContainer: {
//     flexDirection: 'row',
//     width: wp(90),
//     backgroundColor: '#fff',
//     elevation: 7,
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     shadowOffset: {width: 5, height: 5},
//     alignSelf: 'center',
//     alignItems: 'center',
//     marginHorizontal: wp(5),
//     padding: hp(2),
//     paddingBottom: hp(3),
//     borderRadius: wp(1.5),
//     marginVertical: hp(1),
//   },
//   shopImage: {
//     width: wp(26),
//     height: hp(13),
//   },
//   descriptionContainer: {
//     marginLeft: wp(2),
//   },
//   shopName: {
//     fontFamily: 'Roboto-Bold',
//     fontSize: wp(5),
//     lineHeight: wp(5),
//   },
//   vendorName: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: wp(3),
//     color: '#999',
//     marginVertical: wp(0.5),
//   },
//   description: {
//     fontFamily: 'Roboto-Medium',
//     fontSize: wp(3.2),
//     color: '#999',
//   },
//   storeCode: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: wp(3.3),
//     marginVertical: wp(0.5),
//     fontWeight: '700',
//   },
//   viewMoreButton: {
//     backgroundColor: '#333',
//     width: wp(22),
//     height: hp(3.5),
//     borderRadius: hp(2),
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: hp(1),
//     right: wp(4),
//     elevation: 3,
//   },
//   viewMoreText: {
//     fontFamily: 'Roboto-Bold',
//     fontSize: wp(3.3),
//     color: '#fff',
//   },
//   pendingText: {
//     color: '#F6CE4B',
//     fontFamily: 'Roboto-Black',
//     fontSize: wp(4.3),
//     position: 'absolute',
//     bottom: hp(1),
//     right: wp(4),
//   },
//   linkStoreContainer: {
//     paddingBottom: hp(2),
//     paddingHorizontal: wp(10),
//     backgroundColor: '#c1c1c1',
//     bottom: 50,
//   },
//   storeCodeInputContainer: {
//     height: hp(5.5),
//     backgroundColor: '#fff',
//     borderRadius: hp(1),
//     elevation: 5,
//     marginVertical: hp(2),
//     paddingLeft: wp(2),
//   },
//   storeCodeInput: {
//     flex: 1,
//     color: '#000',
//     fontFamily: 'Roboto-Medium',
//   },
//   storeLinkButton: {
//     backgroundColor: '#35BE87',
//     height: hp(5.5),
//     flexDirection: 'row',
//     borderRadius: hp(1),
//     elevation: 3,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: hp(1),
//   },
//   storeLinkImage: {
//     width: wp(6),
//     aspectRatio: 1 / 1,
//     marginRight: wp(2),
//   },
//   storeLinkButtonText: {
//     color: '#fff',
//     fontFamily: 'Roboto-Bold',
//     fontSize: wp(4.6),
//   },
//   deleteButton: {
//     position: 'absolute',
//     zIndex: 1,
//     right: wp(-0.6),
//     top: wp(-1),
//   },
//   verticalScroll: {
//     flex: 1,
//     marginTop: hp(1),
//   },
// });

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
  notActiveContainer: {
    width: wp(100),
    flex: 1,
  },
  notActiveText: {
    fontFamily: 'Roboto-Black',
    marginVertical: hp(1),
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: wp(5),
    color: 'rgb(200, 0, 0)',
  },
  notActiveText2: {
    fontSize: wp(4.3),
    fontFamily: 'Roboto-Bold',
    marginBottom: hp(1),
  },
  notActiveMobileText: {
    fontSize: wp(4),
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  searchContainer: {
    height: hp(5),
    // width: wp(83.5),
    borderColor: '#c1c1c1',
    borderWidth: 0.3,
    borderRadius: hp(3),
    marginHorizontal: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(4),
    backgroundColor: '#fff',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    marginLeft: wp(2),
    fontFamily: 'Roboto-Regular',
    paddingVertical: 0,
  },
  tabButtonContainer: {
    flexDirection: 'row',
    height: hp(6),
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
    marginVertical: hp(2),
  },
  activeTabButton: {
    flex: 1,
    backgroundColor: '#F6CE4B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingTabButton: {
    flex: 1,
    backgroundColor: '#838383',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButtonText: {
    fontFamily: 'Roboto-Bold',
    color: '#333',
  },
  pendingTabButtonText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
  },
  homeContainer: {
    flex: 1,
    marginVertical: hp(1),
    // alignItems: 'center',
  },
  shopContainer: {
    flexDirection: 'row',
    width: wp(90),
    backgroundColor: '#fff',
    elevation: 7,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: wp(5),
    padding: hp(2),
    paddingBottom: hp(3),
    borderRadius: wp(1.5),
    marginVertical: hp(1),
  },
  shopImage: {
    width: wp(26),
    height: hp(13),
    borderRadius: wp(1.5),
  },
  descriptionContainer: {
    marginLeft: wp(3),
    flex: 1,
    marginVertical: hp(2),
  },
  shopName: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
    lineHeight: wp(5),
    width: 170,
  },
  vendorName: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3),
    color: '#999',
    marginVertical: wp(0.5),
  },
  description: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.2),
    color: '#999',
  },
  storeCode: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.3),
    marginVertical: wp(0.5),
    fontFamily: 'Roboto-Bold',
    color: '#000',
  },
  viewMoreButton: {
    backgroundColor: '#333',
    width: wp(20),
    height: hp(2.7),
    borderRadius: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: hp(1),
    right: wp(4),
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
  },
  viewMoreText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3),
    color: '#fff',
  },
  pendingText: {
    color: '#F6CE4B',
    fontFamily: 'Roboto-Black',
    fontSize: wp(4.3),
    position: 'absolute',
    bottom: hp(1),
    right: wp(4),
  },
  linkStoreContainer: {
    paddingBottom: hp(2),
    // paddingHorizontal: wp(10),
    backgroundColor: '#c1c1c1',
    bottom: 50,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  storeCodeInputContainer: {
    height: hp(4),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    marginVertical: hp(1.5),
    paddingLeft: wp(2),
    marginHorizontal: wp(8),
  },
  storeCodeInput: {
    flex: 1,
    color: '#000',
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3),
    paddingVertical: 0,
  },
  storeLinkButton: {
    backgroundColor: '#35BE87',
    height: hp(5),
    flexDirection: 'row',
    borderRadius: hp(1),
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(1),
    marginHorizontal: wp(8),
    marginVertical: hp(1.5),
  },
  storeLinkImage: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  storeLinkButtonText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4),
  },

  verticalScroll: {
    flex: 1,
    marginTop: hp(1),
  },
});
