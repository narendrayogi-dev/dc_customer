/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {
  useState,
  useEffect,
  memo,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
  ToastAndroid,
  RefreshControl,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import notifee from '@notifee/react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

//component
import Gradient from '../components/Gradient';
import Header from '../components/Header';
import {dateTimeFormatter} from '../components/dateTimeFormatter';

//image
import img_product from '../assets/image/product.png';
import ic_jewelery from '../assets/image/jewel.png';
import ic_earRing from '../assets/image/earrings.png';
import ic_next from '../assets/image/forward.png';
import ic_search from '../assets/image/loupe.png';
import ic_date from '../assets/image/schedule.png';
import ic_store_placeholder from '../assets/icons/store_placeholder.jpg';
import {StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showSnack} from '../components/Snackbar';
import {async_keys, getData} from '../api/UserPreference';
import FastImage from '@d11/react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOrderRequest} from '../redux/action/orderActions';
import {Dropdown} from 'react-native-element-dropdown';
import AppIcon from '../components/AppIcon';
import { useIsFocused } from '@react-navigation/native';
import ShimmerLoader from '../components/ShimmerLoader';
import ReactNativeBlobUtil from 'react-native-blob-util';

const dropdownData = [
  {label: 'All', value: ''},
  {label: 'Pending', value: 'Pending'},
  {label: 'Accepted', value: 'Accepted'},
  {label: 'Dispatched', value: 'Dispatched'},
  {label: 'Delivered', value: 'Delivered'},
  {label: 'Rejected', value: 'Rejected'},
];
const OrderHistory = props => {
  const {navigation} = props;

  const [toOpen, setToOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [toDateSelected, setToDateSelected] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [fromDateSelected, setFromDateSelected] = useState(false);
  const [paginationModalVisible, setPaginationModalVisible] = useState(false);
  const [values, setValue] = useState('all');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [data, setData] = useState([1, 2, 3]);
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused()

  const flatlistRef = useRef(null);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {allOrderData, filteredOrderData, othersOrderData, isLoading, loader} =
    useSelector(state => state.order);
  const {mainRoute} = useSelector(state => state.route);

  useEffect(() => {
    if (isFocused) {
      // fetchOrders();
      dispatch(fetchOrderRequest());
      clearSearch();
    }

    if (mainRoute !== 3) {
      scrollToTop();
    }
  }, [isFocused]);

  useEffect(() => {
    dateFormatter(allOrderData);
  }, [allOrderData]);

  useEffect(() => {
    const data = allOrderData;
    if (!searchText) {
      dispatch(fetchOrderRequest());
    } else {
      // let filteredData = data.filter(item => {
      //   return (
      //     item?.order_id
      //       ?.replace(/\s+/g, '')
      //       .toUpperCase()
      //       .indexOf(searchText.replace(/\s+/g, '').toUpperCase()) > -1
      //   );
      // });

      // dateFormatter(filteredData);
      setToDateSelected(false);
      setFromDateSelected(false);
      setFilterApplied(false);
      dispatch(fetchOrderRequest(`search=${searchText}`));
    }
  }, [searchText, setSearchText]);

useEffect(() => {
  const fetchToken = async () => {
    try {
      const token = await getData(async_keys.user_token);
      console.log('token print here:', token);
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  fetchToken();
}, []);


  const scrollToTop = () => {
    if (flatlistRef.current && filteredOrderData.length !== 0) {
      flatlistRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  const dateFormatter = orders => {
    let temp = orders?.map(item => ({
      ...item,
      created_at: dateTimeFormatter(item?.created_at),
    }));

    console.log('data show print heere', temp);

    setData(temp);
    // setIsLoading(false);
  };

  const filterByDate = useCallback(() => {
    if (!fromDateSelected || !toDateSelected) {
      alert('select date range');
      return true;
    }

    console.log('wjsoizjxcndbfed', toDateSelected, fromDateSelected);

    setIsDateFilterOpen(false);
    console.log(
      'from and to date 0909',
      moment(fromDate).format('DD/MM/YYYY'),
      moment(toDate).format('DD/MM/YYYY'),
    );
    dispatch(
      fetchOrderRequest(
        `from_date=${moment(fromDateSelected).format(
          'YYYY-MM-DD',
        )}&to_date=${moment(toDateSelected).format('YYYY-MM-DD')}`,
      ),
    );
    setFilterApplied(true);
  }, [fromDateSelected, toDateSelected, fromDate, toDate]);

  const handleClearFilter = () => {
    dispatch(fetchOrderRequest());
    setToDateSelected(false);
    setFromDateSelected(false);
    setFilterApplied(false);
  };

  const handleSearch = text => setSearchText(text);

  const colors = ['red', 'blue', 'green', 'orange'];
  const handleRefresh = () => {
    clearSearch();
    setToDateSelected(false);
    setFromDateSelected(false);
    setFilterApplied(false);
    dispatch(fetchOrderRequest());
  };




const handleDownload = async (url) => {
  try {
    setDownloadLoader(true);

    const { fs, config } = ReactNativeBlobUtil;

    const fileName = url.split('/').pop() || `invoice_${Date.now()}.pdf`;

    const downloadPath =
      Platform.OS === 'android'
        ? `${fs.dirs.DownloadDir}/${fileName}`
        : `${fs.dirs.DocumentDir}/${fileName}`;

    await config({
      fileCache: true,
      path: downloadPath,
      addAndroidDownloads: Platform.OS === 'android'
        ? {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description: 'Downloading file...',
            mime: 'application/pdf',
            path: downloadPath,
          }
        : undefined,
    }).fetch('GET', url);

    if (Platform.OS === 'android') {
      ToastAndroid.show('File downloaded to Downloads', ToastAndroid.SHORT);
    } else {
      Alert.alert('Downloaded', 'File saved successfully');
    }

  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Unable to download file');
  } finally {
    setDownloadLoader(false);
  }
};


  const RenderOrders = useMemo(
    () =>
      memo(({item, index}) => (
        <View key={item?.id} style={styles.orderContainer}>
          <View
            style={[
              {
                flex: 1,
                marginTop: hp(-1.8),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              },
              isLoading && {height: hp(2)},
            ]}>
            {!isLoading && (
              <Text
                numberOfLines={1}
                style={{
                  color: '#000',
                  fontSize: wp(2.5),
                  fontFamily: 'Roboto-Bold',
                }}>
                #{item?.order_id}
              </Text>
            )}

            {!isLoading && (
              <Text style={styles.orderDate}>{item?.created_at}</Text>
            )}

            {!isLoading && (
              <Text
                style={[
                  styles.orderStatusText,
                  item?.status === 'pending' && {color: 'orange'},
                  item?.status === 'rejected' && {color: 'red'},
                ]}>
                {item?.status}
              </Text>
            )}
          </View>

          <View style={styles.orderSubContainer}>
            {/* <View style={{borderWidth: 1}}> */}
            {isLoading ? (
              <ShimmerLoader
  loading={isLoading} // or true
  width={hp(10)}
  height={hp(10)}   // aspectRatio 1:1
  borderRadius={wp(1.5)}
  style={{ marginTop: hp(0.5) }}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

            ) : item?.vendor_image ? (
              <FastImage
                source={{
                  uri: item?.vendor_image,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                defaultSource={ic_store_placeholder}
                style={{
                  width: hp(10),
                  borderRadius: wp(1),
                  aspectRatio: 1 / 1,
                  backgroundColor: '#ddd',
                  marginTop: hp(0.5),
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            ) : (
              <View
                style={{
                  width: hp(10),
                  height: hp(10),
                  // margin: hp(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ddd',
                  borderRadius: wp(1),
                  marginTop: hp(0.5),
                }}>
                <Text style={{textAlign: 'center'}}>
                  {item?.store_name || ''}
                </Text>
              </View>
            )}
            {/* </View> */}

            <View style={styles.orderTextsContainer}>
              {isLoading ? (
                <ShimmerLoader
  loading={isLoading} // or true
  width={wp(30)}
  height={hp(1.3)}
  borderRadius={wp(1.5)}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

              ) : (
                <Text style={[styles.orderListDetailsText, {color: '#000'}]}>
                  To: {item?.vendor_name}
                </Text>
              )}
              {isLoading ? (
                <ShimmerLoader
  loading={isLoading} // or true
  width={wp(30)}
  height={hp(1.3)}
  borderRadius={wp(1.5)}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

              ) : (
                <Text style={styles.orderListDetailsText}>
                  Items: {item?.total_item}
                </Text>
              )}
              {isLoading ? (
                <ShimmerLoader
  loading={isLoading} // or true
  width={wp(37)}
  height={hp(1.3)}
  borderRadius={wp(1.7)}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

              ) : (
                <Text style={styles.orderListDetailsText}>
                  Total Amount: {item?.amount}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.orderListActionContainer}>
          {isLoading ? (
  <ShimmerLoader
    loading={true}
    width={wp(30)}
    height={hp(3.3)}
    borderRadius={wp(1)}
    shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
  />
) : (
  <TouchableOpacity
    onPress={() => {
      if (item?.status === 'pending') {
        Alert.alert('Your order is not accepted yet');
      } else {
        handleDownload(item?.order_invoice);
      }
    }}
    style={styles.downloadButton}
  >
    <Text style={styles.downloadButtonText}>Download</Text>
    <AppIcon type="fa" name="download" size={wp(4.5)} />
  </TouchableOpacity>
)}

            {isLoading ? (
              <ShimmerLoader
  loading={isLoading} // or true
  width={wp(30)}
  height={hp(3.3)}
  borderRadius={wp(1)}
  shimmerColors={['#E5E4E2', '#f2f2f2', '#E5E4E2']}
/>

            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('OrderDetailScreen', item?.id)
                }
                style={[styles.downloadButton, styles.orderDetailsButton]}>
                <Text
                  style={[
                    styles.downloadButtonText,
                    styles.orderDetailsButtonText,
                  ]}>
                  Order Detail
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )),
    [allOrderData],
  );

  const dateFilterUi = useMemo(
    () =>
      isDateFilterOpen && (
        <View
          style={{
            flex: 1,
            height: hp(100),
            width: wp(100),
            backgroundColor: 'rgba(0,0,0,.5)',
            position: 'absolute',
            zIndex: 99,
          }}>
          <View style={[styles.modalHomeContainer, styles.modal]}>
            <AppIcon
              onPress={() => {
                setFromDateSelected(false);
                setToDateSelected(false);
                setIsDateFilterOpen(false);
              }}
              type="entypo"
              name="circle-with-cross"
              color="red"
              containerStyle={{
                position: 'absolute',
                right: 0,
              }}
            />
            <View style={[styles.datePickers]}>
              <View style={styles.fromDateContainer}>
                <Text style={[styles.boldest]}>From:</Text>

                <TouchableOpacity
                  style={styles.datePickerContainer}
                  onPress={() => setFromOpen(true)}>
                  <Image source={ic_date} style={styles.searchIcon} />

                  <Text
                    style={[
                      styles.searchInput,
                      styles.textGrey,

                      fromDateSelected && styles.boldest,
                    ]}>
                    {fromDateSelected
                      ? moment(fromDate).format('DD/MM/YYYY')
                      : 'From'}
                  </Text>

                  <DatePicker
                    modal
                    androidVariant="iosClone"
                    mode="date"
                    open={fromOpen}
                    date={fromDate}
                    theme="light"
                    textColor="#000"
                    maximumDate={toDateSelected ? toDate : new Date()}
                    onConfirm={d => {
                      setFromOpen(false);
                      setFromDate(d);
                      setFromDateSelected(true);
                    }}
                    onCancel={() => {
                      setFromOpen(false);
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.fromDateContainer}>
                <Text style={styles.boldest}>To:</Text>

                <TouchableOpacity
                  disabled={!fromDateSelected}
                  style={[
                    styles.datePickerContainer,
                    !fromDateSelected && {
                      opacity: 0.5,
                      elevation: 0,
                      shadowOpacity: 0,
                      shadowRadius: 0,
                      shadowOffset: {width: 0, height: 0},
                    },
                  ]}
                  onPress={() => setToOpen(true)}>
                  <Image source={ic_date} style={styles.searchIcon} />

                  <Text
                    style={[
                      styles.searchInput,
                      styles.textGrey,
                      toDateSelected ? styles.boldest : null,
                    ]}>
                    {toDateSelected
                      ? moment(toDate).format('DD/MM/YYYY')
                      : 'To'}
                    {/* {toDateSelected ? toDate : 'To'} */}
                  </Text>

                  <DatePicker
                    modal
                    androidVariant="iosClone"
                    theme="light"
                    textColor="#000"
                    mode="date"
                    open={toOpen}
                    date={toDate}
                    // maximumDate={fromDate} // To ensure `toDate` is before `fromDate`
                    onConfirm={d => {
                      setToOpen(false);
                      setToDate(d);
                      setToDateSelected(true);
                    }}
                    onCancel={() => setToOpen(false)}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={filterByDate}
              style={styles.lower}
              activeOpacity={0.8}>
              <View style={styles.upper}>
                <Text style={styles.buttonText}>Apply</Text>
              </View>

              <Image source={ic_next} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
        </View>
      ),
    [
      isDateFilterOpen,
      fromOpen,
      toOpen,
      fromDateSelected,
      toDateSelected,
      toDate,
      fromDate,
      filterByDate,
    ],
  );

  const handleJumpToPage = page => {
    setPaginationModalVisible(false);

    if (page < 1 || page > othersOrderData?.last_page) false;

    dispatch(
      fetchOrderRequest(
        `page=${page}${
          filterApplied
            ? `from_date=${moment(fromDate).format(
                'DD/MM/YYYY',
              )}&to_date=${moment(toDate).format('DD/MM/YYYY')}`
            : ''
        }`,
      ),
    );
    scrollToTop();
  };

  const renderDdItem = item => (
    <Text
      style={{paddingHorizontal: 10, paddingVertical: 8, fontSize: wp(2.7)}}>
      {item.label}
    </Text>
  );

  const listFooterComponent = () =>
    !isLoading && (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: hp(3),
            // marginHorizontal: wp(25),
          }}>
          <Text style={{fontSize: wp(2.3), fontFamily: 'Roboto-Black'}}>
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
            }}>
            <Text
              style={{
                fontSize: wp(2.3),
                fontFamily: 'Roboto-Black',
              }}>
              {othersOrderData?.current_page}
            </Text>

            <Modal
              useNativeDriver
              onBackButtonPress={() => {
                setPaginationModalVisible(false);
              }}
              onBackdropPress={() => setPaginationModalVisible(false)}
              isVisible={paginationModalVisible}>
              <View
                style={{
                  height: 300,
                  backgroundColor: '#fff',
                  borderRadius: hp(1),
                }}>
                <FlatList
                  keyExtractor={(item, index) => item?.id || index}
                  data={Array(othersOrderData?.last_page).fill(0)}
                  contentContainerStyle={{padding: hp(2)}}
                  renderItem={({_, index}) => (
                    <TouchableOpacity
                      onPress={() => handleJumpToPage(index + 1)}
                      style={{
                        backgroundColor: '#FFF',
                        elevation: 5,
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        shadowOffset: {width: 0, height: 1},
                        marginVertical: hp(0.5),
                        paddingHorizontal: wp(4),
                        paddingVertical: hp(1),
                        borderRadius: hp(0.7),
                      }}>
                      <Text>Page {index + 1}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Modal>
          </TouchableOpacity>

          {/* ###################### */}
          <Text style={{fontSize: wp(2.3), fontFamily: 'Roboto-Black'}}>
            of {` `}{' '}
            <Text style={{fontSize: wp(3)}}>{othersOrderData?.last_page}</Text>
          </Text>
        </View>
        <Text
          style={{
            fontSize: wp(2.3),
            fontFamily: 'Roboto-Black',
            textAlign: 'center',
            marginVertical: hp(1),
          }}>
          ({othersOrderData.to} of total {othersOrderData?.total} Products)
        </Text>

        <View
          style={{
            flexDirection: 'row',
            // borderWidth: 1,
            paddingVertical: 5,
            marginHorizontal: wp(4),
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            disabled={othersOrderData?.current_page === 1}
            onPress={() => handleJumpToPage(othersOrderData?.current_page - 1)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersOrderData?.current_page === 1 ? '#ccc' : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation: othersOrderData?.current_page === 1 ? 0 : 2,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {width: 0, height: 1},
            }}>
            <Text style={{fontFamily: 'Roboto-Black', fontSize: wp(2.2)}}>
              Prev
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              othersOrderData?.current_page === othersOrderData?.last_page
            }
            onPress={() => handleJumpToPage(othersOrderData?.current_page + 1)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersOrderData?.current_page === othersOrderData?.last_page
                  ? '#ccc'
                  : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation:
                othersOrderData?.current_page === othersOrderData?.last_page
                  ? 0
                  : 2,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {width: 0, height: 1},
            }}>
            <Text style={{fontFamily: 'Roboto-Black', fontSize: wp(2.2)}}>
              Next
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              othersOrderData?.current_page === othersOrderData?.last_page
            }
            onPress={() => handleJumpToPage(othersOrderData?.last_page)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                othersOrderData?.current_page === othersOrderData?.last_page
                  ? '#ccc'
                  : 'skyblue',
              paddingHorizontal: wp(5),
              paddingVertical: wp(1),
              borderRadius: wp(1),
              elevation:
                othersOrderData?.current_page === othersOrderData?.last_page
                  ? 0
                  : 2,
              shadowOpacity: 0.3,
              shadowRadius: 2,
              shadowOffset: {width: 0, height: 1},
            }}>
            <Text style={{fontFamily: 'Roboto-Black', fontSize: wp(2.2)}}>
              Last
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );

  const clearSearch = () => {
    setSearchText('');
  };

  const selectFilter = async item => {
    console.log('Selected filter:', item);
    setValue(item.value); // Update value on selection
    setSearchText('');

    dispatch(fetchOrderRequest(`status=${item.value}`));
    // dispatch(fetchOrderHistoryRequest(`status=${item.label}`));
    // dispatch(filterOrderByStatus(`status=${item.value}`));\
    // dispatch(fetchOrderHistoryRequest(`status=${item.value}`));
  };

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff" gh="40%">
      <View style={[styles.container, {paddingTop: inset.top}]}>
        {dateFilterUi}

        <Header
          title="Order History"
          width={wp(70)}
          navigation={navigation}
          // goBack="HomeScreen"
        />

        {(downloadLoader || (Platform.OS === 'ios' && loader)) && (
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

        <View style={styles.search_Filter}>
          <View style={styles.searchContainer}>
            <Image source={ic_search} style={styles.searchIcon} />
            <TextInput
              placeholder="Search Order"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearch}
            />
            {searchText && (
              <TouchableOpacity style={{marginRight: 5}} onPress={clearSearch}>
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
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
            justifyContent: 'space-between',
          }}>
          <View style={styles.inputContainer}>
            <Dropdown
              style={styles.dropDownBox}
              placeholderStyle={styles.dropDownPlaceholder}
              selectedTextStyle={styles.dropDownSelectedText}
              data={dropdownData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
              value={values}
              onChange={selectFilter}
              renderItem={renderDdItem}
              renderRightIcon={() => (
                <AppIcon
                  type="ionicon"
                  name="caret-down-outline"
                  color="#999"
                  size={wp(5)}
                  iconStyle={{left: wp(0.9)}}
                />
              )}
            />
          </View>

          {/* <TouchableOpacity
            style={styles.dateFilterContainer}
            onPress={() => {
              clearSearch();
              setIsDateFilterOpen(true);
            }}>
            <Image source={ic_date} style={styles.searchIcon} />
            {filterApplied ? (
              <Text
                style={[
                  styles.searchInput,

                  {marginLeft: wp(2), color: '#000', fontFamily: 'Roboto-Bold'},
                ]}>
                {`${moment(fromDate)
                  .format('DD/MM/YYYY')
                  .split('/')[0]
                  .trim()}/${moment(fromDate)
                  .format('DD/MM/YYYY')
                  .split('/')[1]
                  .trim()} - ${moment(toDate)
                  .format('DD/MM/YYYY')
                  .split('/')[0]
                  .trim()}/${moment(toDate)
                  .format('DD/MM/YYYY')
                  .split('/')[1]
                  .trim()}`}
              </Text>
            ) : (
              <Text
                style={[
                  styles.searchInput,
                  styles.textGrey,
                  {marginLeft: wp(2)},
                ]}>
                Filter By Date
              </Text>
            )}

            {filterApplied && (
              <TouchableOpacity
                style={{
                  right: 3,
                  top: 3,
                  alignSelf: 'flex-end',
                  position: 'absolute',
                }}
                onPress={handleClearFilter}>
                <Icon
                  activeOpacity={1}
                  type="entypo"
                  name="circle-with-cross"
                  color="#999"
                  size={wp(6)}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity> */}
        </View>

        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <View style={styles.homeContainer}>
            {allOrderData.length === 0 && !isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>No orders found</Text>
              </View>
            ) : (
              <FlatList
                ref={flatlistRef}
                // bounces={false}
                keyExtractor={(item, index) => item?.id || index}
                data={data}
                ListFooterComponent={listFooterComponent}
                renderItem={({item, index}) => (
                  <RenderOrders item={item} index={index} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={loader}
                    onRefresh={handleRefresh}
                    colors={colors}
                  />
                }
                contentContainerStyle={{
                  paddingHorizontal: wp(5),
                  paddingTop: wp(2),
                  paddingBottom: hp(10),
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Gradient>
  );
};

export default memo(OrderHistory);

const styles = StyleSheet.create({
  textGrey: {color: '#838383'},
  boldest: {fontFamily: 'Roboto-Bold'},

  backgroundGrey: {
    color: '#838383',
  },
  container: {
    flex: 1,
  },
  search_Filter: {
    flexDirection: 'row',
    marginTop: hp(1),
    marginBottom: hp(1),
    // borderWidth: 1,
    marginHorizontal: wp(5),
  },
  searchContainer: {
    height: hp(4),
    flex: 1.4,
    borderColor: '#707070',
    borderWidth: 0.5,
    borderRadius: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(2),
    backgroundColor: '#fff',
    elevation: 7,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
    marginRight: wp(5),
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontFamily: 'Roboto-Regular',
    marginLeft: wp(1),
    paddingVertical: 0,
    fontSize: wp(3),
  },
  dateFilterContainer: {
    height: hp(4),
    // flex: 1,
    width: wp(40),
    // width: wp(83.5),
    borderColor: '#707070',
    borderWidth: 0.5,
    borderRadius: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(2),
    backgroundColor: '#fff',
    elevation: 7,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    marginLeft: 20,
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  homeContainer: {
    flex: 1,
  },
  orderContainer: {
    borderWidth: 0.3,
    borderColor: '#c1c1c1',
    backgroundColor: '#fff',
    width: wp(90),
    borderRadius: hp(1),
    marginVertical: hp(0.7),
    padding: hp(2),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
  },
  orderSubContainer: {
    borderBottomWidth: 0.4,
    borderBottomColor: '#c1c1c1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp(1),
  },
  orderTextsContainer: {
    marginVertical: hp(0.5),
    justifyContent: 'space-between',
    right: wp(14),
    // borderWidth: 1,
  },
  orderStatusText: {
    color: 'green',
    fontSize: wp(3.2),
    fontFamily: 'Roboto-Bold',
    alignSelf: 'flex-end',
    textTransform: 'capitalize',
  },
  orderListDetailsText: {
    color: '#999',
    fontSize: wp(3),
    fontFamily: 'Roboto-Medium',
  },
  orderListActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  downloadButton: {
    borderWidth: 1,
    borderColor: '#838383',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: wp(30),
    borderRadius: wp(1),
    padding: wp(0.5),
  },
  downloadButtonText: {
    fontSize: wp(3.5),
    fontWeight: '600',
  },
  orderDetailsButtonText: {
    color: '#F6CE4B',
    textTransform: 'uppercase',
  },
  orderDetailsButton: {
    borderColor: '#F6CE4B',
  },
  orderDate: {
    color: '#b1b1b1',
    fontSize: wp(2.3),
    alignSelf: 'center',
    fontFamily: 'Roboto-Black',
  },
  lower: {
    backgroundColor: '#29B1F4',
    width: wp(40),
    height: hp(4.3),
    borderRadius: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
    marginVertical: hp(5),
  },
  backIcon: {
    width: wp(8),
    height: hp(2.8),
  },
  upper: {
    backgroundColor: '#fff',
    width: wp(32),
    height: hp(4.3),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: wp(3.5),
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: hp(1),
    marginTop: hp(18),
    // marginTop: hp(18),
    // marginHorizontal: wp(4),
    alignSelf: 'center',
    elevation: 5,
  },
  modalHomeContainer: {
    // flex: 1,
    padding: hp(2),
    position: 'absolute',
    zIndex: 99,
  },
  fromDateContainer: {
    height: hp(9),
    justifyContent: 'space-between',
    marginRight: wp(3),
    // borderWidth: 1,
  },
  datePickers: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: hp(3),
    marginBottom: hp(1),
    // borderWidth: 1,
    // flex: 1,
  },
  datePickerContainer: {
    height: hp(4),
    // flex: 1,
    width: wp(40),
    // width: wp(83.5),
    borderColor: '#707070',
    borderWidth: 0.5,
    borderRadius: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(4),
    backgroundColor: '#fff',
    // marginHorizontal: wp(3),
    elevation: 7,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
  },
  inputContainer: {
    borderWidth: 0.5,
    borderRadius: wp(1),
    height: hp(3.5),
    width: wp(29),
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  dropDownBox: {
    flex: 1,
  },
  dropDownSelectedText: {
    fontSize: wp(2.5),
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  dropDownPlaceholder:{
    fontSize: wp(2.5),
  }
});
