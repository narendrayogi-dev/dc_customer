/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ShimmerLoader from '../components/ShimmerLoader';

//component
import Gradient from '../components/Gradient';

//image
import ic_prod_placholder from '../assets/icons/diamond.png';
import img_product from '../assets/image/product.png';
import ic_next from '../assets/image/forward.png';
import ic_back from '../assets/image/back.png';
import Swiper from 'react-native-swiper';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showSnack} from '../components/Snackbar';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchNewArrivalProductRequest,
  fetchProductRequest,
  modifyAllProduct,
  modifyFilterProduct,
} from '../redux/action/productActions';
import {showMessage} from 'react-native-flash-message';
import FastImage from '@d11/react-native-fast-image';
import {
  modifyCartDetail,
  modifyNewArriveProduct,
} from '../redux/action/homeActions';
import {goForLogin} from '../components/globalFunctions';
import AppIcon from '../components/AppIcon';
import AppBadge from '../components/AppBadge';
import { useIsFocused } from '@react-navigation/native';

const Demo_ProductDetails = props => {
  const {navigation, route} = props;
  const [addingLoader, setAddingLoader] = useState(false);
  // const [data, setData] = useState({});
  const [newArrive, setNewArrive] = useState(true);
  const [allProductUse, setAllProductUse] = useState(false);
  const [indexOfProd, setIndexOfProd] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const isFocused = useIsFocused();

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {arrival_products, cart_detail} = useSelector(
    state => state.demoHome.demoHomeData,
  );

  const {filteredProductsData, allProductsData, isLoading} = useSelector(
    state => state.demoProduct,
  );

  // console.log('All Data', {
  //   arrival_products,
  //   filteredProductsData,
  //   indexOfProd,
  //   quantity,
  //   newArrive,
  //   params: route?.params,
  //   isLoading,
  // });

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      const item = route?.params;

      if (item?.id) {
        setNewArrive(false);

        const i = filteredProductsData.findIndex(i => i.id === item.id);
        if (i !== -1) {
          setAllProductUse(false);
          setNewArrive(false);
          setQuantity(filteredProductsData[i].packing_quantity);
          setIndexOfProd(i);
        } else {
          setAllProductUse(true);
          setNewArrive(false);
          const ind = allProductsData.findIndex(i => i.id === item.id);
          setQuantity(allProductsData[ind].packing_quantity);
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

  const handlePrevProduct = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    if (indexOfProd === 0) {
      showSnack('Not found', null, true);
      return true;
    }
    setIndexOfProd(indexOfProd - 1);
    setQuantity(data[indexOfProd - 1].packing_quantity);
  };

  const handleNextProduct = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    if (indexOfProd === data.length - 1) {
      showSnack('Not found', null, true);
      return true;
    }
    setIndexOfProd(indexOfProd + 1);
    setQuantity(data[indexOfProd + 1].packing_quantity);
  };

  const handleIncrease = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    setQuantity((quantity || 1) + (data[indexOfProd].packing_quantity || 1));
  };

  const handleDecrease = () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    if (quantity !== data[indexOfProd].packing_quantity) {
      setQuantity(
        prev => (prev || 1) - (data[indexOfProd].packing_quantity || 1),
      );
    }
  };
  //AAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVV
  const handleAddToCart = async () => {
    const data = newArrive
      ? arrival_products
      : allProductUse
      ? allProductsData
      : filteredProductsData;
    try {
      const product_id = data[indexOfProd].id;
      const order_limit = data[indexOfProd].order_limit || 1;

      if ((order_limit || 1) > quantity) {
        showSnack(
          `Minimum order quantity should be more than or equal to ${order_limit.toString()}!`,
          null,
          true,
        );
        return true;
      }

      setAddingLoader(true);
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
          showSnack(Message);
          const updatedProd = filteredProductsData.map(item =>
            item.id === product_id ? {...item, cart_count: 1} : item,
          );

          //UPDATING LOCAL STATE OF REDUX
          dispatch(
            modifyFilterProduct(
              filteredProductsData.map(item =>
                item.id === product_id ? {...item, cart_count: 1} : item,
              ),
            ),
          );

          dispatch(
            modifyAllProduct(
              allProductsData.map(item =>
                item.id === product_id ? {...item, cart_count: 1} : item,
              ),
            ),
          );

          dispatch(
            modifyNewArriveProduct(
              arrival_products.map(item =>
                item.id === product_id ? {...item, cart_count: 1} : item,
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

  // console.log('DATA ', {data, newArrive, allProductUse});

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <View style={[styles.container, {paddingTop: insets.top}]}>
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
            }}>
            <ActivityIndicator size="large" color="green" />
            <Text
              style={{
                marginTop: 10,
                color: '#000',
                fontSize: 16,
                textAlign: 'center',
              }}>
              Please wait...
            </Text>
          </View>
        )}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.pop()}>
            <AppIcon
              raised
              type="font-awesome-5"
              name="arrow-left"
              size={wp(4)}
              containerStyle={{margin: 0}}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Details</Text>

          <View>
            {isLoading ? (
            <ShimmerLoader
  loading={true}
  width={wp(8)}
  height={hp(5)}
  borderRadius={wp(1)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

            ) : (
              <TouchableOpacity onPress={() => goForLogin(navigation)}>
                <AppIcon
                  type="fa"
                  name="shopping-cart"
                  size={wp(8.5)}
                />
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
                        cart_detail?.cart_amount?.toString().length < 5
                          ? -45
                          : -55,
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
  loading={true}
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
                {data[indexOfProd].original_images === '' ? (
                  <View
                    style={{
                      flex: 1,
                      width: wp(92),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
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
                      }}>
                      <Text
                        style={{
                          margin: hp(1.1),
                          backgroundColor: '#fff',
                          fontSize: wp(3),
                          fontFamily: 'Roboto-Black',
                          paddingHorizontal: 2,
                          borderRadius: 2,
                          color:
                            data[indexOfProd].is_limited == 1 &&
                            !Number(data[indexOfProd].stock) > 0
                              ? 'red'
                              : '#000080',
                        }}>
                        {data[indexOfProd].is_limited == 1 &&
                        !Number(data[indexOfProd].stock) > 0
                          ? 'Out of stock'
                          : 'In stock'}
                      </Text>
                    </View>
                    <Swiper
                      pagingEnabled
                      activeDotStyle={[
                        {top: 18},
                        data[indexOfProd].length < 2 && {display: 'none'},
                      ]}
                      dotStyle={{top: 18}}>
                      {data[indexOfProd]?.original_images?.length !== 0 &&
                      Array.isArray(data[indexOfProd]?.original_images) ? (
                        data[indexOfProd].original_images?.map(item => (
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
                          style={{width: '100%', height: '100%'}}
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
  loading={true}
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
              <View style={styles.productDetailsContainer}>
                <Text style={styles.priceText}>₹ {data[indexOfProd].sp}</Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.detailText}>
                    {data[indexOfProd].name}
                  </Text>

                  {/* <AirbnbRating showRating={false} size={wp(4)} isDisabled /> */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: '#fff'}}>PCS Per Box : </Text>
                    <Text
                      style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        paddingHorizontal: wp(3),
                        borderRadius: 2.5,
                      }}>
                      {data[indexOfProd].packing_quantity}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.actionContainer}>
              {isLoading ? (
                <ShimmerLoader
  loading={true}
  width={wp(24)}
  height={hp(4.3)}
  borderRadius={hp(3)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

              ) : (
                <TouchableOpacity
                  disabled={indexOfProd === 0}
                  activeOpacity={0.8}
                  onPress={handlePrevProduct}
                  style={[
                    styles.lower,
                    indexOfProd === 0 && {backgroundColor: '#999'},
                  ]}>
                  <Image source={ic_back} style={styles.backIcon} />

                  <View style={styles.upper}>
                    <Text style={styles.buttonText}>Prev.</Text>
                  </View>
                </TouchableOpacity>
              )}

              {isLoading ? (
               <ShimmerLoader
  loading={true}
  width={wp(34)}
  height={hp(4.3)}
  borderRadius={hp(3)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

              ) : (
                <View
                  style={[
                    styles.quantityContainer,
                    data[indexOfProd]?.cart_count > 0 && {
                      backgroundColor: '#999',
                    },
                  ]}>
                  <TouchableOpacity
                    disabled={data[indexOfProd]?.cart_count > 0}
                    // activeOpacity={1}
                    onPress={handleDecrease}>
                    <AppIcon type="antdesign" name="minus" color="#fff" />
                  </TouchableOpacity>

                  <View style={styles.quantityValueContainer}>
                    <Text style={styles.quantityValue}>{quantity || 1}</Text>
                  </View>

                  <TouchableOpacity
                    disabled={data[indexOfProd]?.cart_count > 0}
                    // activeOpacity={1}
                    onPress={handleIncrease}>
                    <AppIcon type="antdesign" name="plus" color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {isLoading ? (
                <ShimmerLoader
  loading={true} // or isLoading
  width={wp(24)}
  height={hp(4.3)}
  borderRadius={hp(3)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

              ) : (
                <TouchableOpacity
                  disabled={indexOfProd === data.length - 1}
                  onPress={handleNextProduct}
                  style={[
                    styles.lower,
                    indexOfProd === data.length - 1 && {
                      backgroundColor: '#999',
                    },
                  ]}
                  activeOpacity={0.8}>
                  <View style={styles.upper}>
                    <Text style={styles.buttonText}>Next</Text>
                  </View>

                  <Image source={ic_next} style={styles.backIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {isLoading ? (
           <ShimmerLoader
  loading={true} // or isLoading
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
            <TouchableOpacity
              // disabled={data[indexOfProd].is_limited == 1 && data[indexOfProd].stock == 0}
              disabled={data[indexOfProd]?.cart_count > 0}
              onPress={() => goForLogin(navigation)}
              style={[
                styles.AddToCartButton,
                data[indexOfProd]?.cart_count > 0 && {backgroundColor: '#999'},
              ]}>
              <AppIcon
                type="antdesign"
                name="shoppingcart"
                color="#e1e1e1"
                size={wp(8)}
              />

              <Text
                style={[
                  styles.AddToCartText,
                  data[indexOfProd].is_limited == 1 &&
                    !Number(data[indexOfProd].stock) > 0 && {
                      fontSize: wp(4),
                    },
                ]}>
                {data[indexOfProd]?.cart_count > 0
                  ? 'Added'
                  : data[indexOfProd].is_limited == 1 &&
                    !Number(data[indexOfProd].stock) > 0
                  ? 'Add to wishlist'
                  : 'Add to cart'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Gradient>
  );
};

export default memo(Demo_ProductDetails);

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
    shadowOffset: {width: 0, height: 1},
    overflow: 'hidden',
  },
  productDetailsContainer: {
    marginHorizontal: wp(4),
    height: hp(14),
    backgroundColor: '#C04547',
    borderRadius: hp(2.5),
    marginTop: hp(2),
    justifyContent: 'space-between',
    padding: hp(1.5),
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
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
    shadowOffset: {width: 0, height: 1},
  },
  backIcon: {
    width: wp(8),
    height: hp(2.8),
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
    shadowOffset: {width: 0, height: 1},
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
    shadowOffset: {width: 0, height: 1},
  },
  quantityValueContainer: {
    backgroundColor: '#fff',
    width: wp(16),
    height: hp(4.3),
    borderRadius: hp(3),
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontFamily: 'Roboto-Black',
  },
  AddToCartButton: {
    backgroundColor: '#C04547',
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
    shadowOffset: {width: 0, height: 1},
  },
  AddToCartText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(4.5),
  },
});
