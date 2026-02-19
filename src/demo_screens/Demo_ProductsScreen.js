/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useMemo,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
  PermissionsAndroid,
  TextInput,
  ImageBackground,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//component
import Gradient from '../components/Gradient';

import {async_keys, clearData, getData} from '../api/UserPreference';
import {showSnack} from '../components/Snackbar';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import PullToRefreshWrapper from '../components/PullToRefreshWrapper';

//image
import ic_search from '../assets/image/loupe.png';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {downloadImage} from '../components/DownloadImage';
import {
  applyFilterSort,
  fetchProductRequest,
  filterProduct,
  loadMoreProduct,
  modifyFilterProduct,
  modifyProduct,
} from '../redux/action/productActions';
import {fetchCategoryRequest} from '../redux/action/categoryActions';
import moment from 'moment';
import FastImage from '@d11/react-native-fast-image';
// import RNFetchBlob from 'rn-fetch-blob';

import ic_prod_placholder from '../assets/icons/diamond.png';
import {fetchProfileDataRequest} from '../redux/action/profileActions';
import {PERMISSIONS, request} from 'react-native-permissions';
import {brown100} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {modifyCartDetail} from '../redux/action/homeActions';
import {Button} from 'react-native-paper';
import {goForLogin} from '../components/globalFunctions';
import {fetchDemoDataRequest} from '../redux/action/demoActions';
import {
  applyFilterSort_demo,
  loadMoreDemoProduct,
  modifyDemoProduct,
  modifyFilterDemoProduct,
} from '../redux/action/demoProductActions';
import AppIcon from '../components/AppIcon';
import AppBadge from '../components/AppBadge';
import ShimmerLoader from '../components/ShimmerLoader';

const sortingData = [
  {id: 1, name: 'Lowest Price'},
  {id: 2, name: 'Highest Price'},
  {id: 3, name: 'Oldest'},
  {id: 4, name: 'Newest'},
];

