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
  FlatList,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//component
import Gradient from '../components/Gradient';

import { async_keys, clearData, getData } from '../api/UserPreference';
import { showSnack } from '../components/Snackbar';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import PullToRefreshWrapper from '../components/PullToRefreshWrapper';

//image
import ic_search from '../assets/image/loupe.png';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { downloadImage } from '../components/DownloadImage';
import {
  applyFilterSort,
  applyPage,
  applyResetFilterSort,
  fetchProductRequest,
  modifyFilterProduct,
} from '../redux/action/productActions';
import { fetchCategoryRequest } from '../redux/action/categoryActions';
import FastImage from '@d11/react-native-fast-image';
// import RNFetchBlob from 'rn-fetch-blob';

import ic_prod_placholder from '../assets/icons/diamond.png';
import {
  fetchHomeDataRequest,
  modifyCartDetail,
} from '../redux/action/homeActions';
import { Button } from 'react-native-paper';
import Variants from '../components/variants';
import { concat } from 'react-native-reanimated';
import ShimmerLoader from '../components/ShimmerLoader';
import AppIcon from '../components/AppIcon';
import AppBadge from '../components/AppBadge';
import { useIsFocused } from '@react-navigation/native';
import { goBack, navigate } from '../routes/NavigationService';

const sortingData = [
  { id: 1, name: 'Lowest Price', value: 'lowest_price' },
  { id: 2, name: 'Highest Price', value: 'highest_price' },
  { id: 3, name: 'Oldest', value: 'oldest' },
  { id: 4, name: 'Newest', value: 'newest' },
];

