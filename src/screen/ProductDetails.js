/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//component
import Gradient from '../components/Gradient';
import Modal from 'react-native-modal';
//image
import ic_prod_placholder from '../assets/icons/diamond.png';
import img_product from '../assets/image/product.png';
import ic_next from '../assets/image/forward.png';
import ic_back from '../assets/image/back.png';
import Swiper from 'react-native-swiper';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { showSnack } from '../components/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import {
  applyPage,
  changeIndexOfProduct,
  fetchProductRequest,
  modifyAllProduct,
  modifyFilterProduct,
} from '../redux/action/productActions';
import FastImage from '@d11/react-native-fast-image';
import {
  modifyCartDetail,
  modifyNewArriveProduct,
} from '../redux/action/homeActions';
import CategoryVariants from '../components/categoryVariants';
import { ProductDetailView } from './productDetailApi/productDetailView';
import { ProductDetailData } from './productDetailApi/productDetailPresenter';
import AppIcon from '../components/AppIcon';
import { useIsFocused } from '@react-navigation/native';
import AppBadge from '../components/AppBadge';
import ShimmerLoader from '../components/ShimmerLoader';
import { goBack, navigate } from '../routes/NavigationService';

const ProductDetails = props => {
  console.log('Props on product route.params', props);
  const { navigation, route } = props;

  const { params } = route;
  console.log('Params on this screen', params);

  const [addingLoader, setAddingLoader] = useState(false);
  // const [data, setData] = useState({});
  const [newArrive, setNewArrive] = useState(true);
  const [allProductUse, setAllProductUse] = useState(false);
  const [indexOfProd, setIndexOfProd] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [prevCalled, setPrevCalled] = useState(false);
  const [nextCalled, setNextCalled] = useState(false);
  const [selectVariant, setSelectedVariant] = useState();
  const [buttonText, setButtonText] = useState('Add to cart');
  const [loading, setLoading] = useState(true);
  const [variantData, setVariantData] = useState();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [descriptionModal, setShowDesciptionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariants] = useState(null);

  const { arrival_products, cart_detail } = useSelector(
    state => state.home.homeData,
  );
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

  const cartCount = cart_detail?.cart_count ?? 0;
  const cartAmount = cart_detail?.cart_amount ?? 0;
  console.log('All Data', {
    arrival_products,
    filteredProductsData,
    indexOfProd,
    quantity,
    newArrive,
    // params: route?.params,
    isLoading,
  });
  useEffect(() => {
    if (isFocused) {
      fetchData();

      // let formData = new FormData();
      // formData.append('id', route?.params?.id);
    }
  }, [isFocused, navigation]);

  console.log('othersProductData', {
    othersProductData,
    page,
    indexOfProd,
    indexOfProduct,
  });

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or data fetching
    setTimeout(() => {
      dispatch(
        fetchProductRequest(
          `page=${page}&sort_by=${sortBy}&category=${filterBy}`,
        ),
      );
      fetchData();
      setRefreshing(false);
    }, 2000); // 2 seconds delay
  };

  const handleSelectItem = item => {
    setSelectedVariants(item.variant_id); // Assuming each item has a unique id
    setSelectedVariant(item);
    console.log('jsdhfnmdxcds', item);
    if (item.cart_count > 0) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  };

  console.log('selectVariant', selectVariant);

  useEffect(() => {
    // setVariantData(data[indexOfProd]?.variants);
  }, []);

  const fetchData = async () => {
    try {
      const item = route?.params;

      console.log('item print on click', item);

      if (item?.id) {
        setNewArrive(false);

        const i = filteredProductsData.findIndex(i => i.id === item.id);
        if (i !== -1) {
          setAllProductUse(false);
          setNewArrive(false);
          setQuantity(filteredProductsData[i].packing_quantity);
          setIndexOfProd(i);
          dispatch(changeIndexOfProduct(i));
        } else {
          setAllProductUse(true);
          setNewArrive(false);
          const ind = allProductsData.findIndex(i => i.id === item.id);
          setQuantity(allProductsData[ind].packing_quantity);
          dispatch(changeIndexOfProduct(ind));
          setIndexOfProd(ind);
        }
      } else if (item.index || item.index === 0) {
        // console.log('item.index', item.index);
        setNewArrive(true);
        setAllProductUse(false);
        setQuantity(arrival_products[item.index].packing_quantity);
        setIndexOfProd(item.index);
      }
    } catch (error) {
      console.log('fetchData-PRODDETAIL', error);
    }
  };

  const fetchDetails = async id => {
    try {
      const response = await makeRequest(
        `${BASE_URL}product_detail?id=${route.params.id}`,
        false,
      );
      console.log('ppppp0000', response);

      if (response) {
        const { Status, Message, Data } = response;
        console.log('llllllllliiiii', response);

        if (Status === true) {
          // setVariantData(response.Data?.variants);
          // let detail = Data.detail;
          // detail = {
          //   ...detail,
          //   created_at: dateTimeFormatter(detail.created_at),
          // };

          // setOrderDetails({...Data, detail});

          setLoading(false);
        } else {
          showSnack(Message, null, true);
          setLoading(false);
        }
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (nextCalled) {
        setIndexOfProd(0);
        dispatch(changeIndexOfProduct(0));
        setQuantity(data[0].packing_quantity);
      } else if (prevCalled) {
        setIndexOfProd(39);
        dispatch(changeIndexOfProduct(39));
        setQuantity(data[39].packing_quantity);
      }
    }
  }, [othersProductData.current_page, isFocused]);

  useEffect(() => {
    fetchDetails();
  }, [isFocused]);

  const handlePrevProduct = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    if (indexOfProd === 0) {
      if (!newArrive) {
        dispatch(applyPage(page - 1));
        dispatch(
          fetchProductRequest(
            `page=${page - 1}&sort_by=${sortBy}&category=${filterBy}`,
          ),
        );
        setNextCalled(false);
        setPrevCalled(true);
        return false;
      }
    }
    setIndexOfProd(indexOfProd - 1);
    dispatch(changeIndexOfProduct(indexOfProd - 1));
    setQuantity(data[indexOfProd - 1]?.packing_quantity);
  };

  console.log('selectedVariant print data', selectVariant);

  const handleNextProduct = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    if (indexOfProd === data.length - 1) {
      if (!newArrive) {
        dispatch(applyPage(page + 1));
        dispatch(
          fetchProductRequest(
            `page=${page + 1}&sort_by=${sortBy}&category=${filterBy}`,
          ),
        );
        setNextCalled(true);
        setPrevCalled(false);
      }
      // showSnack('Not found', null, true);
      return true;
    }
    setIndexOfProd(indexOfProd + 1);
    dispatch(changeIndexOfProduct(indexOfProd + 1));
    setQuantity(data[indexOfProd + 1]?.packing_quantity);
  };

  const handleIncrease = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;

    const currentPackingQuantity =
      Number(data[indexOfProd]?.packing_quantity) || 1;
    let orderLimit = data[indexOfProd]?.order_limit;

    // If orderLimit is null, 0, or undefined, set it to Infinity
    orderLimit = orderLimit && orderLimit > 0 ? Number(orderLimit) : Infinity;

    // Calculate the new quantity ensuring it does not exceed the order limit
    let newQuantity = quantity + currentPackingQuantity;

    console.log('Packing Quantity:', currentPackingQuantity);
    console.log('Order Limit:', orderLimit);
    console.log('New Quantity:', newQuantity);

    // **New Logic**: Stop before exceeding the order limit
    if (newQuantity > orderLimit) {
      Alert.alert(
        `Maximum quantity of ${orderLimit} has been reached. You cannot add more.`,
      );
    } else {
      setQuantity(newQuantity); // Increase by packing quantity
    }
  };

  const handleDecrease = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;

    const currentPackingQuantity =
      Number(data[indexOfProd]?.packing_quantity) || 1;

    // Ensure quantity does not go below packingQuantity
    const newQuantity = Math.max(
      currentPackingQuantity,
      quantity - currentPackingQuantity,
    );

    console.log('Packing Quantity:', currentPackingQuantity);
    console.log('Decreasing to:', newQuantity);

    setQuantity(newQuantity);
  };

  // const handleDecrease = () => {
  //   const data = newArrive
  //     ? arrival_products
  //     : allProductUse
  //     ? allProductsData
  //     : filteredProductsData;
  //   if (quantity !== data[indexOfProd]?.packing_quantity) {
  //     setQuantity(prev => prev - data[indexOfProd]?.packing_quantity);
  //   } else if (
  //     params?.data?.item?.variants?.length < 0 &&
  //     selectVariant == undefined
  //   ) {
  //     setQuantity();
  //   }
  // };
  //AAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVV
  const handleAddToCart = async () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    try {
      const product_id = data[indexOfProd]?.id;
      const order_limit = data[indexOfProd]?.order_limit || 1;

      // if ((order_limit || 1) > quantity) {
      //   showSnack(
      //     `Minimum order quantity should be more than or equal to ${order_limit.toString()}!`,
      //     null,
      //     true,
      //   );
      //   return true;
      // }

      if (data[indexOfProd]?.variants.length > 0) {
        if (!selectedVariant) {
          Alert.alert('Please select a variant first!');
          return;
        }
      }
      setAddingLoader(true);

      console.log('selectVariant 3434', selectVariant);
      console.log('selectVariant 34343', product_id);

      const params = {
        product_id:
          data[indexOfProd]?.variants.length > 0
            ? selectVariant.product_id
            : product_id,
        quantity,
      };

      console.log('PARAMS of add cart 989898', params);

      const response = await makeRequest(
        `${BASE_URL}add_product_in_cart`,
        params,
        true,
      );
      console.log('response of add cart 989898', response);

      if (response) {
        const { Status, Message, Data } = response;

        if (Status === true) {
          setButtonText('Added');
          // Optional: Refresh the variants data after adding to the cart
          await fetchDetails();
          setIsAddedToCart(true);
          showSnack(Message);
          const updatedProd = filteredProductsData.map(item =>
            item.id === product_id ? { ...item, cart_count: 1 } : item,
          );
          // fetchData();

          //UPDATING LOCAL STATE OF REDUX

          dispatch(
            fetchProductRequest(
              `page=${page}&sort_by=${sortBy}&category=${filterBy}`,
            ),
          );

          dispatch(
            modifyFilterProduct(
              filteredProductsData.map(item =>
                item.id === product_id ? { ...item, cart_count: 1 } : item,
              ),
            ),
          );

          dispatch(
            modifyAllProduct(
              allProductsData.map(item =>
                item.id === product_id ? { ...item, cart_count: 1 } : item,
              ),
            ),
          );

          dispatch(
            modifyNewArriveProduct(
              arrival_products.map(item =>
                item.id === product_id ? { ...item, cart_count: 1 } : item,
              ),
            ),
          );

          dispatch(modifyCartDetail(Data?.cart_detail));

          setAddingLoader(false);
        } else {
          showSnack(Message, null, true);
        }
      }
    } catch (error) {
      setAddingLoader(false);
      showSnack(
        'Oops something went wrong. Please try again later',
        null,
        true,
      );
      //  console.log(error);
    }
  };

  const data = newArrive
    ? arrival_products
    : allProductUse
    ? allProductsData
    : filteredProductsData;

  console.log('data on product detail 111', data.arrival_products);
  console.log('data on product detail 222', data.allProductUse);
  console.log('data on product detail 333', data.allProductsData);
  console.log('data on product detail 989', data[indexOfProd]);
  console.log('data on product detail e0329304932432', selectVariant);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" backgroundColor="" />
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
      </View>
    );
  }

  const TruncatedText = ({ text = '', wordLimit, color }) => {
    const wordLimits = wordLimit || 10;
    // Ensure text is a valid string
    const safeText = text ? text : '';

    // Split the text into an array of words
    const words = safeText.split(' ');

    // Slice the array to show only the first `wordLimit` words
    const truncatedText = words.slice(0, wordLimits).join(' ');

    // Add ellipsis if the text was truncated
    const displayText =
      words.length > wordLimits ? `${truncatedText}...` : truncatedText;

    return (
      <>
        <TouchableOpacity
          style={
            {
              // width: '90%',
            }
          }
          // onPress={() => setShowDesciptionModal(true)}
        >
          <Text
            numberOfLines={2} // Limits text to 3 lines
            ellipsizeMode="tail"
            style={[styles.text, { color: color || '#fff' }]}
          >
            {text}
          </Text>

          <Text
            style={{
              color: '#000',
              fontSize: 14,
              fontWeight: 'bold',
              marginTop: 4,
            }}
            onPress={() => setShowDesciptionModal(true)}
          >
            Read More
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const isOutOfStock = product => {
    const isLimited = product?.is_limited == 1;
    const stock = Number(product?.stock);

    // Check if main product is out of stock
    const mainOutOfStock = isLimited && stock <= 0;

    // Check if all variants (if exist) are out of stock
    const variants = product?.product_variant || [];
    const variantsOutOfStock =
      variants.length > 0 &&
      variants.every(variant => Number(variant?.stock) <= 0);

    return mainOutOfStock || variantsOutOfStock;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Gradient fromColor="#DBD9F6" toColor="#fff">
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {addingLoader && (
            <View
              style={{
                flex: 1,
                height: hp(100),
                width: wp(100),
                position: 'absolute',
                zIndex: 99,
                backgroundColor: 'rgba(255,255,255, .5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color="green" />
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
            </View>
          )}
          <View style={styles.header}>
            <Pressable onPress={() => goBack()}>
              <AppIcon
                raised
                type="fa"
                name="arrow-left"
                size={wp(5)}
                containerStyle={{ margin: 0 }}
              />
            </Pressable>

            <Text style={styles.headerTitle}>Details</Text>

            <View>
              {isLoading ? (
                <ShimmerLoader
                  loading={isLoading} 
                  width={wp(8)}
                  height={hp(5)}
                  borderRadius={wp(1)}
                  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => navigate('Home', {
                    screen:"MyCart"
                  })}
                  style={styles.cartWrapper}
                >

                  {/* Count bubble */}
                  <View style={styles.countBubble}>
                    <Text style={styles.countText}>{cartCount}</Text>
                  </View>

                  <AppIcon type="fa" name="shopping-cart" style={wp(8.5)} />
                  {/* Amount */}
                  <View style={styles.amountBox}>
                    <Text style={styles.amountText}>₹ {cartAmount}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{paddingBottom: hp(10)}}
          >
            <View style={styles.homeContainer}>
              {isLoading ? (
                <ShimmerLoader
                  loading={isLoading} // or true
                  width={wp(89.3)}
                  height={wp(89.3)}
                  borderRadius={hp(6)}
                  style={{
                    marginTop: hp(2),
                    alignSelf: 'center',
                  }}
                  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                />
              ) : (
                <View style={styles.productImageContainer}>
                  {data[indexOfProd]?.original_images === '' ? (
                    <View
                      style={{
                        flex: 1,
                        width: wp(92),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text>NOT AVAILABLE</Text>
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          position: 'absolute',
                          alignSelf: 'flex-start',
                          zIndex: 999,
                          left: 10,
                          top: 5,
                        }}
                      >
                        <Text
                          style={{
                            margin: hp(1.1),
                            backgroundColor: '#fff',
                            fontSize: wp(3),
                            fontFamily: 'Roboto-Black',
                            paddingHorizontal: 2,
                            borderRadius: 2,
                            // color:
                            //   data[indexOfProd]?.is_limited == 1 &&
                            //   !Number(data[indexOfProd]?.stock) > 0
                            //     ? 'red'
                            //     : '#000080',
                            color: isOutOfStock(data[indexOfProd])
                              ? 'red'
                              : '#000080',
                          }}
                        >
                          {/* {data[indexOfProd]?.is_limited == 1 &&
                          !Number(data[indexOfProd]?.stock) > 0
                            ? 'Out of stock'
                            : 'In stock'} */}

                          {isOutOfStock(data[indexOfProd])
                            ? 'Out of stock'
                            : 'In stock'}
                        </Text>
                      </View>
                      <Swiper
                        pagingEnabled
                        key={data[indexOfProd]?.original_images?.length}
                        activeDotStyle={[
                          { top: 18 },
                          data[indexOfProd]?.length < 2 && { display: 'none' },
                        ]}
                        dotStyle={{ top: 18 }}
                      >
                        {data[indexOfProd]?.original_images?.length !== 0 &&
                        Array.isArray(data[indexOfProd]?.original_images) ? (
                          data[indexOfProd]?.original_images?.map(item => (
                            <FastImage
                              key={Math.random() + 1 + Math.random}
                              source={{
                                uri: item,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                              }}
                              style={[
                                {
                                  width: '100%',
                                  height: '100%',
                                },
                              ]}
                              resizeMode={FastImage.resizeMode.stretch}
                            />
                          ))
                        ) : (
                          <Image
                            source={ic_prod_placholder}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                          />
                        )}
                      </Swiper>
                    </>
                  )}
                </View>
              )}

              {isLoading ? (
                <ShimmerLoader
                  loading={isLoading} // or true
                  width={wp(83.5)}
                  height={hp(14)}
                  borderRadius={hp(3.4)}
                  style={{
                    marginTop: hp(5),
                    alignSelf: 'center',
                  }}
                  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                />
              ) : (
                <View>
                  {data[indexOfProd]?.variants?.length > 0 ? (
                    <View>
                      {data[indexOfProd]?.detail && (
                        <View
                          style={{
                            height: 50,
                            // width: 200,
                            backgroundColor: 'white',
                            marginLeft: 20,
                            marginTop: 20,
                          }}
                        >
                          <View>
                            <Text>Product Detail</Text>
                            <TruncatedText
                              // text={data[indexOfProd]?.detail}
                              text={data[indexOfProd]?.detail}
                              wordLimit={3}
                              color={'black'}
                            />
                          </View>

                          <Modal
                            useNativeDriver
                            onBackButtonPress={() => {
                              setShowDesciptionModal(false);
                            }}
                            onBackdropPress={() =>
                              setShowDesciptionModal(false)
                            }
                            isVisible={descriptionModal}
                          >
                            <View
                              style={{
                                height: 250,
                                backgroundColor: '#fff',
                                borderRadius: hp(1),
                                // alignItems: 'center',

                                width: 270,
                                alignSelf: 'center',
                                paddingHorizontal: 10,
                              }}
                            >
                              <Text
                                style={{
                                  // textAlign: 'center',
                                  color: '#000',
                                  fontSize: 16,
                                  fontWeight: '600',
                                  marginTop: 25,
                                  alignSelf: 'center',
                                }}
                              >
                                Product Detail
                              </Text>
                              <Text
                                style={{ marginTop: 20, textAlign: 'center' }}
                              >
                                {data[indexOfProd]?.detail}
                              </Text>
                            </View>
                          </Modal>
                        </View>
                      )}

                      <Text
                        style={{
                          fontSize: 14,
                          color: '#679A8E',
                          marginTop: 50,
                          marginLeft: 20,
                        }}
                      >
                        OTHER VARIANTS
                      </Text>

                      <FlatList
                        data={data[indexOfProd]?.variants}
                        horizontal
                        keyExtractor={(item, index) => item?.id || index}
                        renderItem={({ item }) => (
                          <CategoryVariants
                            data={{ item }}
                            selectedItem={handleSelectItem}
                            isSelected={selectedVariant === item.variant_id}
                          />
                        )}
                      />
                    </View>
                  ) : (
                    <View style={styles.productDetailsContainer}>
                      <Text style={styles.detailText}>
                        {data[indexOfProd]?.name}
                      </Text>
                      <View
                        style={{ right: 20, position: 'absolute', top: 10 }}
                      >
                        <Text style={styles.priceText}>
                          {data?.[indexOfProd]?.sp != null
                            ? `₹ ${data[indexOfProd].sp}`
                            : '₹ 0'}
                          {data?.[indexOfProd]?.category?.unit
                            ? `/${data[indexOfProd].category.unit}`
                            : ''}
                        </Text>
                      </View>
                      <View style={styles.priceContainer}>
                        {data[indexOfProd]?.detail && (
                          <View>
                            <View style={{ width: '82%' }}>
                              <TruncatedText
                                text={data[indexOfProd]?.detail}
                                wordLimit={3}
                              />
                            </View>

                            <Modal
                              useNativeDriver
                              onBackButtonPress={() => {
                                setShowDesciptionModal(false);
                              }}
                              onBackdropPress={() =>
                                setShowDesciptionModal(false)
                              }
                              isVisible={descriptionModal}
                            >
                              <View
                                style={{
                                  height: 250,
                                  backgroundColor: '#fff',
                                  borderRadius: hp(1),
                                  // alignItems: 'center',

                                  width: 270,
                                  alignSelf: 'center',
                                  paddingHorizontal: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    // textAlign: 'center',
                                    color: '#000',
                                    fontSize: 16,
                                    fontWeight: '600',
                                    marginTop: 25,
                                    alignSelf: 'center',
                                  }}
                                >
                                  Product Detail
                                </Text>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    marginTop: 25,
                                    // justifyContent: 'center',
                                  }}
                                >
                                  {data[indexOfProd]?.detail}
                                </Text>
                              </View>
                            </Modal>
                          </View>
                        )}

                        {/* <AirbnbRating showRating={false} size={wp(4)} isDisabled /> */}

                        <View
                          style={{
                            // flexDirection: 'row',
                            alignItems: 'center',
                            // marginLeft: 100,
                            // position: 'absolute',
                            // right: 0,
                            // bottom: 20,
                          }}
                        >
                          {/* <Text style={styles.boxQuantityText}>
                            1 BOX = {data[indexOfProd]?.packing_quantity || 1}{' '}
                            {data[indexOfProd].unit}
                          </Text> */}
                          {data[indexOfProd]?.unit && (
                            <Text
                              style={{
                                fontSize: wp(4),
                                color: '#fff',
                              }}
                            >
                              1 BOX = {data[indexOfProd]?.packing_quantity || 1}{' '}
                              {data[indexOfProd].unit}
                            </Text>
                          )}

                          {/* {data[indexOfProd]?.category?.unit == 'pcs' ? (
                            <Text
                              style={{
                                fontSize: wp(4),
                                color: '#fff',
                              }}>
                              {data[indexOfProd]?.category?.pcs}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: wp(4),
                                color: '#fff',
                              }}>
                              {data[indexOfProd]?.category?.pair}
                            </Text>
                          )} */}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.actionContainer}>
                {isLoading ? (
                  <ShimmerLoader
                    loading={isLoading} // or true
                    width={wp(24)}
                    height={hp(4.3)}
                    borderRadius={hp(3)}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <TouchableOpacity
                    disabled={
                      othersProductData.current_page == 1 && indexOfProd === 0
                    }
                    activeOpacity={0.8}
                    onPress={handlePrevProduct}
                    style={[
                      styles.lower,
                      othersProductData.current_page == 1 &&
                        indexOfProd === 0 && { backgroundColor: '#999' },
                    ]}
                  >
                    <Image source={ic_back} style={styles.backIcon} />

                    <View style={styles.upper}>
                      <Text style={styles.buttonText}>Prev.</Text>
                    </View>
                  </TouchableOpacity>
                )}

                {isLoading ? (
                  <ShimmerLoader
                    loading={isLoading} // or true
                    width={wp(34)}
                    height={hp(4.3)}
                    borderRadius={hp(3)}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <View
                    style={[
                      styles.quantityContainer,
                      {
                        backgroundColor: isAddedToCart ? '#999' : '#C04547',
                      },
                    ]}
                  >
                    <TouchableOpacity
                      disabled={data[indexOfProd]?.cart_count > 0}
                      // activeOpacity={1}
                      onPress={handleDecrease}
                    >
                      <AppIcon type="antdesign" name="minus" color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.quantityValueContainer}>
                      <Text style={styles.quantityValue}>{quantity || 1}</Text>
                    </View>

                    <TouchableOpacity
                      disabled={data[indexOfProd]?.cart_count > 0}
                      // activeOpacity={1}
                      onPress={handleIncrease}
                    >
                      <AppIcon type="antdesign" name="plus" color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}

                {isLoading ? (
                  <ShimmerLoader
                    loading={isLoading} // or true
                    width={wp(24)}
                    height={hp(4.3)}
                    borderRadius={hp(3)}
                    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
                  />
                ) : (
                  <TouchableOpacity
                    disabled={
                      othersProductData.current_page ==
                        othersProductData.last_page &&
                      indexOfProd === data.length - 1
                    }
                    onPress={handleNextProduct}
                    style={[
                      styles.lower,
                      othersProductData.current_page ==
                        othersProductData.last_page &&
                        indexOfProd === data.length - 1 && {
                          backgroundColor: '#999',
                        },
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.upper}>
                      <Text style={styles.buttonText}>Next</Text>
                    </View>

                    {/* <Image
                    source={require('../assets/image/forward.png')}
                    style={styles.backIcon}
                  /> */}
                    <Image
                      source={ic_back}
                      style={[
                        styles.backIcon,
                        { transform: [{ rotateZ: '180deg' }] },
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {isLoading ? (
              <ShimmerLoader
                loading={isLoading} // or true
                width={wp(42)}
                height={hp(6.1)}
                borderRadius={hp(3)}
                style={{
                  marginTop: hp(6),
                  alignSelf: 'center',
                }}
                shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
              />
            ) : (
              <View>
                {data[indexOfProd]?.variants?.length > 0 ? (
                  <TouchableOpacity
                    disabled={isAddedToCart}
                    onPress={() => {
                      handleAddToCart();
                    }}
                    style={[
                      styles.AddToCartButton,

                      { backgroundColor: isAddedToCart ? '#999' : '#C04547' },
                    ]}
                  >
                    <AppIcon
                      type="antdesign"
                      name="shopping-cart"
                      color="#e1e1e1"
                      size={wp(8)}
                    />

                    <Text
                      style={[
                        styles.AddToCartText,
                        data[indexOfProd]?.is_limited == 1 &&
                          !Number(data[indexOfProd]?.stock) > 0 && {
                            fontSize: wp(4),
                          },
                      ]}
                    >
                      {/* {buttonText} */}
                      {selectVariant?.is_stock === 0
                        ? 'Add to Wishlist'
                        : isAddedToCart
                        ? 'Added'
                        : 'Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    // disabled={data[indexOfProd]?.is_limited == 1 && data[indexOfProd]?.stock == 0}
                    disabled={data[indexOfProd]?.cart_count > 0}
                    onPress={handleAddToCart}
                    style={[
                      styles.AddToCartButton,

                      {
                        backgroundColor:
                          data[indexOfProd]?.cart_count > 0
                            ? '#999'
                            : '#C04547',
                      },
                    ]}
                  >
                    <AppIcon
                      type="antdesign"
                      name="shopping-cart"
                      color="#e1e1e1"
                      size={wp(8)}
                    />

                    <Text
                      style={[
                        styles.AddToCartText,
                        data[indexOfProd]?.is_limited == 1 &&
                          !Number(data[indexOfProd]?.stock) > 0 && {
                            fontSize: wp(4),
                          },
                      ]}
                    >
                      {data[indexOfProd]?.cart_count > 0
                        ? 'Added'
                        : data[indexOfProd]?.is_limited == 1 &&
                          !Number(data[indexOfProd]?.stock) > 0
                        ? 'Add to wishlist'
                        : 'Add to cart'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </Gradient>
    </ScrollView>
  );
};

export default memo(ProductDetails);

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
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: hp(7),
    borderTopRightRadius: hp(7),
    // alignItems: 'center',
  },
  productImageContainer: {
    // width: wp(89.3),
    marginHorizontal: wp(4),
    height: hp(45),
    backgroundColor: '#f1f1f1',
    borderTopEndRadius: hp(6),
    borderTopStartRadius: hp(6),
    marginTop: hp(2),
    // alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    overflow: 'hidden',
  },
  productDetailsContainer: {
    marginHorizontal: wp(4),
    height: hp(16),
    backgroundColor: '#C04547',
    borderRadius: hp(2.5),
    marginTop: hp(2),
    justifyContent: 'space-between',
    padding: hp(1.5),
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: '#fff',
    fontFamily: 'Roboto-Black',
    fontSize: wp(5),
  },
  detailText: {
    color: '#fff',
    fontSize: wp(4),
    fontFamily: 'Roboto-Medium',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(100),
    marginTop: hp(4),
  },
  lower: {
    backgroundColor: '#C04547',
    width: wp(24),
    height: hp(4.3),
    borderRadius: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  backIcon: {
    width: wp(8),
    height: hp(2.8),
    // tintColor: 'white',
  },
  upper: {
    backgroundColor: '#fff',
    width: wp(16),
    height: hp(4.3),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
  },
  quantityContainer: {
    backgroundColor: '#C04547',
    width: wp(34),
    height: hp(4.3),
    borderRadius: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  quantityValueContainer: {
    backgroundColor: '#fff',
    width: wp(16),
    height: hp(4.3),
    borderRadius: hp(3),
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontFamily: 'Roboto-Black',
  },
  AddToCartButton: {
    width: wp(42),
    height: hp(6.1),
    borderRadius: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    marginTop: hp(4),
    alignSelf: 'center',
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: hp(9),
    shadowOffset: { width: 0, height: 1 },
  },
  AddToCartText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
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
  zIndex:1,
  backgroundColor: 'red',
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
  // marginLeft: wp(2),
  backgroundColor: 'gray',
  paddingHorizontal: wp(2.5),
  paddingVertical: wp(0.8),
  borderRadius: 6,
  left:-50,
  position:"absolute"
},

amountText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
},
});
