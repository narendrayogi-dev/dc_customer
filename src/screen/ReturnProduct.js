/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Dropdown} from 'react-native-element-dropdown';

//component
import Header from '../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  returnProductData,
  returnProductData2,
  returnProductDeleteData,
} from './returnProductApi/returnProductPresenter';
import {
  ReturnProductView,
  ReturnProductSubmitView,
  ReturnProductDeleteView,
} from './returnProductApi/returnProductView';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {Image} from 'react-native';
import {showSnack} from '../components/Snackbar';
import {async_keys, getData} from '../api/UserPreference';
import AppIcon from '../components/AppIcon';

const ReturnProduct = ({navigation}) => {
  const [reason, setReason] = useState([]);

  const [value, setValue] = useState(null);
  const [productName, setProductName] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [returnList, setReturnList] = useState();
  const [loader, setLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const inset = useSafeAreaInsets();

  const [returnProductDetails, setReturnProductDetails] = useState([
    {
      date: 16,
      first: true,
      productName: 'Golden Necklace',
      quantity: 100,
      price: 4000,
      reason: 'Not SOLD',
    },
    {
      date: 16,
      productName: 'Golden Necklace',
      quantity: 100,
      price: 4000,
      reason: 'Not SOLD',
    },
    {
      date: 15,
      first: true,
      productName: 'Golden Necklace',
      quantity: 80,
      price: 3000,
      reason: 'Not SOLD',
    },
  ]);

  const returnProductView: ReturnProductView = {
    returnProductSuccess: res => {
      console.log('returnProductData result print', res);
      if (res) {
        setLoader(false);
        setReturnList(res?.data);
        console.log('returnProductData result print data', res.data);
      }
    },
    returnProductFailure: err => {
      setLoader(false);
    },
  };

  const returnProductSubmitView: ReturnProductSubmitView = {
    returnProductSubmitSuccess: result => {
      console.log('returnProductData result submit', result);
      setLoader(false);
      if (result) {
        if (result?.Error) {
          Alert.alert(result?.Error?.name);
        } else {
          showSnack('Return Product Successfully');
          // setReason([]);
          setProductName('');
          setQuantity('');
          setPrice('');
          setValue(null);
        }
        returnProductData(returnProductView);
      }
    },
    returnProductSubmitFailure: err => {
      setLoader(false);
    },
  };

  const returnProductDeleteView: ReturnProductDeleteView = {
    returnProductDeleteSuccess: result => {
      setLoader(false);
      returnProductData(returnProductView);
    },
    returnProductDeleteFailure: err => {
      setLoader(false);
    },
  };

  useEffect(() => {
    returnProductData(returnProductView);
    api();
  }, []);

  const api = async () => {
    const token = await getData(async_keys.user_token);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    const url = new URL(`${BASE_URL}general_settings`);
    console.log('Constructed URL:', url.toString()); // Log the URL for debugging

    try {
      const response = await fetch(url, {method: 'GET', headers});

      console.log('Response Status:', response.status);
      console.log('Response Headers:', [...response.headers.entries()]);

      // Log raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw Response Body:', rawResponse);

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${response.statusText}`,
        );
      }

      // Parse JSON if the response body exists
      const jsonResponse = rawResponse ? JSON.parse(rawResponse) : null;
      console.log('Parsed JSON Response:', jsonResponse.return_reasons);
      let arr = [];
      jsonResponse.return_reasons.map(item => {
        console.log('sjdhsjfdsn', item);
        let obj = {label: item, value: item};
        arr.push(obj);
      });

      console.log('sjdhsjfdsn', arr);

      setReason(arr);
      // setTemplateList(jsonResponse.promition_template);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = () => {
    returnProductData(returnProductView);
  };

  // useEffect(() => {
  //   console.log('reason print here ', reason);
  // }, [reason]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
      }
      style={[
        styles.container,
        {paddingTop: inset.top, paddingBottom: inset.bottom},
      ]}>
      <Header
        style={{marginBottom: hp(3)}}
        title="Return Products"
        width={wp(73)}
        navigation={navigation}
      />

      <ScrollView>
        <View style={styles.homeContainer}>
          <View style={styles.productDetailContainer}>
            <Text style={styles.productDetailText}>PRODUCT DETAILS</Text>

            <View style={styles.productDetailHomeContainer}>
              <View style={styles.leftInputField}>
                <Text style={styles.productNameHeading}>Product Name*</Text>

                <View style={styles.productNameInputContainer}>
                  <TextInput
                    placeholder="Product Name"
                    placeholderTextColor="#999"
                    style={styles.prouctNameInputBox}
                    value={productName}
                    onChangeText={text => {
                      setProductName(text);
                    }}
                  />
                </View>

                <Text style={styles.productNameHeading}>Quantity*</Text>

                <View style={styles.productNameInputContainer}>
                  <TextInput
                    placeholder="Quantity"
                    placeholderTextColor="#999"
                    style={styles.prouctNameInputBox}
                    value={quantity}
                    onChangeText={text => {
                      setQuantity(text);
                    }}
                  />
                </View>
              </View>

              <View style={styles.rightInputField}>
                <Text style={styles.productNameHeading}>Reason*</Text>

                <View style={[styles.productNameInputContainer]}>
                  <Dropdown
                    style={styles.dropDown}
                    placeholderStyle={styles.dropDownPlaceholder}
                    selectedTextStyle={styles.dropDownSelectedText}
                    data={reason}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Reason"
                    value={value}
                    onChange={item => {
                      setValue(item.value);
                    }}
                    renderRightIcon={() => (
                      <AppIcon
                        type="antdesign"
                        name="caret-down"
                        color="#838383"
                        size={wp(5.5)}
                        containerStyle={{top: hp(-0.3)}}
                      />
                    )}
                  />
                </View>

                <Text style={styles.productNameHeading}>Price*</Text>

                <View style={styles.productNameInputContainer}>
                  <TextInput
                    placeholder="Price"
                    placeholderTextColor="#999"
                    style={styles.prouctNameInputBox}
                    value={price}
                    onChangeText={text => {
                      setPrice(text);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={async () => {
              let formData = new FormData();
              formData.append('name', productName);
              formData.append('quantity', quantity);
              formData.append('reasons', value);
              formData.append('price', price);
              console.log('customer_return_product data', formData);
              returnProductData2(returnProductSubmitView, formData);
              setLoader(true);
            }}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <Text style={styles.returnDetailHeading}>RETURN PRODUCT DETAILS</Text>

          {/* {returnList?.length > 0 &&
            returnList.map((item, index) => (
             
            ))} */}

          <FlatList
            data={returnList}
            contentContainerStyle={{paddingBottom: 100}}
            renderItem={({item, index}) => {
              return (
                <View key={index}>
                  {/* {item.first ? (
                  <Text style={styles.returnDetailDate}>
                    {item.date}-02-2023
                  </Text>
                ) : null} */}
                  <View
                    key={index}
                    style={[
                      styles.productDetailContainer,
                      {marginVertical: hp(1)},
                    ]}>
                    <View style={styles.productDetailHomeContainer}>
                      <View>
                        <Text style={styles.greyBold}>Product Name:</Text>
                        <Text style={styles.blackBold}>{item.name}</Text>

                        <View
                          style={{flexDirection: 'row', marginTop: hp(0.5)}}>
                          <Text style={[styles.greyBold]}>Reason:{'   '}</Text>
                          <Text
                            style={[styles.blackBold, {marginLeft: 'auto'}]}>
                            {item.reasons}
                          </Text>
                        </View>
                      </View>

                      <View style={{}}>
                        {/* <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              'Delete Product?',
                              'Are you sure you want to delete.',
                              [
                                {
                                  text: 'No',
                                  style: 'cancel',
                                },
                                {
                                  text: 'Yes',
                                  onPress: async () => {
                                    console.log('item for delte', item.id);
                                    let data = {
                                      id: item.id,
                                    };

                                    try {
                                      // const params_url = action?.payload || '';
                                      const token = await getData(
                                        async_keys.user_token,
                                      );

                                      const myHeaders = new Headers();
                                      myHeaders.append(
                                        'Authorization',
                                        `Bearer ${token}`,
                                      );

                                      const requestOptions = {
                                        method: 'GET',
                                        headers: myHeaders,
                                        redirect: 'follow',
                                      };

                                      const response = await fetch(
                                        `${BASE_URL}customer_return_product_delete?${item.id}`,
                                        requestOptions,
                                      );

                                      // Handle the response here
                                      const responseData =
                                        await response.json();

                                      console.log(
                                        'djhernbwesfdhjne rfdx',
                                        JSON.stringify(response),
                                      );
                                      if (response.ok) {
                                        returnProductData(returnProductView);
                                      }
                                    } catch (error) {
                                      // Handle any errors that occurred during the request
                                      console.log('errrorrrrrrrr', error);
                                    }

                                    // returnProductDeleteData(
                                    //   returnProductDeleteView,
                                    //   data,
                                    // );
                                    // setLoader(true);
                                  },
                                },
                              ],
                            );
                            // let data = {
                            //   id: item.id,
                            // };
                            // returnProductDeleteData(
                            //   returnProductDeleteView,
                            //   data,
                            // );
                            // setLoader(true);
                          }}>
                          <Image
                            source={require('../assets/image/bin.png')}
                            style={{height: 25, width: 25, marginLeft: 45}}
                          />
                        </TouchableOpacity> */}

                        <View style={{marginTop: 10}}>
                          <Text style={styles.greyBold}>
                            Quantity:{' '}
                            <Text style={styles.blackBold}>
                              {item.quantity}
                            </Text>
                          </Text>
                          <Text style={styles.greyBold}>
                            Price:{' '}
                            <Text style={styles.blackBold}>{item.sp}</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>

      {loader && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            width: wp(100),
            height: hp(100),
            backgroundColor: 'rgba(255,255,255, .5)',
          }}>
          <ActivityIndicator color="#000080" size="large" />
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
    </ScrollView>
  );
};

export default ReturnProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
    padding: hp(1.5),
  },
  productDetailContainer: {
    backgroundColor: '#fff',
    borderRadius: hp(1),
    elevation: 10,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {width: 1, height: 1},
  },
  productDetailText: {
    borderBottomWidth: 0.3,
    borderColor: '#999',
    textAlign: 'center',
    padding: hp(1),
    color: '#838383',
    fontWeight: '900',
    fontFamily: 'roboto-black',
  },
  productDetailHomeContainer: {
    padding: hp(1.2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftInputField: {
    flex: 1,
  },
  productNameHeading: {
    marginVertical: hp(1),
    fontFamily: 'Roboto-Bold',
  },
  productNameInputContainer: {
    height: hp(3.8),
    // borderWidth: 0.3,
    borderRadius: hp(1.1),
    marginBottom: hp(3),
    elevation: 5,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    backgroundColor: '#fff',
  },
  prouctNameInputBox: {
    flex: 1,
    fontSize: wp(2.8),
    color: '#000',
    fontFamily: 'Roboto-Medium',
    paddingVertical: 0,
    paddingHorizontal: wp(1),
  },
  rightInputField: {
    flex: 1,
    marginLeft: wp(5),
  },
  dropDown: {
    flex: 1,
    marginHorizontal: wp(1.5),
    paddingHorizontal: 8,
  },
  dropDownPlaceholder: {
    fontSize: wp(2.8),
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: '#999',
  },
  dropDownSelectedText: {
    fontSize: wp(2.8),
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    color: '#838383',
  },
  addProductButton: {
    backgroundColor: '#838383',
    width: wp(35),
    borderRadius: wp(2),
    alignItems: 'center',
    height: hp(5),
    justifyContent: 'center',
    marginVertical: hp(3),
    elevation: 3,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {width: 1, height: 1},
  },
  addProductButtonText: {
    color: '#fff',
    fontSize: wp(4.2),
    // fontWeight: '900',
    fontFamily: 'Roboto-Bold',
  },
  submitButton: {
    backgroundColor: '#F3C62E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(0.5),
    height: hp(6),
    elevation: 3,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {width: 1, height: 2},
    marginVertical: hp(2),
  },
  submitButtonText: {
    color: '#000',
    // fontWeight: '900',
    fontFamily: 'Roboto-Bold',
  },
  returnDetailHeading: {
    color: '#838383',
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.6),
    marginVertical: hp(1.5),
  },
  returnDetailDate: {
    color: '#656565',
    fontFamily: 'Roboto-Medium',
    fontSize: wp(3.2),
    marginVertical: hp(1),
  },
  greyBold: {
    color: '#838383',
    fontFamily: 'Roboto-Bold',
    // fontWeight: '700',
    marginBottom: hp(1),
  },
  blackBold: {
    color: '#000',
    fontFamily: 'Roboto-Medium',
    // fontWeight: '700',
    marginBottom: hp(1),
  },
});