const AllProductsScreen = props => {
  const { navigation } = props;

  const [categoryList, setCategoryList] = useState([]);
  const [itemsCategory, setItemsCategory] = useState(categoryList);
  const [modalItem, setModalItem] = useState({});

  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const [CurrentIndex, setCurrentIndex] = useState(0);

  const [sortFilter, setSortFilter] = useState({
    sort: 'newest',
    filter: 0,
  });

  const [check1, setCheck1] = useState(false);
  const [modalForAdd, setModalForAdd] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filterFromHome, setFilterFromHome] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [paginationModalVisible, setPaginationModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [count, setCount] = useState([]);

  const inset = useSafeAreaInsets();

  const productListRef = useRef(null);
  const dispatch = useDispatch();

  const {
    allProductsData,
    filteredProductsData,
    othersProductData,
    filterBy,
    sortBy,
    page,
    isLoading,
    indexOfProduct,
    loader,
  } = useSelector(state => state.product);

  const { cart_detail, categories, profile } = useSelector(
    state => state.home.homeData,
  );

  const { mainRoute } = useSelector(state => state.route);

  //FOR FETCHING INITIAL DATA
  useEffect(() => {
    console.log('filteredProductsData data print here', filteredProductsData);
  }, [filteredProductsData]);

  useEffect(() => {
    // console.log('[categories]');
    setCategoryList([{ id: 0, title: 'All' }, ...categories]);
    setItemsCategory([{ id: 0, title: 'All' }, ...categories]);
  }, [categories]);

  useEffect(() => {
    // Check if all variants have `cart_count === 1`
    const allCartCountIsOne = modalItem?.variants?.every(
      item => item?.cart_count === 1,
    );
    setIsButtonDisabled(allCartCountIsOne); // Disable button if true
  }, [modalItem]);

  useEffect(() => {
    if (isFocused) {
      dispatch(
        fetchProductRequest(
          `page=${page}&sort_by=${sortBy}&category=${filterBy}`,
        ),
      );
    } else {
      setSearchText('');
    }
  }, [sortBy, filterBy, page, isFocused]);

  useEffect(() => {
    if (
      productListRef.current &&
      filteredProductsData.length !== 0 &&
      filteredProductsData.length > 4
    ) {
      productListRef.current.scrollToIndex({
        index: indexOfProduct / 2,
        animated: true,
      });
    }
    if (mainRoute !== 1) {
      scrollToTop();
    }
  }, [indexOfProduct, isFocused]);

  const handleQuantityChange = data => {
    setCount(prevProducts => {
      const productExists = prevProducts.find(
        product => product.id === data.id,
      );

      if (productExists) {
        // Update the quantity if the product exists
        return prevProducts.map(product =>
          product.id === data.id
            ? { ...product, quantity: data.quantity } // Update quantity
            : product,
        );
      } else {
        // Add new product if it doesn't exist
        return [...prevProducts, { id: data.id, quantity: data.quantity }];
      }
    });
  };

  const addToCart = async () => {
    const data = {
      products: count,
    };

    const token = await getData(async_keys.user_token);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + token);

    const raw = JSON.stringify(data);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log('requestOptions', requestOptions);
    // https://jewelrydukaan.com/api/
    fetch(`${BASE_URL}add_multiple_product_in_cart`, requestOptions)
      .then(response => {
        console.log('Response status:', response.status);

        // Assuming the API returns JSON. You can use .text() if it's plain text.
        return response.json(); // Convert response to JSON (or use response.text() if the response is plain text)
      })
      .then(result => {
        console.log('Result of variant add:', result);
        dispatch(modifyCartDetail(result?.Data?.cart_detail));
        dispatch(
          fetchProductRequest(
            `page=${page}&sort_by=${sortBy}&category=${filterBy}`,
          ),
        );
        // This is the processed response from the API
        // cart_count
        if (result.Status === true) {
          showSnack(result.Message);
          setModalForAdd(false);
          dispatch(fetchHomeDataRequest(navigation));
          console.log(result.Message); // Log the message from the response
          setCount([]);
        } else {
          console.error('Error:', result.Message); // Log the error message if any
        }
      })
      .catch(error => {
        console.error('Error in API request:', error); // Catch any errors from the fetch call
      });
  };

  const scrollToTop = () => {
    if (productListRef.current && filteredProductsData.length !== 0) {
      productListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  console.log('filteredProductsData', filteredProductsData);

  const handleSorting = item => {
    dispatch(applyPage(1));
    scrollToTop();
    dispatch(applyFilterSort({ sortBy: item?.value, filterBy }));
  };

  const handleSearch = text => {
    scrollToTop();
    dispatch(applyPage(1));
    dispatch(fetchProductRequest(`search=${text}`));
    setSearchText(text);
  };

  const handleSubmitSearch = () => {
    if (searchText) {
      scrollToTop();
      dispatch(applyPage(1));
      dispatch(fetchProductRequest(`product_name=${searchText}`));
    }
  };

  const clearSearch = () => {
    dispatch(applyPage(1));
    dispatch(
      fetchProductRequest(`page=1&sort_by=${sortBy}&category=${filterBy}`),
    );
    setSearchText('');
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
    clearSearch();
  };

  //Choose Category
  const handleCategory = async item => {
    scrollToTop();
    dispatch(applyPage(1));
    dispatch(applyFilterSort({ filterBy: item?.id, sortBy: sortBy }));

    setCheck1(false);
  };

  // Opening Modal of Quantity
  const handleAdd = useCallback(item => {
    setModalItem(item);
    setModalForAdd(true);
  }, []);

  // Increasing Quantity
  // const handleIncreaseQuantity = useCallback(() => {
  //   // console.log('handleIncreaseQuantity');
  //   let initialQuantity;

  //   allProductsData.map(item => {
  //     if (item.id === modalItem.id) {
  //       initialQuantity = item.packing_quantity;
  //     }
  //   });

  //   const temp = filteredProductsData.map(dd => {
  //     if (dd.id === modalItem.id) {
  //       setModalItem({
  //         ...dd,
  //         quantity_adding:
  //           (dd.quantity_adding || dd.packing_quantity || 1) +
  //           (initialQuantity || 1),
  //       });
  //       return {
  //         ...dd,
  //         quantity_adding:
  //           (dd.quantity_adding || dd.packing_quantity || 1) +
  //           (initialQuantity || 1),
  //       };
  //     }
  //     return dd;
  //   });

  //   console.log(temp);

  //   dispatch(modifyFilterProduct(temp));
  // }, [modalItem, allProductsData]);
  const handleIncreaseQuantity = useCallback(() => {
    let initialQuantity = 1;

    // Find the initial quantity (packing quantity) for the selected modal item
    allProductsData.forEach(item => {
      if (item.id === modalItem.id) {
        initialQuantity = item.packing_quantity || 1;
      }
    });

    const temp = filteredProductsData.map(dd => {
      if (dd.id === modalItem.id) {
        const currentQuantity = dd.quantity_adding || dd.packing_quantity || 1;
        const addedQuantity = initialQuantity || 1;

        // Order limit handling: If null, 0, or undefined, treat as Infinity
        const orderLimit = dd.order_limit > 0 ? dd.order_limit : Infinity;

        // Prevent exceeding the order limit
        if (currentQuantity + addedQuantity > orderLimit) {
          Alert.alert(`Maximum quantity of ${orderLimit} has been reached.`);
          return dd; // No change
        }

        // Calculate new quantity but ensure it does not exceed orderLimit
        const newQuantity = Math.min(
          currentQuantity + addedQuantity,
          orderLimit,
        );

        // Update modal item and product list
        setModalItem({ ...dd, quantity_adding: newQuantity });

        return { ...dd, quantity_adding: newQuantity };
      }
      return dd;
    });

    // Dispatch updated product list
    dispatch(modifyFilterProduct(temp));
  }, [modalItem, allProductsData, filteredProductsData]);

  // ✅ **Decreasing Quantity**
  const handleDecreaseQuantity = useCallback(() => {
    let initialQuantity = 1;

    // Get initial packing quantity
    allProductsData.forEach(item => {
      if (item.id === modalItem.id) {
        initialQuantity = item.packing_quantity || 1;
      }
    });

    let currentQuantity = 0;

    // Get current quantity
    filteredProductsData.forEach(item => {
      if (item.id === modalItem.id) {
        currentQuantity = item.quantity_adding || initialQuantity;
      }
    });

    // Prevent decreasing below packing quantity
    if (currentQuantity <= initialQuantity) {
      Alert.alert(
        `You cannot decrease below the packing quantity of ${initialQuantity}.`,
      );
      return;
    }

    const temp = filteredProductsData.map(dd => {
      if (dd.id === modalItem.id) {
        // Decrease by packing quantity but not below initial quantity
        const newQuantity = Math.max(
          currentQuantity - initialQuantity,
          initialQuantity,
        );

        // Update modal item and product list
        setModalItem({ ...dd, quantity_adding: newQuantity });

        return { ...dd, quantity_adding: newQuantity };
      }
      return dd;
    });

    // Dispatch updated product list
    dispatch(modifyFilterProduct(temp));
  }, [modalItem, allProductsData, filteredProductsData]);

  //ADDING TO CART
  const handleAddToCart = useCallback(
    item => {
      setModalForAdd(false);
      setIsLoadingMore(true);
      setTimeout(() => {
        callingApiForAdding(item);
      }, 1000);
    },
    [filteredProductsData, cart_detail],
  );

  const callingApiForAdding = useCallback(
    async item => {
      console.log('order_limit item print ', item);

      // console.log('handleAddToCart()');
      try {
        const product_id = item.id;
        const quantity = item.quantity_adding || item.packing_quantity || 1;
        const order_limit = item.order_limit || 1;
        console.log('order_limit print ', item.order_limit);
        // if (order_limit > quantity) {
        //   showSnack(
        //     `Minimum order quantity should be more than or equal to ${order_limit.toString()}!`,
        //     null,
        //     true,
        //   );
        //   setIsLoadingMore(false);
        //   return true;
        // }

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
          const { Status, Message, Data } = response;

          if (Status === true) {
            const { Data } = response;
            showSnack(Message);
            const temp = filteredProductsData.map(prod => {
              if (prod.id === item.id) {
                return { ...prod, cart_count: Number(prod.cart_count) + 1 };
              }
              return prod;
            });
            dispatch(modifyFilterProduct(temp));

            console.log('cart detail data print', Data);
            dispatch(modifyCartDetail(Data?.cart_detail));
            // dispatch(fetchProductRequest());
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

  const handleDownload = useCallback(async item => {
    const backendImageUrl = item?.original_images[0];
    console.log('download image ');

    downloadImage(backendImageUrl, item.name, setDownloadLoader);
    console.log('download image 2');
  }, []);

  const renderDdItem = item => {
    // console.log('renderDdItem');
    return (
      <Text
        key={item.id}
        style={{ paddingHorizontal: 10, paddingVertical: 8, fontSize: wp(3.3) }}
      >
        {item.name}
      </Text>
    );
  };

  const onProductItemPressed = useCallback((id, index, item) => {
    console.log('ON PRIODUCT ITEM PRESS', item);
    // let data = {id: item.id, item: item};
    navigation.navigate('ProductDetails', { id, index, item });
  }, []);

  const handleJumpToPage = page => {
    const { sort, filter } = sortFilter;
    setPaginationModalVisible(false);

    if (page < 1 || page > othersProductData?.last_page) false;

    dispatch(applyPage(page));
    scrollToTop();
  };

  const listFooterComponent = () =>
    !isLoading &&
    filteredProductsData.length > 0 && (
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
              {othersProductData?.current_page}
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
                  data={Array(othersProductData?.last_page).fill(0)}
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
              {othersProductData?.last_page}
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
          ({othersProductData.to} of total {othersProductData?.total} Products)
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
            disabled={othersProductData?.current_page === 1}
            onPress={() =>
              handleJumpToPage(othersProductData?.current_page - 1)
            }
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersProductData?.current_page === 1 ? '#ccc' : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation: othersProductData?.current_page === 1 ? 0 : 2,
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
              othersProductData?.current_page === othersProductData?.last_page
            }
            onPress={() =>
              handleJumpToPage(othersProductData?.current_page + 1)
            }
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersProductData?.current_page === othersProductData?.last_page
                  ? '#ccc'
                  : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation:
                othersProductData?.current_page === othersProductData?.last_page
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
              othersProductData?.current_page === othersProductData?.last_page
            }
            onPress={() => handleJumpToPage(othersProductData?.last_page)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersProductData?.current_page === othersProductData?.last_page
                  ? '#ccc'
                  : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation:
                othersProductData?.current_page === othersProductData?.last_page
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

  //PRODUCT LIST
  const RenderProduct = useMemo(
    () =>
      memo(({ item, index }) => {
        // console.log('render product');
        console.log('render', item);

        return isLoading ? (
          <ShimmerLoader
            key={item?.id}
            loading={true}
            width={wp(42.5)}
            height={hp(26.3)}
            borderRadius={hp(3.5)}
            style={{
              marginBottom: hp(3),
              marginHorizontal: wp(2),
            }}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            key={item?.id}
            style={[styles.productItemContainer]}
            onPress={() => onProductItemPressed(item.id, index, item)}

            // onPress={() => navigation.navigate('ProductDetails', data:)}
          >
            {Array.isArray(item?.images) && item?.images?.length !== 0 ? (
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
                  }}
                >
                  <Text
                    style={{
                      // margin: hp(1.1),
                      backgroundColor: '#fff',
                      fontSize: wp(2.3),
                      fontFamily: 'Roboto-Black',
                      paddingHorizontal: 2,
                      borderRadius: 2,
                      color:
                        // Case 1: Main product is limited and has no stock
                        (item?.is_limited == '1' &&
                          (!item?.stock || Number(item?.stock) <= 0)) ||
                        // Case 2: Product has variants, and ALL limited variants have stock 0
                        (Array.isArray(item?.product_variant) &&
                          item?.product_variant.length > 0 &&
                          item?.product_variant.every(
                            variant =>
                              variant?.is_limited == '1' &&
                              Number(variant?.stock) <= 0,
                          ))
                          ? 'red'
                          : '#000080',
                    }}
                  >
                    {
                      // Case 1: Main product is limited and has no stock
                      (item?.is_limited == '1' &&
                        (!item?.stock || Number(item?.stock) <= 0)) ||
                      // Case 2: Product has variants, and ALL limited variants have stock 0
                      (Array.isArray(item?.product_variant) &&
                        item?.product_variant.length > 0 &&
                        item?.product_variant.every(
                          variant =>
                            variant?.is_limited == '1' &&
                            Number(variant?.stock) <= 0,
                        ))
                        ? 'Out of stock'
                        : 'In stock'
                    }
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
                  ]}
                >
                  <Image
                    source={ic_prod_placholder}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>

                <View
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      margin: hp(1.1),
                      backgroundColor: '#fff',
                      fontSize: wp(2.3),
                      fontFamily: 'Roboto-Black',
                      paddingHorizontal: 2,
                      borderRadius: 2,
                      color:
                        // Case 1: Main product is limited and has no stock
                        (item?.is_limited == '1' &&
                          (!item?.stock || Number(item?.stock) <= 0)) ||
                        // Case 2: Product has variants, and ALL limited variants have stock 0
                        (Array.isArray(item?.product_variant) &&
                          item?.product_variant.length > 0 &&
                          item?.product_variant.every(
                            variant =>
                              variant?.is_limited == '1' &&
                              Number(variant?.stock) <= 0,
                          ))
                          ? 'red'
                          : '#000080',
                    }}
                  >
                    {
                      // Case 1: Main product is limited and has no stock
                      (item?.is_limited == '1' &&
                        (!item?.stock || Number(item?.stock) <= 0)) ||
                      // Case 2: Product has variants, and ALL limited variants have stock 0
                      (Array.isArray(item?.product_variant) &&
                        item?.product_variant.length > 0 &&
                        item?.product_variant.every(
                          variant =>
                            variant?.is_limited == '1' &&
                            Number(variant?.stock) <= 0,
                        ))
                        ? 'Out of stock'
                        : 'In stock'
                    }
                  </Text>
                </View>
              </>
            )}

            <View style={styles.productDetailsContainer}>
              <Pressable style={styles.downloadContainer}>
                <AppIcon
                  reverse
                  type="feather"
                  name="download"
                  size={wp(3.5)}
                  color="#fff"
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.downloadContainerStyle}
                  onPress={() => {
                    handleDownload(item);
                  }}
                />
              </Pressable>

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
                }}
              >
                <View
                  style={{
                    // borderWidth: 1,
                    justifyContent: 'space-between',
                    flex: 1,
                    marginRight: wp(1),
                  }}
                >
                  <Text numberOfLines={1} style={styles.productNameText}>
                    {item?.name}
                  </Text>

                  {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item?.category?.unit && (
                      <Text>
                        {item?.category?.unit.replace(
                          /^./,
                          item?.category?.unit[0].toUpperCase(),
                        )}
                        :{' '}
                      </Text>
                    )}

                    {item?.category?.unit == 'pcs' ? (
                      <Text
                        style={{
                          fontSize: 12,
                        }}>
                        {item?.category?.pcs}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 12,
                        }}>
                        {item?.category?.pair}
                      </Text>
                    )}
                  </View> */}

                  <Text style={styles.boxQuantityText}>
                    1 BOX = {item?.packing_quantity || 1} {item?.category?.unit}
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 0,
                    justifyContent: 'flex-end',
                    // flex: 1,
                    alignItems: 'flex-end',
                  }}
                >
                  {item?.mrp <= item?.sp ? (
                    <Text style={styles.productPriceText}>
                      ₹ {item?.sp}/{item.category?.unit}
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // marginRight: -10,
                        bottom: 2,
                      }}
                    >
                      <Text
                        style={[styles.productMrpText, { marginRight: wp(1) }]}
                      >
                        ₹ {item?.mrp}/{item.category?.unit}
                      </Text>
                      <Text style={styles.productPriceText}>
                        ₹ {item?.sp}/{item.category?.unit}
                      </Text>
                    </View>
                  )}
                  {/* <Text style={[styles.productMrpText, {marginRight: wp(1)}]}>
                    /{item?.unit}
                  </Text> */}

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
                    {/* {modalItem?.variants?.length > 0 ? (
                      <TouchableOpacity
                        // disabled={item.cart_count > 0}
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
                          <Icon
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
                          View
                          {item.cart_count > 0
                            ? 'Added'
                            : item?.is_limited == 1 && !Number(item?.stock) > 0
                            ? 'Wishlist'
                            : 'Add'}
                        </Text>
                      </TouchableOpacity>
                    ) : ( */}

                    <TouchableOpacity
                      disabled={item?.cart_count > 0}
                      onPress={() => handleAdd(item)}
                      style={[
                        styles.addContainerStyle,
                        {
                          backgroundColor:
                            !item?.cart_count > 0 ? '#4ab073' : '#000080',
                          paddingHorizontal: wp(2),
                          borderRadius: 2,
                          top: 3,
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                      ]}
                    >
                      {!item.variants.length > 0 && !item?.cart_count > 0 && (
                        <AppIcon
                          type="entypo"
                          name="plus"
                          size={wp(4)}
                          color="#fff"
                          containerStyle={{ margin: 0 }}
                        />
                      )}

                      <Text
                        style={{
                          fontSize: wp(3.5),
                          color: '#fff',
                          fontFamily: 'Roboto-Black',
                        }}
                      >
                        {item?.variants?.length > 0
                          ? 'View'
                          : item?.cart_count > 0
                          ? 'Added'
                          : item?.is_limited == 1 && !Number(item?.stock) > 0
                          ? 'Wishlist'
                          : 'Add'}
                      </Text>
                    </TouchableOpacity>
                    {/* )} */}
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
    [isLoading],
  );

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    setSearchText('');
    dispatch(
      fetchProductRequest(
        `page=${page}&sort_by=${sortBy}&category=${filterBy}`,
      ),
    );
  };

  // console.log('wp', cartItems.total.toString().length);q
  // console.log('othersProductData?.from', othersProductData?.from);
  console.log(CurrentIndex);

  console.log('modalItem', modalItem);

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <View style={[styles.container, { paddingTop: inset.top }]}>
        {(loader || isLoadingMore || downloadLoader) && (
          <View
            style={{
              position: 'absolute',
              height: hp(100),
              width: wp(100),
              backgroundColor: 'rgba(0,0,0,.5)',
              zIndex: 999,
            }}
          />
        )}
        <View style={[styles.header]}>
          <TouchableOpacity
            style={{
              borderRadius: 20,
              elevation: 3,
                width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOpacity: 0.3,
          backgroundColor:"#fff",
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: { width: -1, height: -1 },
            }}
            activeOpacity={0.9}
            onPress={() => goBack()}
          >
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
              containerStyle={{ margin: 0 }}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{profile.active_store_name}</Text>

      <TouchableOpacity
  onPress={() =>
    navigate('Home', {
      screen: 'MyCart',
    })
  }
  style={styles.cartWrapper}
