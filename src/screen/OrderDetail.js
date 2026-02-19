/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../components/Header';
import { BASE_URL, makeRequest } from '../api/ApiInfo';
import { showSnack } from '../components/Snackbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dateTimeFormatter } from '../components/dateTimeFormatter';
import AppAvatar from '../components/AppAvatar';
import { useIsFocused } from '@react-navigation/native';

const data = [
  { id: 1, item: 'HS1001', price: 100, quantity: 50, amount: 5000 },
  { id: 2, item: 'HS1002', price: 33, quantity: 30, amount: 990 },
  { id: 3, item: 'HS1003', price: 100, quantity: 40, amount: 4000 },
];

const OrderDetail = props => {
  const { navigation, route } = props;

  const [OrderDetails, setOrderDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const inset = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const { params } = route;

  console.log(params, 'params');

  useEffect(() => {
    if (isFocused) {
      fetchDetails(params);
    }
  }, [isFocused]);

  const fetchDetails = async order_id => {
    try {
      const response = await makeRequest(
        `${BASE_URL}customer_order_detail`,
        { order_id },
        true,
      );

      console.log(response, 'response');

      if (response) {
        const { Status, Message, Data } = response;
        console.log('order detail', response);
        if (Status === true) {
          let detail = Data.detail;
          detail = {
            ...detail,
            created_at: dateTimeFormatter(detail.created_at),
          };
          setOrderDetails({ ...Data, detail });

          setIsLoading(false);
        } else {
          showSnack(Message, null, true);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log('error print here', error);

      //  console.log(error);
    }
  };
  var total = 0;
  var mrp = 0;
  var sp = 0;
  var quantity = 0;

  // Converting in words
  var a = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ];
  var b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num)
      .slice(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
        : '';
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
        : '';
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
        : '';
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
        : '';
    str +=
      n[5] != 0
        ? (str != '' ? 'and ' : '') +
          (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
          'only '
        : '';
    return str;
  }

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    setIsLoading(true);
    fetchDetails(params);
    setIsLoading(false);
  };

  if (isLoading) {
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

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header
        title="Order Details"
        width={wp(65)}
        fontFamily="Roboto-Regular"
        navigation={navigation}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={colors}
          />
        }
      >
        {/* <SkeletonPlaceholder enabled={isLoading} backgroundColor="#c1c1c1"> */}
        <View style={styles.homeContainer}>
          <View style={styles.upperContainer}>
            <Text style={styles.orderId}>
              Order #{OrderDetails.detail.order_id}
            </Text>

            <Text style={styles.middleText}>
              ITEM(S): {OrderDetails.items.length} | TOTAL: ₹{' '}
              {OrderDetails.detail.amount}
            </Text>

            <View style={styles.upperLast}>
              <Text style={styles.upperLastText}>
                TO: {OrderDetails.vendor.name}
              </Text>
              <Text style={styles.upperLastText}>
                {OrderDetails.detail.created_at}
              </Text>
            </View>
          </View>

          <View style={styles.customerDetailsContainer}>
            <Text style={styles.customerDetailsHeader}>Vendor Details</Text>

            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>To</Text>
              <Text style={styles.fromText}>{OrderDetails.vendor.name}</Text>
            </View>

            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>Contact</Text>
              <Text
                onPress={() =>
                  Linking.openURL(`tel:${OrderDetails.vendor.mobile}`)
                }
                style={[
                  styles.fromText,
                  { color: '#000', textDecorationLine: 'underline' },
                ]}
              >
                {OrderDetails.vendor.mobile}
              </Text>
            </View>

            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>Address</Text>
              <Text style={styles.fromText}>{OrderDetails.vendor.address}</Text>
            </View>

            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>Order Status</Text>
              <Text
                style={[
                  styles.fromText,
                  {
                    color:
                      OrderDetails.detail.status === 'pending'
                        ? 'orange'
                        : OrderDetails.detail.status === 'rejected'
                        ? 'red'
                        : 'green',
                  },
                ]}
              >
                {OrderDetails.detail.status}
              </Text>
            </View>

            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>Order Note</Text>
              <Text style={styles.fromText}>
                {OrderDetails.detail.note || ''}
              </Text>
            </View>
          </View>

          <View style={styles.orderDetailsContainer}>
            <Text
              style={[styles.customerDetailsHeader, { marginBottom: hp(2) }]}
            >
              Order Details
            </Text>

            <View style={styles.orderDetailsHeaderContainer}>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 1, backgroundColor: '#d0d2ba' },
                ]}
              >
                S.No.
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 3, backgroundColor: '#d0d2ba' },
                ]}
              >
                Item
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, backgroundColor: '#d0d2ba' },
                ]}
              >
                MRP
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, backgroundColor: '#d0d2ba' },
                ]}
              >
                SP
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, backgroundColor: '#d0d2ba' },
                ]}
              >
                Quantity
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, backgroundColor: '#d0d2ba' },
                ]}
              >
                Amount
              </Text>
            </View>

            {OrderDetails.items?.map((item, index) => {
              total = total + item.total;
              mrp = mrp + item.p_mrp;
              sp = sp + item.p_price;
              quantity = quantity + item.quantity;

              return (
                <View key={item.id} style={styles.orderDetailsHeaderContainer}>
                  <Text style={[styles.orderDetailsHeaderText, { flex: 1 }]}>
                    {/* {index + 1} */}
                  </Text>
                  <View
                    style={[
                      styles.orderDetailsHeaderText,
                      styles.itemStyle,
                      {
                        flex: 3,
                        flexWrap: 'wrap',
                      },
                    ]}
                  >
                    {item.product_image ? (
                      <AppAvatar
                        source={{
                          uri: item.product_image[0],
                        }}
                        size={wp(8)}
                        containerStyle={{ margin: wp(1) }}
                      />
                    ) : (
                      <View
                        style={{
                          width: wp(8),
                          height: wp(8),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#ddd',
                          margin: wp(1),
                        }}
                      >
                        <Text
                          style={{ fontSize: wp(1.5), textAlign: 'center' }}
                        >
                          NOT AVAILABLE
                        </Text>
                      </View>
                    )}

                    <Text
                      style={{ fontSize: wp(1.8), fontFamily: 'Roboto-Black' }}
                    >
                      {item.product_name}
                    </Text>
                  </View>

                  <Text style={[styles.orderDetailsHeaderText, { flex: 2 }]}>
                    {item.p_mrp}
                  </Text>

                  <Text style={[styles.orderDetailsHeaderText, { flex: 2 }]}>
                    {item.p_price}
                  </Text>

                  <Text style={[styles.orderDetailsHeaderText, { flex: 2 }]}>
                    {item.quantity}
                    {Number(item.out_of_stock) > 0 && (
                      <Text
                        style={{
                          color: 'rgb(250, 0, 0)',
                        }}
                      >
                        {`\n`}(-{item.out_of_stock} out of stock)
                      </Text>
                    )}
                  </Text>

                  <Text style={[styles.orderDetailsHeaderText, { flex: 2 }]}>
                    {item.total}
                  </Text>
                </View>
              );
            })}
            <View style={styles.orderDetailsHeaderContainer}>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 4.14, height: hp(4), fontFamily: 'Roboto-Black' },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, fontFamily: 'Roboto-Black' },
                ]}
              >
                {mrp}
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, fontFamily: 'Roboto-Black' },
                ]}
              >
                {sp}
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, fontFamily: 'Roboto-Black' },
                ]}
              >
                {quantity}
              </Text>
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 2, fontFamily: 'Roboto-Black' },
                ]}
              >
                {total}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(3),
                marginLeft: wp(11.5),
                marginTop: hp(2),
              }}
            >
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 1, backgroundColor: '#d0d2ba' },
                ]}
              >
                Total of Amount
              </Text>

              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  {
                    flex: 2,
                    textAlign: 'right',
                    paddingRight: wp(2),
                  },
                ]}
              >
                {total}/-
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(3),
                marginLeft: wp(11.5),
                marginTop: wp(0.5),
              }}
            >
              <Text
                style={[
                  styles.orderDetailsHeaderText,
                  { flex: 1, backgroundColor: '#d0d2ba' },
                ]}
              >
                In Words
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.orderDetailsHeaderText,
                  {
                    flex: 2,
                    textAlign: 'right',
                    paddingRight: wp(2),
                  },
                ]}
              >
                [{inWords(total)}]
              </Text>
            </View>
          </View>
        </View>
        {/* </SkeletonPlaceholder> */}
      </ScrollView>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContainer: {
    flex: 1,
    marginVertical: hp(1),
    marginBottom: hp(10),
  },
  upperContainer: {
    padding: hp(1),
    backgroundColor: '#fff',
    marginHorizontal: wp(3),
    borderTopLeftRadius: hp(6),
    borderBottomRightRadius: hp(6),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    paddingBottom: 0,
  },
  upperFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
    marginLeft: wp(3),
  },
  orderId: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    color: '#000',
    marginLeft: wp(3),
    marginTop: hp(2),
  },
  actionButton: {
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(0.3),
    paddingHorizontal: wp(3),
    marginLeft: wp(3),
  },
  actionText: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.3),
  },
  middleText: {
    color: '#bb3132',
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.4),
    marginLeft: wp(3),
    marginTop: hp(2),
  },
  upperLast: {
    borderTopWidth: 0.3,
    borderColor: '#999',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: wp(2),
    paddingRight: wp(4),
    marginTop: hp(3),
  },
  upperLastText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(2.2),
    marginVertical: hp(2),
    color: '#000',
  },
  customerDetailsContainer: {
    backgroundColor: '#fff',
    marginVertical: hp(2.5),
    marginHorizontal: wp(3),
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
    paddingBottom: hp(2.2),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    borderRadius: wp(2),
  },
  customerDetailsHeader: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3.5),
    marginBottom: hp(1),
  },
  fromContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginHorizontal: wp(4),
    marginVertical: hp(1),
    borderRadius: wp(1),
  },
  fromText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(3),
    color: '#666',
    textTransform: 'capitalize',
  },
  orderDetailsContainer: {
    backgroundColor: '#fff',
    // marginVertical: hp(2.5),
    marginHorizontal: wp(3),
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
    paddingBottom: hp(2.2),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    borderRadius: wp(2),
  },
  orderDetailsHeaderContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(3),
    marginBottom: wp(0.5),
    // borderWidth: 1,
  },
  itemStyle: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetailsHeaderText: {
    fontFamily: 'Roboto-Regular',
    fontSize: wp(2.3),
    borderWidth: 0.5,
    marginLeft: wp(0.5),
    textAlign: 'center',
    textAlignVertical: 'center',
    // textTransform: 'capitalize',
  },
});