const Demo_AllProductsScreen = props => {
  const {navigation, route} = props;
  const [check1, setCheck1] = useState(false);
  const [invisible, setInvisible] = useState(0);
  const [modalItem, setModalItem] = useState({});
  const [searchText, setSearchText] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [modalForAdd, setModalForAdd] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [itemsCategory, setItemsCategory] = useState(categoryList);
  const [CurrentIndex, setCurrentIndex] = useState(4);

  const inset = useSafeAreaInsets();

  // console.log('props', props);

  const productListRef = useRef(null);
  const dispatch = useDispatch();

  const {
    isLoading,
    loader,
    filteredProductsData,
    allProductsData,
    currentPage,
    sortBy,
    filterBy,
    visibleAllLength,
  } = useSelector(state => state.demoProduct);
  const {cart_detail, profile, categories} = useSelector(
    state => state.demoHome.demoHomeData,
  );

  const {mainRoute} = useSelector(state => state.route);

  //FOR FETCHING INITIAL DATA
  useEffect(() => {
    if (props.isFocused) {
      if (allProductsData.length < 1) {
        dispatch(fetchDemoDataRequest());
      }
    }
    if (mainRoute !== 1) {
      scrollToTop();
    }
  }, [props.isFocused]);

  useEffect(() => {
    dispatch(fetchDemoDataRequest());
  }, [dispatch]);

  const scrollToTop = () => {
    if (productListRef.current && filteredProductsData.length !== 0) {
      productListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  useEffect(() => {
    // console.log('[categories]');
    setCategoryList([{id: 0, title: 'All'}, ...categories]);
    setItemsCategory([{id: 0, title: 'All'}, ...categories]);
  }, [categories]);

  const handleSorting = item => {
    // console.log('handleSorting()');
    dispatch(applyFilterSort_demo({sortBy: item.id, filterBy}));
  };

  const handleSearch = text => {
    if (text) {
      let filteredData = allProductsData.filter(
        item => item?.name?.toUpperCase().indexOf(text?.toUpperCase()) > -1,
      );
      dispatch(modifyDemoProduct(filteredData));
      if (productListRef.current && filteredProductsData.length !== 0) {
        productListRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    } else {
      dispatch(modifyDemoProduct(allProductsData));
    }
    setSearchText(text);
  };

  const handleSubmit = () => {
    let filteredData = allProductsData.filter(
      item => item?.name?.toUpperCase() === searchText?.toUpperCase(),
    );
    dispatch(modifyDemoProduct(filteredData));
  };

  const clearSearch = () => {
    setSearchText('');
    dispatch(modifyDemoProduct(allProductsData));
  };

  //Search
  const handleSearchCategory = text => {
    // console.log('handleSearchCategory()');
    const filteredData = categoryList.filter(
      item => item?.title?.toUpperCase().indexOf(text.toUpperCase()) > -1,
    );

    setItemsCategory(filteredData);
  };

  //Dropdown List
  const handleEnableCategoryDropdown = () => {
    // console.log('handleEnableCategoryDropdown()');
    setCheck1(true);
    setItemsCategory(categoryList);
  };

  //Choose Category
  const handleCategory = async item => {
    scrollToTop();
    // console.log('handleCategory()');
    dispatch(applyFilterSort_demo({filterBy: item.id, sortBy}));

    setCheck1(false);
  };

  const fetchCartDetails = async () => {
    // console.log('fetchCartDetails()');
    try {
      const cartResponse = await makeRequest(
        `${BASE_URL}cart_items`,
        null,
        true,
      );

      if (cartResponse) {
        const {Status, Message, Data} = cartResponse;

        //

        if (Status === true) {
          setCartItems({
            total: Data?.detail?.total || 0,
            items: Data?.item?.length,
          });
        }
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  // Opening Modal of Quantity
  const handleAdd = useCallback(() => goForLogin(navigation), [dispatch]);

  // Increasing Quantity
  const handleIncreaseQuantity = useCallback(() => {
    // console.log('handleIncreaseQuantity');
    let initialQuantity;

    allProductsData.map(item => {
      if (item.id === modalItem.id) {
        initialQuantity = item.packing_quantity;
      }
    });

    const temp = filteredProductsData.map(dd => {
      if (dd.id === modalItem.id) {
        setModalItem({
          ...dd,
          quantity_adding:
            (dd.quantity_adding || dd.packing_quantity || 1) +
            (initialQuantity || 1),
        });
        return {
          ...dd,
          quantity_adding:
            (dd.quantity_adding || dd.packing_quantity || 1) +
            (initialQuantity || 1),
        };
      }
      return dd;
    });

    console.log(temp);

    dispatch(modifyFilterDemoProduct(temp));
  }, [modalItem, allProductsData]);

  // Decreasing Quantity
  const handleDecreaseQuantity = useCallback(() => {
    // console.log('handleDecreaseQuantity');
    let initialQuantity;

    allProductsData.map(item => {
      if (item.id === modalItem.id) {
        initialQuantity = item.packing_quantity;
      }
    });

    let currentQuantity;

    filteredProductsData.map(item => {
      if (item.id === modalItem.id) {
        currentQuantity = item.quantity_adding;
      }
    });
    if (initialQuantity === currentQuantity) {
      return true;
    }

    let data = filteredProductsData;
    const temp = data.map(dd => {
      if (dd.id === modalItem.id) {
        setModalItem({
          ...dd,
          quantity_adding:
            (dd.quantity_adding || dd.packing_quantity || 1) -
            (initialQuantity || 1),
        });
        return {
          ...dd,
          quantity_adding:
            (dd.quantity_adding || dd.packing_quantity || 1) -
            (initialQuantity || 1),
        };
      }
      return dd;
    });

    dispatch(modifyFilterDemoProduct(temp));
  }, [modalItem, allProductsData]);

  //ADDING TO CART
  const handleAddToCart = useCallback(
    item => {
      setModalForAdd(false);
      setIsLoadingMore(true);
      setTimeout(() => {
        callingApi(item);
      }, 1000);
    },
    [filteredProductsData, cart_detail],
  );

  const callingApi = useCallback(
    async item => {
      // console.log('handleAddToCart()');
      try {
        const product_id = item.id;
        const quantity = item.quantity_adding || item.packing_quantity || 1;
        const order_limit = item.order_limit || 1;

        if (order_limit > quantity) {
          showSnack(
            `Minimum order quantity should be more than or equal to ${order_limit.toString()}!`,
            null,
            true,
          );
          setIsLoadingMore(false);
          return true;
        }

        const params = {
          product_id,
          quantity,
        };

        const response = await makeRequest(
          `${BASE_URL}add_product_in_cart`,
          params,
          true,
        );

        if (response) {
          const {Status, Message, Data} = response;

          if (Status === true) {
            const {Data} = response;
            showSnack(Message);
            const temp = filteredProductsData.map(prod => {
              if (prod.id === item.id) {
                return {...prod, cart_count: Number(prod.cart_count) + 1};
              }
              return prod;
            });
            dispatch(modifyFilterDemoProduct(temp));

            dispatch(modifyCartDetail(Data?.cart_detail));

            setModalForAdd(false);
          } else {
            showSnack(Message, null, true);
          }
          setIsLoadingMore(false);
        }
      } catch (error) {
        setIsLoadingMore(false);
        showSnack(
          'Oops something went wrong. Please try again later',
          null,
          true,
        );
        //  console.log(error);
      }
    },
    [filteredProductsData, cart_detail],
  );

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    // console.log('handleRefresh()');
    // dispatch(fetchProductRequest());
    // dispatch(fetchCategoryRequest());
    dispatch(fetchDemoDataRequest());
  };

  const hidingAddToCart = useMemo(() => {
    return {addingModal: modalForAdd, addToCartButton: invisible};
  }, [modalForAdd, invisible]);

  const handleDownload = useCallback(async item => {
    try {
      const backendImageUrl = item?.original_images[0];
      // const backendImageUrl = item?.images[0];
      console.log('backendImageUrl print', backendImageUrl);
      downloadImage(backendImageUrl, item.name, setDownloadLoader);
    } catch (error) {
      console.log('error of download image', error);
    }
  }, []);

  const renderDdItem = item => {
    // console.log('renderDdItem');
    return (
      <Text
        key={item.id}
        style={{paddingHorizontal: 10, paddingVertical: 8, fontSize: wp(3.3)}}>
        {item.name}
      </Text>
    );
  };

  const onProductItemPressed = useCallback(id => {
    // console.log('onProductItemPressed()');
    navigation.navigate('Demo_ProductDetails', {id});
  }, []);

  const handleLoadMore = useCallback(() => {
    if (
      filteredProductsData.length < visibleAllLength &&
      filteredProductsData.length > 39 &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      dispatch(loadMoreDemoProduct({page: currentPage + 1, setIsLoadingMore}));
    }
  }, [filteredProductsData, isLoadingMore]);

  // console.log('filteredProductsData', filteredProductsData);

  //PRODUCT LIST
  const RenderProduct = useMemo(
    () =>
      memo(({item, index}) => {
        console.log('render product');

        return isLoading ? (
         <ShimmerLoader
  key={item?.id}
  loading={true} // or isLoading
  width={wp(42.5)}
  height={hp(26.3)}
  borderRadius={hp(3.5)}
  style={{
    marginBottom: hp(3),
    marginHorizontal: wp(2),
  }}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

        ) : (
          <TouchableOpacity
            disabled={loader || isLoadingMore || downloadLoader}
            activeOpacity={0.9}
            key={item?.id}
            style={[
              styles.productItemContainer,
              index % 2 === 0 ? {marginRight: '1%'} : {marginLeft: '1%'},
            ]}
            onPress={() => onProductItemPressed(item.id)}>
            {item?.images?.length !== 0 && Array.isArray(item?.images) ? (
              <>
                <FastImage
                  source={{
                    uri: item?.images[0],
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  defaultSource={ic_prod_placholder}
                  style={[styles.productImage]}
                  resizeMode={FastImage.resizeMode.stretch}
                />

                <View
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{
                      // margin: hp(1.1),
                      backgroundColor: '#fff',
                      fontSize: wp(2.3),
                      fontFamily: 'Roboto-Black',
                      paddingHorizontal: 2,
                      borderRadius: 2,
                      color:
                      (
                        // Case 1: Main product is limited and has no stock
                        (item?.is_limited == "1" && (!item?.stock || Number(item?.stock) <= 0)) ||
                    
                        // Case 2: Product has variants, and ALL limited variants have stock 0
                        (
                          Array.isArray(item?.product_variant) &&
                          item?.product_variant.length > 0 &&
                          item?.product_variant.every(variant =>
                            variant?.is_limited == "1" && Number(variant?.stock) <= 0
                          )
                        )
                      )
                          ? 'red'
                          : '#000080',
                    }}>
                    {         (
                        // Case 1: Main product is limited and has no stock
                        (item?.is_limited == "1" && (!item?.stock || Number(item?.stock) <= 0)) ||
                    
                        // Case 2: Product has variants, and ALL limited variants have stock 0
                        (
                          Array.isArray(item?.product_variant) &&
                          item?.product_variant.length > 0 &&
                          item?.product_variant.every(variant =>
                            variant?.is_limited == "1" && Number(variant?.stock) <= 0
                          )
                        )
                      )
                      ? 'Out of stock'
                      : 'In stock'}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.productImage,
                    {
                      backgroundColor: '#ddd',
                    },
                  ]}>
                  <Image
                    source={ic_prod_placholder}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                  />
                </View>

                <View
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{
                      margin: hp(1.1),
                      backgroundColor: '#fff',
                      fontSize: wp(2.3),
                      fontFamily: 'Roboto-Black',
                      paddingHorizontal: 2,
                      borderRadius: 2,
                      color:
                      (
                        // Case 1: Main product is limited and has no stock
                        (item?.is_limited == "1" && (!item?.stock || Number(item?.stock) <= 0)) ||
                    
                        // Case 2: Product has variants, and ALL limited variants have stock 0
                        (
                          Array.isArray(item?.product_variant) &&
                          item?.product_variant.length > 0 &&
                          item?.product_variant.every(variant =>
                            variant?.is_limited == "1" && Number(variant?.stock) <= 0
                          )
                        )
                      )
                          ? 'red'
                          : '#000080',
                    }}>
                    {         (
                        // Case 1: Main product is limited and has no stock
                        (item?.is_limited == "1" && (!item?.stock || Number(item?.stock) <= 0)) ||
                    
                        // Case 2: Product has variants, and ALL limited variants have stock 0
                        (
                          Array.isArray(item?.product_variant) &&
                          item?.product_variant.length > 0 &&
                          item?.product_variant.every(variant =>
                            variant?.is_limited == "1" && Number(variant?.stock) <= 0
                          )
                        )
                      )
                      ? 'Out of stock'
                      : 'In stock'}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.productDetailsContainer}>
              <AppIcon
                disabled={isLoading}
                reverse
                type="feather"
                name="download"
                size={wp(3.5)}
                color="#000080"
                iconStyle={styles.iconStyle}
                containerStyle={styles.downloadContainerStyle}
                onPress={() => handleDownload(item)}
              />

              <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: wp(1.5),
                  // borderWidth: 2,
                  paddingVertical: hp(0.8),
                  paddingTop: hp(1.8),
                  flex: 1,
                }}>
                <View
                  style={{
                    // borderWidth: 1,
                    justifyContent: 'space-between',
                    flex: 1,
                    marginRight: wp(1),
                  }}>
                  <Text numberOfLines={1} style={styles.productNameText}>
                    {item?.name}
                  </Text>
                  <Text style={styles.boxQuantityText}>
                    1 BOX = {item?.packing_quantity || 1}
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 0,
                    justifyContent: 'flex-end',
                    // flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  {item?.mrp <= (item?.sp || 0) ? (
                    <Text style={styles.productPriceText}>
                      ₹ {item?.sp || 0}
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // marginRight: -10,
                      }}>
                      <Text
                        style={[styles.productMrpText, {marginRight: wp(1)}]}>
                        ₹ {item?.mrp}
                      </Text>
                      <Text style={styles.productPriceText}>
                        {item?.sp || 0}
                      </Text>
                    </View>
                  )}

                  {/* ADD TO CART BUTTON */}
                  {/* {item.cart_count > 0 ? ( */}
                  <>
                    {/* <Icon
                      reverse
                      type="ant-design"
                      name="check"
                      size={wp(3.5)}
                      color="#000080"
                      iconStyle={styles.iconStyle}
                      containerStyle={styles.addContainerStyle}
                      onPress={() => {}}
                    /> */}
                    <TouchableOpacity
                      disabled={isLoading || item.cart_count > 0}
                      onPress={() => handleAdd(item)}
                      style={[
                        styles.addContainerStyle,
                        {
                          backgroundColor:
                            !item.cart_count > 0 ? '#4ab073' : '#000080',
                          paddingHorizontal: wp(2),
                          borderRadius: 2,
                          top: 3,
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                      ]}>
                      {!item.cart_count > 0 && (
                        <AppIcon
                          type="entypo"
                          name="plus"
                          size={wp(4)}
                          color="#fff"
                          containerStyle={{margin: 0}}
                        />
                      )}

                      <Text
                        style={{
                          fontSize: wp(3),
                          color: '#fff',
                          fontFamily: 'Roboto-Black',
                        }}>
                        {item.cart_count > 0
                          ? 'Added'
                          : item?.is_limited == 1 && !Number(item?.stock) > 0
                          ? 'Wishlist'
                          : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </>
                  {/* ) : ( */}
                  <>
                    {/* // : item?.is_limited == 1 && !Number(item?.stock) > 0 ?  */}
                    {/* <Icon
                    reverse
                    type="ant-design"
                    name="plus"
                    size={wp(3.5)}
                    color="#C04547"
                    iconStyle={styles.iconStyle}
                    containerStyle={styles.addContainerStyle}
                    onPress={() => handleAdd(item)}
                  /> */}
                    {/* <TouchableOpacity
                        onPress={() => handleAdd(item)}
                        style={[
                          styles.addContainerStyle,
                          {
                            backgroundColor: '#4ab073',
                            paddingHorizontal: wp(2),
                            borderRadius: 2,
                            width: wp(12),
                            top: 3,
                          },
                        ]}>
                        <Text
                          style={{
                            fontSize: wp(3),
                            // paddingBottom: hp(0.4),
                            color: '#fff',
                            fontFamily: 'Roboto-Black',
                            position: 'absolute',
                          }}>
                          <Text style={{fontSize: wp(4)}}>+</Text>
                          Add
                        </Text>
                      </TouchableOpacity> */}
                  </>
                  {/* )} */}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }),
    [allProductsData],
  );

  // console.log('wp', cartItems.total.toString().length);

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <View style={[styles.container, {paddingTop: inset.top}]}>
        {/* {isLoading && (
          <View
            style={{
              position: 'absolute',
              height: hp(100),
              width: wp(100),
              backgroundColor: 'rgba(0,0,0,.5)',
              zIndex: 999,
            }}
          />
        )} */}
        <View style={[styles.header]}>
          <TouchableOpacity
            style={{
              borderRadius: 20,
              elevation: 3,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {width: -1, height: -1},
            }}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Demo_HomeScreen')}>
            {/* <Icon
              raised
              type="material-icons"
              name="arrow-back-ios"
              size={wp(4)}
              iconStyle={styles.backButton}
              containerStyle={{margin: 0}}
            /> */}
            <AppIcon
              raised
              type="fa"
              name="arrow-left"
              size={wp(4)}
              containerStyle={{margin: 0}}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Demo Store</Text>

          <TouchableOpacity onPress={() => goForLogin(navigation)}>
            <AppIcon type="fa" name="shopping-cart" size={wp(8.5)} />
            <AppBadge
              value={cart_detail?.cart_count || 0}
              status="error"
              containerStyle={styles.badgeContainer}
            />
            <AppBadge
              value={`₹ ${cart_detail?.cart_amount || 0}`}
              status=""
              containerStyle={[
                styles.badgeContainer1,
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

        <Modal
          isVisible={modalForAdd}
          // isVisible
          useNativeDriver={true}
          onBackButtonPress={() => setModalForAdd(false)}
          onBackdropPress={() => setModalForAdd(false)}>
          <View
            style={{
              marginHorizontal: wp(3),
              backgroundColor: '#fff',
              padding: hp(3),
              borderRadius: wp(1),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setModalForAdd(false)}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                padding: wp(1),
              }}>
              <AppIcon
                reverse
                type="fa"
                name="remove"
                size={wp(2)}
                color="red"
                iconStyle={{fontSize: wp(4)}}
                containerStyle={{margin: 0}}
              />
            </TouchableOpacity>
            <View
              style={{
                width: wp(60),
                height: hp(4),
                backgroundColor: '#555',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 3,
                paddingHorizontal: wp(5),
              }}>
              <TouchableOpacity
                style={{padding: wp(2)}}
                onPress={handleDecreaseQuantity}>
                <AppIcon
                  type="fa"
                  name="minus"
                  color="#fff"
                  size={wp(4)}
                />
              </TouchableOpacity>

              <Text style={{color: '#fff'}}>
                {modalItem.quantity_adding || modalItem.packing_quantity || 1}
              </Text>

              <TouchableOpacity
                style={{padding: wp(2)}}
                onPress={handleIncreaseQuantity}>
                <AppIcon
                  type="fa"
                  name="plus"
                  color="#fff"
                  size={wp(4)}
                />
              </TouchableOpacity>
              {modalItem.is_limited == 1 && modalItem.stock == 0 && (
                <View
                  style={{
                    backgroundColor: 'red',
                    paddingHorizontal: wp(1),
                    paddingVertical: wp(0.5),
                    position: 'absolute',
                    bottom: -15,
                    right: 0,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: wp(2),
                      fontFamily: 'Roboto-Bold',
                    }}>
                    (Note: Item will be added to wishlist)
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleAddToCart(modalItem)}
              style={{
                width: wp(60),
                height: hp(4),
                backgroundColor: '#000080',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                marginTop: hp(3),
              }}>
              <Text style={{color: '#fff'}}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.category_filter}>
          <View
            style={[
              styles.searchContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 2,
              },
            ]}>
            <Image source={ic_search} style={styles.searchIcon} />
            <TextInput
              testID="searchInput"
              placeholder="Search"
              placeholderTextColor="#999"
              style={styles.searchBox}
              selectTextOnFocus
              numberOfLines={1}
              value={searchText}
              returnKeyLabel="search"
              returnKeyType="search"
              enablesReturnKeyAutomatically
              onChangeText={handleSearch}
              onSubmitEditing={handleSubmit}
            />
            {searchText && (
              <TouchableOpacity style={{marginRight: 1}} onPress={clearSearch}>
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
            style={[styles.searchContainer, {flex: 1, paddingHorizontal: 8}]}
            onPress={handleEnableCategoryDropdown}>
            <Text numberOfLines={1} style={[styles.dropDownText, {flex: 1}]}>
              {categoryList.filter(item => item.id === filterBy)[0]?.title}
            </Text>

            <AppIcon
              type="ionicon"
              name="caret-down-outline"
              color="#000"
              size={wp(5)}
              iconStyle={{zIndex: 999, left: wp(0.9)}}
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
              }}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCheck1(false)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 9999,
                  }}>
                  <AppIcon
                    reverse
                    type="fa"
                    name="remove"
                    size={wp(2)}
                    color="red"
                    iconStyle={{fontSize: wp(4)}}
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
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownListItem}
                          onPress={() => handleCategory(item)}>
                          <Text style={{textTransform: 'capitalize'}}>
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

          <View
            style={[
              styles.searchContainer,
              {
                marginRight: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              },
            ]}>
            <Dropdown
              style={{flex: 1, paddingHorizontal: 8}}
              placeholderStyle={styles.dropDownText}
              selectedTextStyle={styles.dropDownText}
              data={sortingData}
              maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder="Sort by"
              value={sortBy}
              onChange={handleSorting}
              renderRightIcon={() => (
                <AppIcon
                  type="ionicon"
                  name="caret-down-outline"
                  color="#000"
                  size={wp(5)}
                  iconStyle={{zIndex: 999, left: wp(0.9)}}
                />
              )}
              renderItem={renderDdItem}
            />
          </View>
        </View>

        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
          <View style={styles.homeContainer}>
            {/* {(!loader || isLoadingMore || downloadLoader) && (
            <View
              style={{
                flex: 1,
                height: hp(100),
                width: wp(100),
                position: 'absolute',
                zIndex: 99,
                backgroundColor: 'rgba(255,255,255, .5)',
                // backgroundColor: 'red',
              }}
            />
          )} */}
            {isLoading ? (
             <ShimmerLoader
  loading={true} // or isLoading
  width={wp(50)}
  height={hp(2)}
  borderRadius={3}
  style={{
    marginTop: hp(1),
    alignSelf: 'center',
  }}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

            ) : (
              <Text style={styles.totalProductCountText}>
                Exploring {CurrentIndex} of total {filteredProductsData.length}{' '}
                products
              </Text>
            )}

            <FlatList
              ref={productListRef}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              numColumns={2}
              // initialNumToRender={6}
              // maxToRenderPerBatch={6}
              // windowSize={8}
              // removeClippedSubviews={true}
              data={filteredProductsData}
              //ITEM LIST
              renderItem={({item, index}) => (
                <RenderProduct
                  key={item?.id?.toString()}
                  item={item}
                  index={index}
                />
              )}
              //WHEN PRODUCT DATA EMPTY
              ListEmptyComponent={() =>
                !isLoading && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>No products found</Text>
                  </View>
                )
              }
              //FOOTER
              ListFooterComponent={() =>
                filteredProductsData.length < visibleAllLength &&
                filteredProductsData.length > 39 &&
                !isLoadingMore && (
                  <Button
                    mode="text"
                    // buttonColor="#000080"
                    textColor="#000080"
                    labelStyle={{fontSize: wp(4), fontFamily: 'Roboto-Bold'}}
                    style={{
                      alignSelf: 'center',
                      borderRadius: wp(1),
                      marginTop: hp(2),
                    }}
                    icon={
                      isLoadingMore
                        ? () => (
                            <>
                              <ActivityIndicator size="small" color="#000080" />
                              <Text
                                style={{
                                  marginTop: 10,
                                  color: '#000',
                                  fontSize: 16,
                                  textAlign: 'center',
                                }}>
                                Please wait...
                              </Text>
                            </>
                          )
                        : 'arrow-down-thick'
                    }
                    onPress={handleLoadMore}>
                    {isLoadingMore ? 'Loading' : 'Load More'}
                  </Button>
                )
              }
              //ON SCROLL
              onViewableItemsChanged={
                useRef(({viewableItems}) => {
                  if (viewableItems.length > 0) {
                    setCurrentIndex(
                      viewableItems[viewableItems.length - 1]?.index + 1,
                    );
                  }
                }).current
              }
              //PULLING TO REFRESH
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={handleRefresh}
                  colors={colors}
                />
              }
              // onEndReachedThreshold={0.5}
              removeClippedSubviews
              //ON REACH TO END LOADING MORE
              onEndReached={() => {
                // handleLoadMore()
                setCurrentIndex(filteredProductsData.length);
              }}
              getItemLayout={(data, index) => ({
                length: hp(29.02), // Specify the height of your items
                offset: hp(29.02) * index,
                index,
              })}
              contentContainerStyle={{
                paddingBottom: hp(12),
                paddingHorizontal: wp(2),
              }}
            />
            {/* </View> */}
            {/* </ScrollView> */}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Gradient>
  );
};