>
  {/* Amount on LEFT */}
  <View style={styles.amountBubble}>
    <Text style={styles.amountText}>
      ₹ {cart_detail?.cart_amount || 0}
    </Text>
  </View>

  {/* Cart Icon */}
  <AppIcon type="fa" name="shopping-cart" size={wp(8.5)} />

  {/* Quantity on TOP RIGHT */}
  <View style={styles.qtyBubble}>
    <Text style={styles.qtyText}>
      {cart_detail?.cart_count || 0}
    </Text>
  </View>
</TouchableOpacity>

        </View>

        <Modal
          isVisible={modalForAdd}
          // isVisible
          useNativeDriver={true}
          onBackButtonPress={() => setModalForAdd(false)}
          onBackdropPress={() => setModalForAdd(false)}
        >
          <View
            style={{
              marginHorizontal: wp(3),
              backgroundColor: '#fff',
              padding: hp(3),
              borderRadius: wp(1),
              // alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setModalForAdd(false)}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                padding: wp(1),
              }}
            >
              <AppIcon
                reverse
                type="fa"
                name="remove"
                size={wp(2)}
                color="red"
                iconStyle={{ fontSize: wp(4) }}
                containerStyle={{ margin: 0 }}
              />
            </TouchableOpacity>
            {modalItem?.variants?.length > 0 ? (
              <View>
                <FlatList
                  data={modalItem.variants}
                  renderItem={item => {
                    return (
                      <Variants
                        data={item}
                        getQuantity={handleQuantityChange}
                        modalItem={modalItem}
                      />
                    );
                  }}
                />

                {!isButtonDisabled && (
                  <TouchableOpacity
                    disabled={isButtonDisabled}
                    style={{
                      height: 32,
                      width: 170,
                      borderColor: '#1526CC',
                      borderWidth: 1,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginTop: 40,
                    }}
                    onPress={addToCart}
                  >
                    <Text style={{ color: '#1526CC', textAlign: 'center' }}>
                      Add to cart
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
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
                    alignSelf: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{ padding: wp(2) }}
                    onPress={handleDecreaseQuantity}
                  >
                    <AppIcon type="fa" name="minus" color="#fff" size={wp(4)} />
                  </TouchableOpacity>

                  <Text style={{ color: '#fff' }}>
                    {modalItem.quantity_adding ||
                      modalItem.packing_quantity ||
                      1}
                  </Text>

                  <TouchableOpacity
                    style={{ padding: wp(2) }}
                    onPress={handleIncreaseQuantity}
                  >
                    <AppIcon type="fa" name="plus" color="#fff" size={wp(4)} />
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
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: wp(2),
                          fontFamily: 'Roboto-Bold',
                        }}
                      >
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
                    // flexDirection: 'row',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    marginTop: hp(3),
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                    }}
                  >
                    Add to cart
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
            ]}
          >
            <Image source={ic_search} style={styles.searchIcon} />
            <TextInput
              testID="searchInput"
              placeholder="Search here..."
              placeholderTextColor="#999"
              style={styles.searchBox}
              selectTextOnFocus
              numberOfLines={1}
              value={searchText}
              returnKeyLabel="search"
              returnKeyType="search"
              enablesReturnKeyAutomatically
              onChangeText={handleSearch}
              onSubmitEditing={handleSubmitSearch}
            />
            {searchText && (
              <TouchableOpacity
                style={{ marginRight: 1 }}
                onPress={() => {
                  dispatch(
                    fetchProductRequest(
                      `page=${page}&sort_by=${sortBy}&category=${filterBy}`,
                    ),
                  );
                  clearSearch();
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
            style={[styles.searchContainer, { flex: 1, paddingHorizontal: 8 }]}
            onPress={handleEnableCategoryDropdown}
          >
            <Text numberOfLines={1} style={[styles.dropDownText, { flex: 1 }]}>
              {categoryList.filter(item => item.id === filterBy)[0]?.title}
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
                    right: 10,
                    top: 0,
                    zIndex: 9999,
                  }}
                >
                  <AppIcon
                    reverse
                    type="fa"
                    name="remove"
                    color="red"
                    style={{ fontSize: wp(4) }}
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

          <View
            style={[
              styles.searchContainer,
              {
                marginRight: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              },
            ]}
          >
            <Dropdown
              style={{ flex: 1, paddingHorizontal: 8 }}
              placeholderStyle={styles.dropDownText}
              selectedTextStyle={styles.dropDownText}
              data={sortingData}
              maxHeight={300}
              labelField="name"
              valueField="value"
              placeholder="Sort by"
              value={sortBy}
              onFocus={clearSearch}
              onChange={handleSorting}
              renderRightIcon={() => (
                <AppIcon
                  type="ionicon"
                  name="caret-down-outline"
                  color="#000"
                  size={wp(5)}
                  iconStyle={{ zIndex: 999, left: wp(0.9) }}
                />
              )}
              renderItem={renderDdItem}
            />
          </View>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
          <View style={styles.homeContainer}>
            {isLoading ? (
              <ShimmerLoader
                loading={true}
                width={wp(50)}
                height={hp(2)}
                borderRadius={3}
                style={{
                  marginTop: hp(1),
                  alignSelf: 'center',
                }}
              />
            ) : (
              <Text style={styles.totalProductCountText}>
                Exploring {CurrentIndex + ((othersProductData?.from || 1) - 1)}{' '}
                of total {othersProductData?.total} products
              </Text>
            )}
            <FlatList
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginTop: 10,
              }}
              ref={productListRef}
              refreshing={isLoading}
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
              renderItem={({ item, index }) => {
                console.log(item?.unit, 'listingDataq');
                return (
                  <RenderProduct
                    key={item?.id?.toString()}
                    item={item}
                    index={index}
                  />
                );
              }}
              //WHEN PRODUCT DATA EMPTY
              ListEmptyComponent={() =>
                !isLoading && (
                  <Text style={{ textAlign: 'center' }}>No Data found</Text>
                )
              }
              //FOOTER
              ListFooterComponent={listFooterComponent}
              //ON SCROLL
              onViewableItemsChanged={
                useRef(({ viewableItems }) => {
                  // console.log('viewableItems', viewableItems);
                  if (viewableItems.length > 0) {
                    setCurrentIndex(
                      viewableItems[
                        filteredProductsData.length < 6
                          ? viewableItems.length - 1
                          : 5
                      ]?.index + 1,
                    );
                  }
                }).current
              }
              //PULLING TO REFRESH
              refreshControl={
                <RefreshControl
                  refreshing={loader || isLoadingMore || downloadLoader}
                  onRefresh={handleRefresh}
                  colors={colors}
                />
              }
              // onEndReachedThreshold={0.5}
              // removeClippedSubviews
              //ON REACH TO END LOADING MORE
              onEndReached={() => {
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
          </View>
        </KeyboardAvoidingView>
      </View>
    </Gradient>
  );
};

