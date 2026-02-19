/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';
//Component
import Gradient from '../components/Gradient';
import Header from '../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchMuteNotificationRequest,
  fetchNotificationRequest,
} from '../redux/action/notificationActions';
import {call} from 'redux-saga/effects';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {async_keys, getData} from '../api/UserPreference';
import AppIcon from '../components/AppIcon';
import ShimmerLoader from '../components/ShimmerLoader';

const NotificationScreen = ({navigation}) => {
  // const {isNotify, isLoading, loader} = useSelector(
  //   state => state.notification,
  // );
  const [mute, setMute] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {allNotificationData, filteredNotificationData, isLoding, error} =
    useSelector(state => state.notification);

  useEffect(() => {
    dispatch(fetchNotificationRequest());
  }, [dispatch]);

  const [data, setData] = useState([
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
    {
      title: 'New Earring Arrive',
      detail: 'Check out new sterling silver stone earring',
      date: '21-Dec-2022',
    },
  ]);

  const headerRightIcon = (
    <View style={styles.rightIconContainer}>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Update Notification Status',
            !mute
              ? 'Are you sure you want to enable'
              : 'Are you sure you want to disable',
            [
              {
                text: 'No',
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  dispatch(fetchMuteNotificationRequest());
                  setMute(!mute);
                },
              },
            ],
          );
        }}>
        <Image
          source={
            mute == 0
              ? require('../assets/icons/silentOff.png')
              : require('../assets/icons/silent.png')
          }
          style={{height: 22, width: 22}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        // key={item?.id?.toString()}
        onPress={() => {
          setModalVisible(true);
        }}>
        <AppIcon
          // key={item?.id?.toString()}
          type="materialIcons"
          name="dots-vertical"
          color="#999"
          size={wp(6)}
          containerStyle={styles.optionContainer}
        />
      </TouchableOpacity>
    </View>
  );

  const renderNotification = ({item, index}) => (
    <View key={index} style={styles.notificationContainer}>
      {isLoding ? (
       <ShimmerLoader
  loading={true}   // or isLoading
  width={wp(14)}
  height={wp(14)}
  borderRadius={wp(10)}
  style={{ margin: wp(2.3) }}
  shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
/>

      ) : (
        <AppIcon
          type="fa"
          name="bell"
          color="#EBB100"
          iconStyle={{fontSize: wp(7)}}
        />
      )}

      <View style={{flex: 1, marginLeft: wp(2)}}>
        {isLoding ? (
         <View>
  <ShimmerLoader
    loading={true} // or isLoading
    width={wp(40)}
    height={wp(3.7)}
    borderRadius={wp(1)}
    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
  />

  <ShimmerLoader
    loading={true} // or isLoading
    width={wp(65)}
    height={wp(2.6)}
    borderRadius={wp(1)}
    style={{ marginTop: wp(1) }}
    shimmerColors={['#c1c1c1', '#d6d6d6', '#c1c1c1']}
  />
</View>

        ) : (
          <>
            <Text numberOfLines={2} style={styles.notificationTitle}>
              {item?.title}
            </Text>
            <Text numberOfLines={1} style={styles.notificationDetails}>
              {item?.body}
            </Text>
          </>
        )}
      </View>

      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        {!isLoding && (
          <>
            <Text style={styles.date}>{item?.datePart}</Text>
            <Text style={styles.date}>{item?.timePart}</Text>
          </>
        )}
      </View>
    </View>
  );
  return (
    <View style={{flex: 1}}>
      <Gradient fromColor="#DBD9F6" toColor="#fff" gh="29%">
        <View style={[styles.container, {paddingTop: inset.top}]}>
          <StatusBar backgroundColor="#DBD9F6" barStyle="dark-content" />
          <Header
            title="What's New"
            width={wp(100)}
            rightIcon={headerRightIcon}
            navigation={navigation}
          />

          <View style={styles.homeContainer}>
            <FlatList
              keyExtractor={(item, index) => item?.id || index}
              data={filteredNotificationData}
              renderItem={renderNotification}
              contentContainerStyle={{paddingHorizontal: wp(4)}}
            />
          </View>
        </View>
        <Modal
          useNativeDriver
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          isVisible={modalVisible}>
          <View
            style={{
              height: 170,
              backgroundColor: '#fff',
              borderRadius: hp(1),
              paddingVertical: 20,
              width: 320,
            }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
              }}>
              Are you want to Clear Notifications
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 40,
                marginTop: 70,
              }}>
              <Pressable
                onPress={async () => {
                  const token = await getData(async_keys.user_token);

                  const headers = new Headers();
                  headers.append('Authorization', `Bearer ${token}`);

                  const url = new URL(`${BASE_URL}clear_notification`);
                  console.log('Constructed URL:', url.toString()); // Log the URL for debugging

                  try {
                    const response = await fetch(url, {
                      method: 'GET',
                      headers,
                    });

                    console.log('Response Status: 8888', response);
                    console.log('Response Headers:', [
                      ...response.headers.entries(),
                    ]);

                    if (response?.status) {
                      setModalVisible(false);
                      dispatch(fetchNotificationRequest());
                    }

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

                    // setTemplateList(jsonResponse.promition_template);
                  } catch (error) {
                    console.error('Error loading data:', error);
                  }
                }}
                style={{
                  height: 35,
                  width: 90,
                  elevation: 5,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>Yes</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  height: 35,
                  width: 90,
                  elevation: 5,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>No</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Gradient>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightIconContainer: {
    alignItems: 'center',
    width: wp(17),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muteText: {
    fontSize: wp(2.2),
    color: '#D30C0C',
    fontFamily: 'Roboto-Bold',
  },
  unmuteText: {
    fontSize: wp(2.2),
    color: '#19C991',
    fontFamily: 'Roboto-Bold',
  },
  homeContainer: {
    flex: 1,
  },
  notificationContainer: {
    // borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: hp(1),
    paddingVertical: 10,
  },
  notificationTitle: {
    fontWeight: '700',
    color: '#000',
  },
  notificationDetails: {
    color: '#999',
    fontSize: wp(3),
  },
  date: {
    fontFamily: 'Roboto-Bold',
    color: '#999',
    fontSize: wp(3.6),
    flexWrap: 'wrap',
  },
  optionContainer: {
    borderWidth: 0.3,
    borderRadius: wp(1),
    marginRight: wp(2),
  },
});
