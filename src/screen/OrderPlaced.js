/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Icon
import ic_done from '../assets/image/correct.png';

const OrderPlaced = ({navigation}) => {
  const [orderId, setOrderId] = useState('');
  useEffect(() => {
    const {params} = navigation.state;
    setOrderId(params || '');
  }, []);

  const handleDone = () => navigation.navigate('HomeScreen');
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#A0DFB7" barStyle="dark-content" />
      <View style={styles.topShape} />

      <View style={styles.headingContainer}>
        <Text style={styles.text1}>
          ORDER{`\n`}
          <Text style={styles.text2}>Successfully</Text>
        </Text>

        <Image source={ic_done} style={styles.doneIcon} />
      </View>

      <Text style={styles.text3}>
        You have successfully placed{`\n`}an order
      </Text>
      <Text style={styles.text4}>Order ID: #{orderId}</Text>

      <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderPlaced;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topShape: {
    width: wp(45),
    height: hp(24.5),
    backgroundColor: '#A0DFB7',
    borderRadius: hp(13),
    position: 'absolute',
    top: hp(-8),
    right: wp(-10),
  },
  headingContainer: {
    width: wp(85),
    height: hp(22.7),
    backgroundColor: '#45C072',
    marginTop: hp(26),
    borderTopEndRadius: hp(20),
    borderBottomEndRadius: hp(20),
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text1: {
    fontFamily: 'Roboto-Medium',
    color: '#fff',
    fontSize: wp(5),
    letterSpacing: wp(1),
  },
  text2: {
    letterSpacing: wp(0.6),
    fontFamily: 'Roboto-Bold',
    lineHeight: hp(4),
  },
  doneIcon: {
    width: wp(16),
    height: hp(8),
  },
  text3: {
    color: '#777',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
    marginLeft: wp(10),
    marginTop: hp(10),
  },
  text4: {
    color: '#45C072',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
    marginLeft: wp(10),
    marginTop: hp(3),
  },
  doneButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(80),
    height: hp(7),
    borderRadius: hp(1),
    backgroundColor: '#45C072',
    marginTop: hp(10),
  },
  doneText: {
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
  },
});
