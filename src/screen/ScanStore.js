/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

//Component
import Header from '../components/Header';

const ScanStore = ({navigation}) => {
  const onSuccess = e => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <Header
        title="Scan Store"
        titleColor="#fff"
        style={{marginottom: 50}}
        navigation={navigation}
      />

      <View style={styles.homeContainer}>
        <QRCodeScanner
          showMarker
          reactivate
          fadeIn={false}
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.auto}
          bottomContent={
            <Text style={styles.buttonText}>
              Please align the QR code within the scanner
            </Text>
          }
        />
      </View>
    </View>
  );
};

export default ScanStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  homeContainer: {
    flex: 1,
  },
  //   centerText: {
  //     flex: 1,
  //     fontSize: 18,
  //     padding: 32,
  //     color: '#777',
  //   },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#0482AD',
    fontFamily: 'Roboto-Bold',
    top: hp(-13),
  },
});