export default memo(AllProductsScreen);

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
   cartWrapper: {
    position: 'relative',
    paddingHorizontal: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyBubble: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 20,
    minWidth: wp(5),
    height: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  qtyText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: 'bold',
  },

  amountBubble: {
    position: 'absolute',
    left: -wp(5),
    minWidth: wp(10),
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    // paddingHorizontal: wp(3),
    // paddingVertical: wp(1),
  },

  amountText: {
    color: '#fff',
    fontSize: wp(3.2),
    fontWeight: '600',
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
    shadowOffset: { width: 0, height: -2 },
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
    shadowOffset: { width: 0, height: 1 },
    marginBottom: hp(1.5),
    // overflow: 'hidden',
    marginTop: hp(1),
    // marginVertical: hp(1),
  },
  productImage: {
    width: '100%',
    height: hp(27.3) - hp(6),
    borderTopLeftRadius: hp(1),
    borderTopRightRadius: hp(1),
  },
  productDetailsContainer: {
    width: '100%',
    height: hp(8),
    backgroundColor: '#F0FFF0',
    borderBottomRightRadius: hp(1),
    borderBottomLeftRadius: hp(1),
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
    margin: 0,
    height: hp(3.2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: 72,
  },
  downloadContainer: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: '#000080',
    top: -25,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 10,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  downloadContainerStyle: {},
  iconStyle: {
    fontSize: wp(5),
  },
  variantName: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#000',
  },
  variantPrice: {
    fontSize: 16,
    fontFamily: 'Roboto-Semi-Bold',
    color: '#000',
  },
});
