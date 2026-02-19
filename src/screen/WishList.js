/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, memo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
  Platform,
  Pressable,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

//Component
import Gradient from '../components/Gradient';
import Header from '../components/Header';

//Icon
import ic_search from '../assets/image/loupe.png';
import ic_category from '../assets/image/apps.png';
import img_product from '../assets/image/product.png';
import ic_prod_placholder from '../assets/icons/diamond.png';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlistRequest,
  filterSearchWishlist,
} from '../redux/action/wishlistActions';
import { Dropdown } from 'react-native-element-dropdown';
import FastImage from '@d11/react-native-fast-image';
import Modal from 'react-native-modal';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { showSnack } from '../components/Snackbar';
import { WishlistDeleteView } from './wishlistApi/wishlistApiView';
import { WishlistDeleteData } from './wishlistApi/wishlistApiPresenter';
import { modifyCartDetail } from '../redux/action/homeActions';
import AppIcon from '../components/AppIcon';
import { useIsFocused } from '@react-navigation/native';
import ShimmerLoader from '../components/ShimmerLoader';

const WishList = props => {
  const { navigation } = props;
  const [category, setCategory] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [itemsCategory, setItemsCategory] = useState(categoryList);

  const [check1, setCheck1] = useState(false);
  const [paginationModalVisible, setPaginationModalVisible] = useState(false);

  const flatlistRef = useRef(null);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {
    allWishlistData,
    filteredWishlistData = [],
    othersWishlistData,
    isLoading,
    error,
  } = useSelector(state => state.wishlist);
  const { categories, cart_detail } = useSelector(state => state.home.homeData);
  const { mainRoute } = useSelector(state => state.route);

  console.log('cart_detail->222', cart_detail);

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchWishlistRequest());
    } else {
      clearSearch();
    }
    if (mainRoute !== 2) {
      scrollToTop();
    }
  }, [isFocused]);

  useEffect(() => {
    // console.log('[categories]');
    setCategoryList([{ id: 0, title: 'All' }, ...categories]);
    setItemsCategory([{ id: 0, title: 'All' }, ...categories]);
  }, [categories]);

  const scrollToTop = () => {
    if (flatlistRef.current && filteredWishlistData.length !== 0) {
      flatlistRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  const wishlistDeleteView: WishlistDeleteView = {
    wishlistDeleteSuccess: result => {
      console.log('wishlist delete result 2', result);
      dispatch(fetchWishlistRequest());
    },
  };

  const handleSearch = value => {
    if (value) {
      setCategory(0);
      scrollToTop();
      dispatch(fetchWishlistRequest(`search=${value}`));
    }

    setSearchText(value);
  };
  //Search
  const handleSearchCategory = text => {
    // console.log('handleSearchCategory()');
    const filteredData = categoryList.filter(
      item => item?.title?.toUpperCase().indexOf(text.toUpperCase()) > -1,
    );

    setItemsCategory(filteredData);
    // dispatch(fetchWishlistRequest());
  };

  //Dropdown List
  const handleEnableCategoryDropdown = () => {
    // console.log('handleEnableCategoryDropdown()');
    setCheck1(true);
    setItemsCategory(categoryList);
    clearSearch();
  };

  //Choose Category
  const handleCategory = async item => {
    scrollToTop();
    clearSearch();
    setCategory(item.id);

    dispatch(fetchWishlistRequest(item.id && `category_id=${item.id}`));

    setCheck1(false);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const renderDdItem = item => (
    <Text
      key={item.id}
      style={{ paddingHorizontal: 10, paddingVertical: 8, fontSize: wp(3) }}
    >
      {item.title || item.customer_name}
    </Text>
  );

  const handleJumpToPage = page => {
    setPaginationModalVisible(false);

    if (page < 1 || page > othersWishlistData?.last_page) false;

    dispatch(
      fetchWishlistRequest(
        `page=${page}${category ? `&category=${category}` : ''}`,
      ),
    );
    scrollToTop();
  };

  const listFooterComponent = () =>
    !isLoading &&
    filteredWishlistData.length > 0 && (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: hp(3),
            // marginHorizontal: wp(25),
          }}
        >
          <Text style={{ fontSize: wp(2.3), fontFamily: 'Roboto-Black' }}>
            Page
          </Text>
          <TouchableOpacity
            onPress={() => setPaginationModalVisible(true)}
            style={{
              borderWidth: 1,
              paddingHorizontal: wp(2),
              paddingVertical: hp(0.2),
              marginHorizontal: wp(4),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: wp(2.3),
                fontFamily: 'Roboto-Black',
              }}
            >
              {othersWishlistData?.current_page}
            </Text>

            <Modal
              useNativeDriver
              onBackButtonPress={() => {
                setPaginationModalVisible(false);
              }}
              onBackdropPress={() => setPaginationModalVisible(false)}
              isVisible={paginationModalVisible}
            >
              <View
                style={{
                  height: 300,
                  backgroundColor: '#fff',
                  borderRadius: hp(1),
                }}
              >
                <FlatList
                  keyExtractor={(item, index) => item?.id || index}
                  data={Array(othersWishlistData?.last_page).fill(0)}
                  contentContainerStyle={{ padding: hp(2) }}
                  renderItem={({ _, index }) => (
                    <TouchableOpacity
                      onPress={() => handleJumpToPage(index + 1)}
                      style={{
                        backgroundColor: '#FFF',
                        elevation: 5,
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        shadowOffset: { width: 0, height: 1 },
                        marginVertical: hp(0.5),
                        paddingHorizontal: wp(4),
                        paddingVertical: hp(1),
                        borderRadius: hp(0.7),
                      }}
                    >
                      <Text>Page {index + 1}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          </TouchableOpacity>

          {/* ###################### */}
          <Text style={{ fontSize: wp(2.3), fontFamily: 'Roboto-Black' }}>
            of {` `}{' '}
            <Text style={{ fontSize: wp(3) }}>
              {othersWishlistData?.last_page}
            </Text>
          </Text>
        </View>
        <Text
          style={{
            fontSize: wp(2.3),
            fontFamily: 'Roboto-Black',
            textAlign: 'center',
            marginVertical: hp(1),
          }}
        >
          ({othersWishlistData.to} of total {othersWishlistData?.total}{' '}
          Products)
        </Text>

        <View
          style={{
            flexDirection: 'row',
            // borderWidth: 1,
            paddingVertical: 5,
            marginHorizontal: wp(4),
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            disabled={othersWishlistData?.current_page === 1}
            onPress={() =>
              handleJumpToPage(othersWishlistData?.current_page - 1)
            }
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersWishlistData?.current_page === 1 ? '#ccc' : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation: othersWishlistData?.current_page === 1 ? 0 : 2,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text style={{ fontFamily: 'Roboto-Black', fontSize: wp(2.2) }}>
              Prev
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              othersWishlistData?.current_page === othersWishlistData?.last_page
            }
            onPress={() =>
              handleJumpToPage(othersWishlistData?.current_page + 1)
            }
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersWishlistData?.current_page ===
                othersWishlistData?.last_page
                  ? '#ccc'
                  : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation:
                othersWishlistData?.current_page ===
                othersWishlistData?.last_page
                  ? 0
                  : 2,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text style={{ fontFamily: 'Roboto-Black', fontSize: wp(2.2) }}>
              Next
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              othersWishlistData?.current_page === othersWishlistData?.last_page
            }
            onPress={() => handleJumpToPage(othersWishlistData?.last_page)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersWishlistData?.current_page ===
                othersWishlistData?.last_page
                  ? '#ccc'
                  : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation:
                othersWishlistData?.current_page ===
                othersWishlistData?.last_page
                  ? 0
                  : 2,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Text style={{ fontFamily: 'Roboto-Black', fontSize: wp(2.2) }}>
              Last
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );

  const handleReorder = async item => {
    console.log('ite of order', item);

    const params = {
      product_id: item.product_id,
      quantity: item.quantity,
      type: 'reorder',
    };

    console.log('PARAMS of add cart 989898', params);

    const response = await makeRequest(
      `${BASE_URL}add_product_in_cart`,
      params,
      true,
    );
    console.log('response of add cart 989898', response);
    if (response) {
      showSnack(response.Message);
      dispatch(modifyCartDetail(response?.Data?.cart_detail));
      dispatch(fetchWishlistRequest());
    }
  };

  const renderWishlist = ({ item, index }) => {
    console.log('item?.product_image', item);

    if (item.re_stock == 0) {
      console.log('item.re_stock == 0');
    }

    return (
      <View style={styles.productContainer} key={index}>
        {!isLoading && (
          <>
            <Text style={[styles.productName, styles.dateText]}>
              {item?.created_at}
            </Text>

            <Pressable
              onPress={() => {
                Alert.alert('Are you sure', 'You want to delete this item', [
                  {
                    text: 'No',
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      let formData = new FormData();
                      formData.append('id', item?.id);
                      WishlistDeleteData(wishlistDeleteView, formData);
                    },
                  },
                ]);
                console.log('get on press delete ', item);
              }}
              style={styles.delete}
            >
              <AppIcon
                type="antdesign"
                name="delete"
                color="#e06223"
                size={wp(5)}
              />
            </Pressable>
          </>
        )}
        <View style={styles.productSubContainer}>
          <View style={styles.productImageContainer}>
            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={wp(18)}
                height={hp(18)}
                borderRadius={wp(1)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <FastImage
                source={{
                  uri: item?.product_image[0],
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                defaultSource={ic_prod_placholder}
                style={[styles.productImage]}
                resizeMode={FastImage.resizeMode.stretch}
              />
            )}

            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={hp(18)}
                height={hp(18)}
                borderRadius={wp(1)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <Text style={styles.productAdd}>₹ {item?.p_price}</Text>
            )}
          </View>

          <View style={styles.productRightContainer}>
            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={wp(22)}
                height={hp(2)}
                borderRadius={wp(1)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <Text style={styles.productName}>{item?.product_name}</Text>
            )}

            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={wp(26)}
                height={hp(2.2)}
                borderRadius={wp(1)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <Text style={styles.remainingText}>
                REMAINING: {item?.quantity}
              </Text>
            )}

            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={wp(25)}
                height={hp(2)}
                borderRadius={wp(1)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <Text style={[styles.remainingText, { color: '#999' }]}>
                Total Amount: ₹ {item?.total} /-
              </Text>
            )}

            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={wp(40)}
                height={hp(3)}
                borderRadius={wp(1)}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <View>
                {item.re_stock == 0 ? (
                  <TouchableOpacity
                    // onPress={() => alert('Coming soon')}
                    style={styles.reorderButton}
                  >
                    <Text style={styles.reorderButtonText}>
                      REORDER REMAINING
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      handleReorder(item);
                    }}
                    style={[styles.reorderButton, { backgroundColor: 'green' }]}
                  >
                    <Text
                      style={{
                        fontFamily: 'Roboto-Bold',
                        fontSize: wp(3.5),
                        color: '#fff',
                        textAlign: 'center',
                      }}
                    >
                      REORDER
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    dispatch(fetchWishlistRequest());
  };

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff" gh="29%">
      <View style={[styles.container, { paddingTop: inset.top }]}>
        <Header
          title="Wishlist"
          navigation={navigation}
          goBack="HomeScreen"
          cart_detail={cart_detail}
          fromWishlist={true}
        />

        <View style={styles.search_filter}>
          <View style={styles.searchInputContainer}>
            <Image source={ic_search} style={styles.searchIcon} />
            <TextInput
              placeholder="Search Item"
              placeholderTextColor="#999"
              style={[styles.searchBox, { paddingLeft: 5 }]}
              selectTextOnFocus
              value={searchText}
              onChangeText={text => {
                handleSearch(text);
                if (text === '') {
                  // If search text is cleared, call your API
                  dispatch(fetchWishlistRequest());
                }
              }}
            />
            {searchText && (
              <TouchableOpacity
                style={{ marginRight: 5 }}
                onPress={() => {
                  clearSearch();
                  dispatch(fetchWishlistRequest());
                }}
              >
                <AppIcon
                  activeOpacity={1}
                  type="entypo"
                  name="circle-with-cross"
                  color="#999"
                  size={wp(5)}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.dropDownContainer]}
            onPress={handleEnableCategoryDropdown}
          >
            <Text numberOfLines={1} style={[styles.dropDownText, { flex: 1 }]}>
              {categoryList.filter(item => item.id === category)[0]?.title}
            </Text>

            <AppIcon
              type="ionicon"
              name="caret-down-outline"
              color="#000"
              size={wp(5)}
              iconStyle={{ zIndex: 999, left: wp(0.9) }}
            />

            <Modal
              style={[
                {
                  // backgroundColor: '#fff',
                  paddingTop: inset.top,
                  paddingBottom: inset.bottom,
                },
              ]}
              useNativeDriver={true}
              isVisible={check1}
              onBackButtonPress={() => {
                setCheck1(false);
              }}
              onBackdropPress={() => {
                setCheck1(false);
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCheck1(false)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 9999,
                  }}
                >
                  <AppIcon
                    reverse
                    type="font-awesome"
                    name="remove"
                    size={wp(2)}
                    color="red"
                    iconStyle={{ fontSize: wp(4) }}
                  />
                </TouchableOpacity>

                <View style={styles.dropdownList}>
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor={'#838383'}
                    // value={searchText?.toString()}
                    onChangeText={handleSearchCategory}
                    style={styles.dropdownSearchBox}
                  />
                  <FlatList
                    data={itemsCategory}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownListItem}
                          onPress={() => handleCategory(item)}
                        >
                          <Text style={{ textTransform: 'capitalize' }}>
                            {item.title}
                          </Text>
                          {item.id !== 0 && (
                            <FastImage
                              style={styles.dropDownImage}
                              source={{
                                uri: item.image,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                              }}
                              defaultSource={ic_prod_placholder}
                              resizeMode={FastImage.resizeMode.stretch}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={(item, index) => item?.id || index}
                  />
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>

        <View style={styles.homeContainer}>
          <FlatList
            ref={flatlistRef}
            keyExtractor={(item, index) => item?.id || index}
            // data={filteredWishlistData}
            data={allWishlistData}
            renderItem={renderWishlist}
            // ListFooterComponent={listFooterComponent}
            ListEmptyComponent={() =>
              !isLoading && (
                <Text style={{ textAlign: 'center' }}>No Data found</Text>
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                colors={colors}
              />
            }
            contentContainerStyle={{
              paddingBottom: hp(9),
              paddingTop: hp(1),
              paddingHorizontal: wp(3),
            }}
          />
        </View>
      </View>
    </Gradient>
  );
};

export default memo(WishList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    paddingTop: hp(1),
  },
  search_filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
    marginHorizontal: wp(3),
  },
  searchInputContainer: {
    borderWidth: 0.3,
    width: wp(45),
    height: hp(4),
    borderRadius: hp(3),
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  searchIcon: {
    // marginHorizontal: wp(2),
    marginLeft: wp(1.5),
    height: 20,
    width: 20,
  },
  searchBox: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'Roboto-Regular',
    color: '#000',
    paddingLeft: Platform.OS === 'android' ? 0 : wp(2),
    // borderWidth: 1,
  },
  dropDownContainer: {
    borderWidth: 0.3,
    width: wp(45),
    height: hp(4),
    borderRadius: hp(3),
    backgroundColor: '#fff',
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  dropdownList: {
    alignItems: 'center',
    flex: 1,
    // marginBottom: hp(3),
    marginHorizontal: wp(3),
    marginVertical: hp(2),
  },
  dropdownListItem: {
    height: hp(6),
    width: wp(80),
    marginVertical: hp(0.6),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
  },
  dropDownImage: {
    height: '90%',
    aspectRatio: 1 / 1,
    marginRight: wp(-1.3),
  },
  dropdownSearchBox: {
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#c1c1c1',
    width: wp(80),
    color: '#000',
    paddingVertical: 0,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  dropDownText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3),
    color: '#000',
    textTransform: 'capitalize',
  },
  dropDownBox: {
    flex: 1,
  },
  productContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    marginBottom: hp(2),
    borderRadius: wp(1),
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  productSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.2),
  },
  dateText: {
    color: '#aaa',
    alignSelf: 'center',
    position: 'absolute',
    top: 3,
    fontFamily: 'Roboto-Bold',
  },
  productAdd: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(2.9),
    color: '#999',
  },
  delete: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 5,
    top: 3,
  },
  remainingText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.2),
  },
  productImageContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    height: hp(17),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
    marginTop: hp(2),
  },
  productRightContainer: {
    justifyContent: 'space-between',
    marginTop: hp(3),
    marginRight: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: hp(2),
    justifyContent: 'space-between',
  },
  reorderButton: {
    borderWidth: 1,
    borderColor: '#999',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.2),
    marginVertical: hp(1),
  },
  reorderButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: '#999',
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#F55C0D',
    paddingHorizontal: wp(7),
    paddingVertical: hp(0.2),
  },
  removeButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: '#F55C0D',
  },
});
