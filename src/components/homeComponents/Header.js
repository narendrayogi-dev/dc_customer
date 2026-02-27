/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';

import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

//icon
import ic_search from '../../assets/image/loupe.png';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  applyFilterSort,
  fetchProductRequest,
} from '../../redux/action/productActions';
import { ActivityIndicator } from 'react-native-paper';
import AppIcon from '../AppIcon';
import AppBadge from '../AppBadge';
import ShimmerLoader from '../ShimmerLoader';

const Header = ({ navigation, cartItems }) => {
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { allProductsData, loader } = useSelector(state => state.product);

  const { homeData, isLoading, error } = useSelector(state => state.home);
  const { cart_detail, categories, profile } = homeData;

  const cartCount = cart_detail?.cart_count ?? 0;
  const cartAmount = cart_detail?.cart_amount ?? 0;

  // console.log('catego',categories)
  //Custom Dropdown
  const data = [...allProductsData, ...categories];
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);

  let localItems = data;
  // const handleSearch = text => {
  //   setSearchText(text);

  //   if (!text) {
  //     setItems([]);
  //   } else {
  //     const filteredData = localItems.filter(item => {
  //       const searchPattern = text.toUpperCase();

  //       const {name, title} = item;
  //       let prod = (name || '').toUpperCase();
  //       let cat = (title || '').toUpperCase();
  //       let found =
  //         prod?.indexOf(searchPattern) > -1 || cat?.indexOf(searchPattern) > -1;

  //       return found;
  //     });

  //     setItems(filteredData);
  //   }
  // };

  const handleSearch = text => {
    setSearchText(text);

    if (!text) {
      setItems([]);
    } else {
      const searchPattern = text.toUpperCase();

      const filteredData = localItems.filter(item => {
        // Check name/title match first
        const nameMatch = (item.name || '')
          .toUpperCase()
          .includes(searchPattern);
        const titleMatch = (item.title || '')
          .toUpperCase()
          .includes(searchPattern);

        // Check tag names if they exist
        const tagMatch = item.tag_names?.some(tag =>
          tag.toUpperCase().includes(searchPattern),
        );

        return nameMatch || titleMatch || tagMatch;
      });

      setItems(filteredData);
    }
  };
  console.log(items, 'items', items?.length);

  const handleEnableSearch = () => {
    setCheck(true);
    setSearchText('');
    if (allProductsData.length === 0) {
      dispatch(fetchProductRequest(`tag_names=${searchText}`));
    }
  };

  console.log(searchText, 'seareerrrrrr');

  const handlePick = async item => {
    // console.log('@@@', item);
    if (item.name) {
      navigation.navigate('ProductDetails', { id: item.id });
    } else if (item.title) {
      navigation.navigate('AllProductsScreen');
      dispatch(applyFilterSort({ filterBy: item.id }));
    }
    setCheck(false);
    setItems([]);
  };

  return (
    <View style={headerStyle.header}>
      <View style={headerStyle.subHeader}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={() => {
            navigation.navigate('DrawerScreen');
          }}
        >
          <AppIcon size={wp(8.5)} name="menu" type="ion-icons" color="#999" />
        </TouchableOpacity>

        {isLoading && !profile.active_store_name ? (
          <ShimmerLoader
            loading={isLoading}
            width={wp(30)}
            height={hp(2.5)}
            borderRadius={3}
            shimmerColors={['#999', '#b5b5b5', '#999']}
          />
        ) : (
          <Text style={headerStyle.title}>
            {profile.active_store_name || 'No store access'}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('MyCart')}
          style={headerStyle.cartWrapper}
        >
          <AppIcon type="fa" name="shopping-cart" size={wp(8.5)} />

          {/* Count */}
          {cartCount > 0 && (
            <View style={headerStyle.countBubble}>
              <Text style={headerStyle.countText}>{cartCount}</Text>
            </View>
          )}

          {/* Amount */}
          <View style={headerStyle.amountBox}>
            <Text style={headerStyle.amountText}>₹ {cartAmount}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        disabled={isLoading}
        onPress={handleEnableSearch}
        testID="searchContainerButton"
        activeOpacity={0.8}
        style={headerStyle.searchContainer}
      >
        <Image source={ic_search} style={headerStyle.searchIcon} />
        <Text style={headerStyle.searchInput}>Search...</Text>
        <Modal
          useNativeDriver={true}
          onBackButtonPress={() => {
            setCheck(false);
          }}
          style={{ paddingTop: inset.top }}
          isVisible={check}
          onBackdropPress={() => {
            setCheck(false);
          }}
        >
          {/* FOR IOS BEHAVIOR == PADDING */}
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={headerStyle.dropdownList}>
              <TouchableOpacity
                style={{
                  right: 3,
                  top: 3,
                  alignSelf: 'flex-end',
                  position: 'absolute',
                }}
                onPress={() => {
                  setItems([]);
                  setSearchText('');
                  setCheck(false);
                }}
              >
                <AppIcon
                  activeOpacity={1}
                  type="entypo"
                  name="circle-with-cross"
                  color="red"
                  size={wp(6)}
                />
              </TouchableOpacity>

              <TextInput
                placeholder="Search..."
                placeholderTextColor="#838383"
                value={searchText}
                onChangeText={handleSearch}
                editable={!loader}
                autoFocus
                returnKeyLabel="search"
                returnKeyType="search"
                enablesReturnKeyAutomatically
                style={{
                  marginBottom: hp(2),
                  borderBottomWidth: 1,
                  borderBottomColor: '#c1c1c1',
                  width: wp(80),
                  color: '#000',
                  paddingVertical: 0,
                  marginTop: hp(1.5),
                }}
              />
              {loader ? (
                <>
                  <ActivityIndicator size="large" color="#000080" />
                  <Text
                    style={{
                      marginTop: 10,
                      color: '#000',
                      fontSize: 16,
                      textAlign: 'center',
                    }}
                  >
                    Please wait...
                  </Text>
                </>
              ) : (
                <FlatList
                  keyExtractor={(item, index) => item?.id || index}
                  data={items}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={{
                          height: hp(6),
                          width: wp(80),
                          marginVertical: hp(0.5),
                          borderWidth: 1,
                          borderColor: '#000',
                          borderRadius: wp(0.5),
                          flexDirection: 'row',
                        }}
                        onPress={() => handlePick(item)}
                      >
                        {/* <Image source={ic_down} style={headerStyle.dropDownIcon} /> */}

                        <Text
                          style={{
                            alignSelf: 'center',
                            marginLeft: wp(2),
                            textTransform: 'capitalize',
                          }}
                        >
                          {item.name || item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const headerStyle = StyleSheet.create({
  header: {
    height: hp(16),
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginTop: hp(1),
    // borderWidth: 1,
    marginHorizontal: wp(4),
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  badgeContainer: {
    position: 'absolute',
    right: wp(-1),
    top: -13,
  },
  badgeContainer1: {
    position: 'absolute',
    // left: wp(12.5),
    // top: -8,
    borderRadius: hp(3),
    backgroundColor: '#999',
  },
  rating: {
    left: wp(-1),
    top: hp(-0.5),
  },
  searchContainer: {
    height: hp(5),
    // width: wp(83.5),
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: hp(3),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(4),
    backgroundColor: '#fff',
    elevation: 7,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    overflow: 'visible',
  },
  searchInput: {
    flex: 1,
    color: '#000',
    marginLeft: wp(2),
    paddingVertical: 0,
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  dropdownList: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1,
    borderRadius: hp(0.6),
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },

  // cart

  cartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  countBubble: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#e53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  countText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  amountBox: {
    position: 'absolute',
    left: -50,
    backgroundColor: 'gray',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(0.8),
    borderRadius: 6,
  },

  amountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
