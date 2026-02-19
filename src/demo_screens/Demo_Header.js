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
import ic_search from '../assets/image/loupe.png';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  applyFilterSort,
  fetchProductRequest,
} from '../redux/action/productActions';
import { ActivityIndicator } from 'react-native-paper';
import { goForLogin } from '../components/globalFunctions';
import ShimmerLoader from '../components/ShimmerLoader';
import AppIcon from '../components/AppIcon';
import AppBadge from '../components/AppBadge';

const Demo_Header = ({ navigation, cartItems }) => {
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  // const {arrival_products, isLoading, categories} = useSelector(
  //   state => state.demoHome.demoData,
  // );

  const { demoHomeData, isLoading, error } = useSelector(
    state => state.demoHome,
  );
  const { cart_detail, categories, profile, arrival_products } = demoHomeData;

  //Custom Dropdown
  const data = [...arrival_products, ...categories];
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [check, setCheck] = useState(false);

  let localItems = data;
  const handleSearch = text => {
    setSearchText(text);

    if (!text) {
      setItems([]);
    } else {
      const filteredData = localItems.filter(item => {
        const searchPattern = text.toUpperCase();

        const { name, title } = item;
        let prod = (name || '').toUpperCase();
        let cat = (title || '').toUpperCase();
        let found =
          prod?.indexOf(searchPattern) > -1 || cat?.indexOf(searchPattern) > -1;

        return found;
      });

      setItems(filteredData);
    }
  };

  const handleEnableSearch = () => {
    setCheck(true);
    setSearchText('');
    if (arrival_products.length === 0) {
      dispatch(fetchProductRequest());
    }
  };

  const handlePick = async item => {
    // console.log('@@@', item);
    if (item.name) {
      goForLogin(navigation);
    } else if (item.title) {
      navigation.navigate('Demo_ProductsScreen');
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
            goForLogin(navigation);
          }}
        >
          <AppIcon size={wp(8.5)} name="menu" type="ionicon" color="#999" />
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
          <Text style={headerStyle.title}>Demo Store</Text>
        )}

        <TouchableOpacity onPress={() => goForLogin(navigation)}>
          <AppIcon type="fa" name="shopping-cart" size={wp(8.5)} />
          <AppBadge
            value={cart_detail?.cart_count || 0}
            status="error"
            containerStyle={headerStyle.badgeContainer}
          />
          <AppBadge
            value={`₹ ${cart_detail?.cart_amount || 0}`}
            status=""
            containerStyle={[
              headerStyle.badgeContainer1,
              {
                left:
                  cart_detail?.cart_amount?.toString().length < 5 ? -45 : -55,
              },
            ]}
            badgeStyle={{
              width:
                cart_detail?.cart_amount?.toString().length < 5
                  ? wp(13)
                  : wp(17),
            }}
          />
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
                editable={!isLoading}
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
              {isLoading ? (
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

export default Demo_Header;

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
    // left: wp(-12.5),
    top: -8,
    borderRadius: hp(3),
    backgroundColor: '#999',
  },
  rating: {
    left: wp(-1),
    top: hp(-0.5),
  },
  searchContainer: {
    height: hp(4),
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
});
