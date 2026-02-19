/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  ImageBackground,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Component
import { showSnack } from '../components/Snackbar';
import Header from '../components/Header';
import Gradient from '../components/Gradient';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { async_keys, getData } from '../api/UserPreference';

//icon
import FastImage from '@d11/react-native-fast-image';
import img_product from '../assets/image/product.png';
import ic_prod_placholder from '../assets/icons/diamond.png';
//REDUX
import {
  fetchProductRequest,
  modifyAllProduct,
  modifyFilterProduct,
} from '../redux/action/productActions';
import { useDispatch, useSelector } from 'react-redux';
import {
  modifyCartDetail,
  modifyNewArriveProduct,
} from '../redux/action/homeActions';
import AppIcon from '../components/AppIcon';
import ShimmerLoader from '../components/ShimmerLoader';
import { useIsFocused } from '@react-navigation/native';
import { replace, resetTo } from '../routes/NavigationService';

const MyCart = props => {
  const { navigation } = props;



  const [mainData, setMainData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [isLoding, setIsLoding] = useState(true);
  const [loader, setLoader] = useState(false);
  const [noteText, setNoteText] = useState('');
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const { arrival_products } = useSelector(state => state.home.homeData);
  const { filteredProductsData, allProductsData } = useSelector(
    state => state.product,
  );
  const { cart_detail } = useSelector(state => state.home.homeData);

  useEffect(() => {
    if (isFocused) {
      fetchCartData();
    }
  }, [isFocused]);

  const fetchCartData = async () => {
    try {
      // setIsLoding(true);
      const response = await makeRequest(`${BASE_URL}cart_items`, null, true);

      if (response) {
        const { Status, Message } = response;
        // console.log('cart item--res----->>', response);
        console.log('cart data show here', response?.Data?.item);

        if (Status === true) {
          const { Data } = response;
          setMainData(Data.item);
          setData(Data.item);
          setWishlistData(Data.wish_cart_item);
          setSummaryData(Data?.detail);
          setIsLoding(false);
          setLoader(false);
        } else {
          setData([]);
          showSnack(Message, null, true);
          setIsLoding(false);
        }
      }
      setIsLoding(false);
    } catch (error) {
      setIsLoding(false);
      //  console.log(error);
    }
  };

  const handleRefresh = () => {
    fetchCartData();
  };

  // const handleIncrease = async item => {
  //   const quantity = item.packing_quantity;
  //   const product_id = item.product_id;

  //   try {
  //     setLoader(true);
  //     const response = await makeRequest(
  //       `${BASE_URL}add_product_in_cart`,
  //       {product_id, quantity},
  //       true,
  //     );

  //     if (response) {
  //       const {Status, Message} = response;

  //       if (Status === true) {
  //         fetchCartData();
  //       } else {
  //         showSnack(Message, null, true);
  //         setLoader(false);
  //       }
  //     } else {
  //       setLoader(false);
  //     }
  //   } catch (error) {
  //     //  console.log(error);
  //     setLoader(false);
  //   }
  // };

  // const handleIncrease = async item => {
  //   console.log('item print 00000', item);
  //   const packingQuantity = item.packing_quantity;
  //   const product_id = item.product_id;

  //   // Get the current quantity from the cart
  //   const currentQuantity = item.current_quantity || 0;

  //   // Calculate the allowed quantity to add
  //   const remainingQuantity = item.order_limit - currentQuantity;

  //   // Check if the new quantity exceeds the limit
  //   if (remainingQuantity <= item.order_limit) {
  //     Alert.alert(`Maximum quantity of ${item.order_limit} has been reached.`);
  //     return; // Exit the function to prevent further processing
  //   }

  //   // Determine the actual quantity to send
  //   const quantityToAdd = Math.min(packingQuantity, remainingQuantity);

  //   try {
  //     setLoader(true);

  //     // Send the appropriate quantity (capped at the limit)
  //     const response = await makeRequest(
  //       `${BASE_URL}add_product_in_cart`,
  //       {product_id, quantity: quantityToAdd},
  //       true,
  //     );

  //     if (response) {
  //       const {Status, Message} = response;

  //       if (Status === true) {
  //         fetchCartData(); // Refresh cart data
  //       } else {
  //         showSnack(Message, null, true);
  //         setLoader(false); // Stop loader on failure
  //       }
  //     } else {
  //       setLoader(false);
  //     }
  //   } catch (error) {
  //     setLoader(false); // Stop loader on error
  //   }

  //   console.log('Quantity added:', quantityToAdd);
  // };

  const handleIncrease = async item => {
    console.log('Item Print: here ', item);

    const packingQuantity = item.packing_quantity || 1; // Default packing quantity
    const product_id = item.product_id;
    const currentQuantity = item.quantity || 0; // Ensure current quantity is valid

    // Set order limit to Infinity if it's null, 0, or undefined
    const orderLimit = item.order_limit > 0 ? item.order_limit : Infinity;

    // Calculate the new quantity
    const newQuantity = currentQuantity + packingQuantity;

    // Check if the new quantity exceeds the order limit
    if (newQuantity > orderLimit) {
      Alert.alert(`Maximum quantity of ${orderLimit} has been reached.`);
      return; // Stop execution
    }

    try {
      setLoader(true);

      // Send the new quantity
      const response = await makeRequest(
        `${BASE_URL}add_product_in_cart`,
        { product_id, quantity: packingQuantity }, // Always increase by packing quantity
        true,
      );

      if (response) {
        const { Status, Message } = response;

        if (Status === true) {
          fetchCartData(); // Refresh cart data
        } else {
          showSnack(Message, null, true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false); // Stop loader in all cases
    }

    console.log('Quantity added:', packingQuantity);
  };

  // ✅ **Decreasing Quantity**
  const handleDecrease = async (item, isWish) => {
    const packingQuantity = item.packing_quantity || 1; // Ensure packing quantity has a default value
    const cart_id = item.id;
    const currentQuantity = item.quantity || packingQuantity; // Default to at least packing quantity

    // Prevent decreasing below packing quantity
    if (currentQuantity <= packingQuantity) {
      Alert.alert(
        `You cannot decrease below the packing quantity of ${packingQuantity}.`,
      );
      return;
    }

    const params = {
      quantity: packingQuantity,
    };

    if (isWish) {
      params.wish_id = cart_id;
    } else {
      params.cart_id = cart_id;
    }

    try {
      setLoader(true);

      const response = await makeRequest(
        `${BASE_URL}decrement_cart_quantity`,
        params,
        true,
      );

      if (response) {
        const { Status, Message } = response;

        if (Status === true) {
          fetchCartData();
        } else {
          showSnack(Message, null, true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = item => {
    console.log('item', item);
    const cart_id = item.id;
    Alert.alert('Are you sure', 'You want to delete this item', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => deleteApi() },
    ]);

    const deleteApi = async () => {
      try {
        setLoader(true);
        const response = await makeRequest(
          `${BASE_URL}remove_cart_item`,
          { cart_id },
          true,
        );

        if (response) {
          const { Status, Message } = response;

          if (Status === true) {
            showSnack(Message);
            const { Data } = response;
            setData(Data?.item);
            setWishlistData(Data?.wish_cart_item);
            setSummaryData(Data?.detail);

            //UPDATING LOCAL STATE OF REDUX
            const { product_id } = item;
            if (filteredProductsData.length > 0) {
              dispatch(
                modifyFilterProduct(
                  filteredProductsData.map(prod =>
                    prod.id === product_id ? { ...prod, cart_count: 0 } : prod,
                  ),
                ),
              );
            }

            if (allProductsData.length > 0) {
              dispatch(
                modifyAllProduct(
                  allProductsData.map(prod =>
                    prod.id === product_id ? { ...prod, cart_count: 0 } : prod,
                  ),
                ),
              );
            }

            if (arrival_products.length > 0) {
              dispatch(
                modifyNewArriveProduct(
                  arrival_products.map(prod =>
                    prod.id === product_id ? { ...prod, cart_count: 0 } : prod,
                  ),
                ),
              );
            }
            dispatch(
              modifyCartDetail({
                cart_amount: Data?.detail?.total,
                cart_count: Data?.item?.length,
              }),
            );
          } else {
            showSnack(Message, null, true);
          }
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);
        //  console.log(error);
      }
    };
  };

  const handleWishDelete = item => {
    console.log('item', item);
    const cart_id = item.id;
    Alert.alert('Are you sure', 'You want to delete this item', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => deleteApi() },
    ]);

    const deleteApi = async () => {
      try {
        setLoader(true);
        const response = await makeRequest(
          `${BASE_URL}remove_wish_item`,
          { cart_id },
          true,
        );

        if (response) {
          const { Status, Message } = response;

          if (Status === true) {
            showSnack(Message);
            const { Data } = response;
            setData(Data?.item);
            setWishlistData(Data?.wish_cart_item);
            setSummaryData(Data?.detail);

            //UPDATING LOCAL STATE OF REDUX
            const { product_id } = item;
            if (filteredProductsData.length > 0) {
              dispatch(
                modifyFilterProduct(
                  filteredProductsData.map(prod =>
                    prod.id === product_id ? { ...prod, cart_count: 0 } : prod,
                  ),
                ),
              );
            }

            if (allProductsData.length > 0) {
              dispatch(
                modifyAllProduct(
                  allProductsData.map(prod =>
                    prod.id === product_id ? { ...prod, cart_count: 0 } : prod,
                  ),
                ),
              );
            }

            if (arrival_products.length > 0) {
              dispatch(
                modifyNewArriveProduct(
                  arrival_products.map(prod =>
                    prod.id === product_id ? { ...prod, cart_count: 0 } : prod,
                  ),
                ),
              );
            }
          } else {
            showSnack(Message, null, true);
          }
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);
        //  console.log(error);
      }
    };
  };

  const handleDeleteAll = () => {
    Alert.alert('Are you sure', 'You want to delete all item', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => deleteApi() },
    ]);

    const deleteApi = async () => {
      try {
        setIsLoding(true);
        const response = await makeRequest(`${BASE_URL}remove_cart_items`);

        if (response) {
          const { Status, Message } = response;
          // console.log('delete all--res----->>', response);

          if (Status === true) {
            showSnack(Message);
            setData([]);
            setWishlistData([]);
            setSummaryData({
              total: 0,
              delivery: 'FREE',
              grant_total: 0,
            });
            //UPDATING LOCAL STATE OF REDUX
            if (filteredProductsData.length > 0) {
              dispatch(
                modifyFilterProduct(
                  filteredProductsData.map(prod => ({
                    ...prod,
                    cart_count: 0,
                  })),
                ),
              );
            }

            if (allProductsData.length > 0) {
              dispatch(
                modifyAllProduct(
                  allProductsData.map(prod => ({ ...prod, cart_count: 0 })),
                ),
              );
            }

            if (arrival_products.length > 0) {
              dispatch(
                modifyNewArriveProduct(
                  arrival_products.map(prod => ({ ...prod, cart_count: 0 })),
                ),
              );
            }
            dispatch(
              modifyCartDetail({
                cart_amount: 0,
                cart_count: 0,
              }),
            );
          } else {
            showSnack(Message, null, true);
          }
        }
        setIsLoding(false);
      } catch (error) {
        setIsLoding(false);
        //  console.log(error);
      }
    };
  };

  const handleOrderPlaced = async () => {
    if (data.length === 0) {
      showSnack('Your cart is empty', null, true);
      return true;
    }
    try {
      setLoader(true);
      const response = await makeRequest(
        `${BASE_URL}create_order`,
        { note: noteText },
        true,
      );

      if (response) {
        const { Message, Status } = response;
        console.log('responce of placed order', response);
        if (Status === true) {
          const { Data } = response;
          showSnack(Message);

          // fetchCartData();
          setData([]);
          setWishlistData([]);
          setSummaryData({});

          //UPDATING LOCAL STATE OF REDUX
          if (filteredProductsData.length > 0) {
            dispatch(
              modifyFilterProduct(
                filteredProductsData.map(prod => ({ ...prod, cart_count: 0 })),
              ),
            );
          }

          if (allProductsData.length > 0) {
            dispatch(
              modifyAllProduct(
                allProductsData.map(prod => ({ ...prod, cart_count: 0 })),
              ),
            );
          }

          if (arrival_products.length > 0) {
            dispatch(
              modifyNewArriveProduct(
                arrival_products.map(prod => ({ ...prod, cart_count: 0 })),
              ),
            );
          }
          dispatch(
            modifyCartDetail({
              cart_amount: 0,
              cart_count: 0,
            }),
          );
          navigation.navigate('OrderPlaced', Data.order_id);
        } else {
          showSnack(Message, null, true);
          setLoader(false);
        }
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log('error show of place order', error);
      setLoader(false);
      //  console.log(error);
    }
  };

  const renderCartItem = ({ item, index }) => {
    console.log('render cart item', item);
    return (
      <View key={index} style={styles.productContainer}>
        {isLoding ? (
          <ShimmerLoader
            key={index}
            loading={isLoding} // or true
            width={hp(14)}
            height={hp(14)}
            borderRadius={hp(2)}
            shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
          />
        ) : (
          <View style={styles.productImageContainer}>
            {item?.product_image.length === 0 ? (
              <Image
                source={ic_prod_placholder}
                style={[styles.productImage]}
              />
            ) : (
              <FastImage
                source={{
                  uri: item.product_image[0],
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                defaultSource={ic_prod_placholder}
                style={[styles.productImage]}
                resizeMode={FastImage.resizeMode.stretch}
              />
            )}

            <View style={styles.productDetailsContainer}>
              {isLoding ? (
               <ShimmerLoader
  loading={isLoding} // or true
  width={hp(15)}
  height={hp(2)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(1) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

              ) : (
                <Text style={styles.productName}>{item.product_name}</Text>
              )}

              {isLoding ? (
                <ShimmerLoader
  loading={isLoding} // or true
  width={hp(12.5)}
  height={hp(2)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(3) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

              ) : (
                <Text style={styles.productPrice}>
                  ₹ {item.p_price}/
                  <Text style={styles.small}>{item?.unit}</Text>
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.productActionContainer}>
          {!isLoding && (
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <AppIcon
                type="antdesign"
                name="delete"
                size={wp(5)}
                color="red"
              />
            </TouchableOpacity>
          )}
          {isLoding ? (
            <ShimmerLoader
  loading={isLoding} // or true
  width={hp(10)}
  height={hp(3)}
  borderRadius={1}
  style={{ marginTop: hp(3.5) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

          ) : (
            <View
              style={[
                styles.quantityContainer,
                isLoding && { marginTop: wp(5) },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleDecrease(item)}
                style={styles.increaseButton}
              >
                <Text style={styles.decreaseText}>-</Text>
              </TouchableOpacity>

              <View style={styles.quantityInputContainer}>
                <Text style={styles.quantityInputBox}>{item.quantity}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleIncrease(item)}
                style={styles.increaseButton}
              >
                <Text style={styles.increaseText}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoding ? (
            <ShimmerLoader
  loading={isLoding} // or true
  width={hp(9)}
  height={hp(2.5)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(2.5) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

          ) : (
            <Text style={styles.amount}>₹ {item.total}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderWishItem = ({ item, index }) => (
    <View
      key={index}
      style={[styles.productContainer, index === 0 && { borderTopWidth: 0 }]}
    >
      {isLoding ? (
        <ShimmerLoader
  key={index}
  loading={isLoding} // or true
  width={hp(14)}
  height={hp(14)}
  borderRadius={hp(2)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

      ) : (
        <View style={styles.productImageContainer}>
          {item?.product_image.length === 0 ? (
            <View style={styles.productImage}>
              <View>
                <Text
                  style={{
                    margin: hp(1.1),
                    backgroundColor: '#fff',
                    fontSize: wp(2.3),
                    color: 'red',
                    fontFamily: 'Roboto-Black',
                    paddingHorizontal: 2,
                    borderRadius: 2,
                  }}
                >
                  Out of stock
                </Text>
              </View>
              {/* <Text
                style={{
                  textAlign: 'center',
                }}>
                NOT AVAILABLE
              </Text> */}
            </View>
          ) : (
            <>
              <FastImage
                source={{
                  uri: item.product_image[0],
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
                  //  top: hp(0.5),
                  //   left: wp(1)
                }}
              >
                <Text
                  style={{
                    margin: hp(0.5),
                    backgroundColor: '#fff',
                    fontSize: wp(2),
                    color: 'red',
                    fontFamily: 'Roboto-Black',
                    paddingHorizontal: 2,
                    borderRadius: 2,
                  }}
                >
                  Out of stock
                </Text>
              </View>
              {/* <ImageBackground
              source={{uri: item.product_image[0]}}
              style={styles.productImage}
              resizeMode="stretch">
              <View>
                <Text
                  style={{
                    margin: hp(0.8),
                    backgroundColor: '#fff',
                    fontSize: wp(2),
                    color: 'red',
                    fontFamily: 'Roboto-Black',
                    paddingHorizontal: 2,
                    borderRadius: 2,
                  }}>
                  Out of stock
                </Text>
              </View>
            </ImageBackground> */}
            </>
          )}
          <View style={styles.productDetailsContainer}>
            {isLoding ? (
              <ShimmerLoader
  loading={isLoding} // or true
  width={hp(15)}
  height={hp(2)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(1) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

            ) : (
              <Text style={styles.productName}>{item.product_name}</Text>
            )}

          

            {isLoding ? (
              <ShimmerLoader
  loading={isLoding} // or true
  width={hp(12.5)}
  height={hp(2)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(3) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

            ) : (
              <Text style={styles.productPrice}>
                ₹ {item.p_price}/<Text style={styles.small}>{item?.unit}</Text>
              </Text>
            )}
          </View>
        </View>
      )}

      {/* DELETING ITEM */}

      <View style={styles.productActionContainer}>
        {!isLoding && (
          <TouchableOpacity onPress={() => handleWishDelete(item)}>
            <AppIcon type="antdesign" name="delete" size={wp(5)} color="red" />
          </TouchableOpacity>
        )}

        {isLoding ? (
         <ShimmerLoader
  loading={isLoding} // or true
  width={hp(10)}
  height={hp(3)}
  borderRadius={1}
  style={{ marginTop: hp(3.5) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <View
            style={[styles.quantityContainer, isLoding && { marginTop: wp(5) }]}
          >
            <TouchableOpacity
              onPress={() => handleDecrease(item, true)}
              style={styles.increaseButton}
            >
              <Text style={styles.decreaseText}>-</Text>
            </TouchableOpacity>

            <View style={styles.quantityInputContainer}>
              <Text style={styles.quantityInputBox}>{item.quantity}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleIncrease(item)}
              style={styles.increaseButton}
            >
              <Text style={styles.increaseText}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoding ? (
         <ShimmerLoader
  loading={isLoding} // or true
  width={hp(9)}
  height={hp(2.5)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(2.5) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

        ) : (
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              fontSize: wp(2),
              marginTop: hp(2),
            }}
          >
            Item will be added to wishlist
          </Text>
        )}
      </View>
    </View>
  );

  let noteRef;

  const handleNote = text => setNoteText(text);

  const writeNote = () => noteRef.focus();

  const renderFooter = useMemo(
    () =>
      memo(() => (
        <>
          {wishlistData.length > 0 && (
            <View style={styles.wishlistContainer}>
              <Text style={styles.wishlistText}>
                Wishlist:{' '}
                <Text style={styles.wishlistText1}>
                  You will be notified when item will be restock
                </Text>
              </Text>

              <FlatList
                scrollEnabled={false}
                data={wishlistData}
                renderItem={renderWishItem}
                contentContainerStyle={{
                  padding: wp(2),
                  paddingHorizontal: wp(4),
                }}
                ItemSeparatorComponent={itemSeparatorComponent}
              />
            </View>
          )}

          <View style={styles.orderSummary}>
            {isLoding ? (
              <ShimmerLoader
  loading={isLoding} // or true
  width={hp(15)}
  height={hp(2)}
  borderRadius={hp(2)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

            ) : (
              <Text style={styles.orderSummaryText}>ORDER SUMMARY</Text>
            )}
            <View style={styles.summaryDetailsContainer}>
              <View>
                {isLoding ? (
                 <ShimmerLoader
  loading={isLoding} // or true
  width={hp(8)}
  height={hp(1.2)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(2) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

                ) : (
                  <Text style={styles.leftText1}>Sub Total</Text>
                )}

                {isLoding ? (
                  <ShimmerLoader
  loading={isLoding} // or true
  width={hp(20)}
  height={hp(1.3)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(2) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

                ) : (
                  <Text style={styles.leftText2}>
                    TOTAL (Incl of all taxes.)
                  </Text>
                )}
              </View>

              <View style={styles.orderPriceContainer}>
                {isLoding ? (
                 <ShimmerLoader
  loading={isLoding} // or true
  width={hp(6)}
  height={hp(1)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(1.5) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

                ) : (
                  <Text style={styles.leftText1}>₹ {summaryData?.total}</Text>
                )}

                {isLoding ? (
                 <ShimmerLoader
  loading={isLoding} // or true
  width={hp(7)}
  height={hp(1.3)}
  borderRadius={hp(2)}
  style={{ marginTop: hp(2.5) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

                ) : (
                  <Text style={styles.leftText2}>
                    ₹ {summaryData?.grant_total}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {isLoding ? (
            <ShimmerLoader
  loading={isLoding} // or true
  width={hp(7)}
  height={hp(1.3)}
  borderRadius={hp(2)}
  style={{
    marginVertical: hp(2),
    marginHorizontal: wp(4),
  }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

          ) : (
            <Text style={styles.addNoteText}>Add note:</Text>
          )}
          {isLoding ? (
           <ShimmerLoader
  loading={isLoding} // or true
  width={wp(70)}
  height={hp(18)}
  borderRadius={hp(1)}
  style={{ marginHorizontal: wp(4) }}
  shimmerColors={['#f1f1f1', '#ffffff', '#f1f1f1']}
/>

          ) : (
            <TouchableOpacity
              style={styles.noteInputContainer}
              onPress={writeNote}
            >
              <TextInput
                placeholder="Type your note here..."
                placeholderTextColor="#999"
                ref={ref => (noteRef = ref)}
                multiline
                style={styles.noteInputBox}
                onChangeText={handleNote}
                maxLength={300}
              />
            </TouchableOpacity>
          )}
        </>
      )),
    [isLoding, wishlistData, summaryData],
  );

  const itemSeparatorComponent = () => (
    <View style={{ borderWidth: 0.4, borderColor: '#999' }} />
  );

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="My Cart" navigation={navigation} />

        {loader && (
          <View style={styles.loaderContainer}>
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

        {(data.length !== 0 || wishlistData.length !== 0) && (
          <TouchableOpacity
            onPress={handleDeleteAll}
            style={styles.clearAllButton}
          >
            <Text style={styles.clearAllButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}

        {data.length === 0 && wishlistData.length === 0 && !isLoding ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>Cart is empty!</Text>
          </View>
        ) : (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <FlatList
              keyExtractor={(item, index) => item?.id || index}
              // scrollEnabled={false}
              data={data}
              renderItem={renderCartItem}
              ListFooterComponent={renderFooter}
              contentContainerStyle={{ paddingHorizontal: wp(4) }}
              ItemSeparatorComponent={itemSeparatorComponent}
              refreshControl={
                <RefreshControl
                  refreshing={isLoding}
                  onRefresh={handleRefresh}
                />
              }
            />
          </KeyboardAvoidingView>
        )}

        <View style={styles.bottom}>
          {isLoding ? (
           <ShimmerLoader
  loading={isLoding} // or true
  width={wp(43)}
  height={hp(5.5)}
  borderRadius={wp(1)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

          ) : (
            <TouchableOpacity
              onPress={() =>
                resetTo('Product', {
                  screen: 'AllProductsScreen',
                  params: { id: 0 },
                })
              }
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Continue Shopping</Text>
            </TouchableOpacity>
          )}

          {isLoding ? (
           <ShimmerLoader
  loading={isLoding} // or true
  width={wp(43)}
  height={hp(5.5)}
  borderRadius={wp(1)}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

          ) : (
            <TouchableOpacity
              onPress={handleOrderPlaced}
              style={styles.placeOrderButton}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Gradient>
  );
};

export default memo(MyCart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ScrollView: {
    paddingBottom: hp(3),
    paddingTop: hp(0.5),
  },
  loaderContainer: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.3)',
    zIndex: 999,
  },
  clearAllButton: {
    backgroundColor: 'red',
    paddingVertical: wp(1),
    paddingHorizontal: wp(3),
    alignSelf: 'flex-end',
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    borderRadius: wp(0.8),
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: wp(2.7),
    fontFamily: 'Roboto-Black',
  },

  homeContainer: {
    flex: 1,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    // borderTopWidth: 0.3,
    // borderBottomWidth: 0.3,
  },
  productImageContainer: {
    height: hp(12),

    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: 'row',
    flex: 1,
  },
  productImage: {
    height: '100%',
    width: hp(12),
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: hp(1),
  },
  productDetailsContainer: {
    marginLeft: wp(2),
    justifyContent: 'space-between',
    flex: 1,
  },
  productName: {
    fontFamily: 'Roboto-Bold',
    color: '#C04547',
    fontSize: wp(3.6),
    marginTop: hp(1),
    // borderWidth: 1,
  },
  // productFullName: {
  //   fontFamily: 'Roboto-Regular',
  //   fontSize: wp(2.8),
  //   // marginTop: hp(1),
  //   borderWidth: 2,
  // },
  productPrice: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.6),
    // borderWidth: 1,
  },
  wishlistContainer: {
    borderWidth: 0.5,
    marginTop: hp(2),
    paddingHorizontal: wp(3),
  },
  wishlistText: {
    color: '#000',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(2.2),
    marginTop: wp(2),
    marginBottom: wp(1),
  },
  wishlistText1: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
    fontSize: wp(2),
  },
  small: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(2.4),
  },
  productActionContainer: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  increaseButton: {
    backgroundColor: '#838383',
    paddingHorizontal: hp(1),
  },
  increaseText: {
    fontSize: wp(5),
    lineHeight: wp(5.7),
    color: '#fff',
  },
  decreaseText: {
    fontSize: wp(10),
    lineHeight: wp(5.7),
    top: hp(1.4),
    color: '#fff',
  },
  quantityInputContainer: {
    borderBottomWidth: 0.5,
    height: hp(5.5),
    marginHorizontal: wp(2),
    justifyContent: 'flex-end',
  },
  quantityInputBox: {
    textAlign: 'center',
    color: '#000',
  },
  amount: {
    fontFamily: 'Roboto-Black',
    fontSize: wp(4.8),
    marginTop: hp(2),
  },
  orderSummary: {
    backgroundColor: '#f1f1f1',
    borderRadius: hp(1),
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    marginVertical: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
  },
  orderSummaryText: {
    color: '#C04547',
    fontFamily: 'Roboto-Black',
    fontSize: wp(3.7),
    marginBottom: hp(1),
  },
  summaryDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText1: {
    fontFamily: 'Roboto-Medium',
    fontSize: wp(2.8),
    color: '#838383',
    marginVertical: hp(0.5),
  },
  leftText2: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.3),
    color: '#C04547',
    marginTop: hp(0.8),
  },
  orderPriceContainer: {
    alignItems: 'flex-end',
  },
  addNoteText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(2.8),
    color: '#C04547',
    marginVertical: hp(1),
  },
  noteInputContainer: {
    borderWidth: 0.7,
    width: wp(90.2),
    height: hp(18),
  },
  noteInputBox: {
    fontFamily: 'Roboto-BoldItalic',
    fontSize: wp(3),
    margin: wp(1),
    padding: 0,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(5),
    marginBottom: hp(8),
  },
  continueButton: {
    width: wp(43),
    height: hp(5.5),
    borderWidth: 1.2,
    borderRadius: wp(1),
    borderColor: '#C04547',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButton: {
    width: wp(43),
    height: hp(5.5),
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C04547',
  },
  continueText: {
    fontFamily: 'Roboto-Bold',
    color: '#C04547',
  },
  placeOrderText: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
});