export default memo(Demo_AllProductsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    height: hp(9),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(4),
    // borderWidth: 1,
  },
  backButton: {
    fontSize: wp(8),
    marginLeft: wp(2),
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: wp(5),
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
  category_filter: {
    flexDirection: 'row',
    marginHorizontal: wp(4),
    alignItems: 'center',
    marginVertical: hp(1),
  },
  searchContainer: {
    flexDirection: 'row',
    width: '32%',
    height: hp(3.3),
    borderRadius: hp(2),
    marginRight: '2%',
    borderWidth: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    paddingVertical: 0,
    // marginLeft: 2,
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3),
    color: '#000',
  },
  searchIcon: {
    width: hp(2),
    height: hp(2),
    marginLeft: wp(1),
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
  // filterButton: {
  //   flexDirection: 'row',
  //   marginVertical: hp(1),
  //   marginLeft: wp(2),
  //   top: hp(0.5),
  //   width: 'auto',
  //   borderWidth: 1,
  // },
  // categoryButton: {
  //   width: wp(22),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // categoryButtonText: {
  //   textDecorationLine: 'underline',
  //   color: '#888',
  // },
  // modalContainer: {
  //   maxHeight: hp(70),
  //   marginTop: hp(16),
  //   borderRadius: wp(2.5),
  //   backgroundColor: '#f1f1f1',
  // },
  // modalHomeContainer: {
  //   flex: 1,
  // },
  // modalCategoryHeading: {
  //   textAlign: 'center',
  //   marginVertical: hp(2),
  //   fontWeight: '700',
  //   color: '#838383',
  // },
  // modalCategoryContainer: {
  //   flex: 1,
  // },
  // modalCategoryItem: {
  //   backgroundColor: '#F3F9FF',
  //   height: hp(8.64),
  //   width: wp(16.2),
  //   borderRadius: wp(1),
  //   alignItems: 'center',
  //   justifyContent: 'space-evenly',
  //   // marginRight: wp(6),
  //   // marginBottom: hp(3),
  //   margin: hp(1.3),
  //   marginBottom: 0,
  //   elevation: 5,
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   shadowOffset: {width: 0, height: 1},
  //   overflow: 'hidden',
  // },
  // modalCategoryName: {
  //   fontSize: wp(3),
  //   textAlign: 'center',
  //   marginBottom: hp(1.3),
  // },
  // modalAll: {
  //   fontSize: wp(5),
  //   fontWeight: '600',
  // },
  // modalCategoryImage: {
  //   width: '100%',
  //   height: '100%',
  // },
  // sortByHeading: {
  //   textAlign: 'center',
  //   marginVertical: hp(2),
  //   fontWeight: '700',
  //   color: '#838383',
  // },
  // sortByContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginHorizontal: wp(1.3),
  // },
  // sortByItem: {
  //   backgroundColor: '#fff',
  //   height: hp(5),
  //   width: wp(20),
  //   borderRadius: wp(2),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: hp(2),
  //   elevation: 5,
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   shadowOffset: {width: 0, height: 1},
  // },
  // sortByText: {
  //   fontSize: wp(3),
  //   fontWeight: '500',
  //   color: '#555',
  // },
  // lower: {
  //   backgroundColor: '#29B1F4',
  //   width: wp(40),
  //   height: hp(4.3),
  //   borderRadius: hp(3),
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   elevation: 5,
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   shadowOffset: {width: 0, height: 1},
  //   marginVertical: hp(5),
  // },
  // backIcon: {
  //   width: wp(8),
  //   height: hp(2.8),
  // },
  // upper: {
  //   backgroundColor: '#fff',
  //   width: wp(32),
  //   height: hp(4.3),
  //   borderRadius: hp(3),
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 5,
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   shadowOffset: {width: 0, height: 1},
  // },
  // buttonText: {
  //   fontWeight: 'bold',
  //   fontSize: wp(3.5),
  // },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: hp(4),
    borderTopRightRadius: hp(4),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: -2},
  },
  totalProductCountText: {
    color: '#997779',
    fontWeight: '700',
    marginTop: hp(1),
    textAlign: 'center',
  },
  productContainer: {
    // justifyContent: 'space-between',
    marginTop: hp(2),
    flex: 1,
    borderWidth: 1,
    // paddingHorizontal: wp(4),
    // borderWidth: 1,
  },
  productItemContainer: {
    // width: wp(42.5),
    width: '49%',
    height: hp(27.3),
    backgroundColor: '#E5E4E2',
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
    marginBottom: hp(0.1),
    // overflow: 'hidden',
    marginTop: hp(0.5),
  },
  productImage: {
    width: '100%',
    height: hp(27.3) - hp(6),
    borderTopLeftRadius: hp(1),
    borderTopRightRadius: hp(1),
  },
  productDetailsContainer: {
    width: '100%',
    height: hp(6),
    backgroundColor: '#F0FFF0',
    borderBottomRightRadius: hp(1),
    borderBottomLeftRadius: hp(1),
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    // alignItems: 'center',
    justifyContent: 'center',
  },
  productMrpText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(2.8),
    color: 'rgb(190, 0, 0)',
    textDecorationLine: 'line-through',
  },
  productPriceText: {
    fontFamily: 'Roboto-Black',
    fontSize: wp(3.5),
    color: '#000',
  },
  productNameText: {
    color: '#000080',
    fontSize: wp(2.8),
    fontFamily: 'Roboto-Bold',
    textTransform: 'uppercase',
  },
  boxQuantityText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(2.5),
    color: '#999',
    // marginHorizontal: wp(4),
  },

  addContainerStyle: {
    // position: 'absolute',
    // zIndex: 99,
    // top: -28,
    // right: 0,
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    margin: 0,
    height: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  downloadContainerStyle: {
    position: 'absolute',
    zIndex: 999,
    top: -28,
    left: -5,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
  },
  iconStyle: {
    fontSize: wp(5),
  },
});
