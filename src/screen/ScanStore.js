import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  StatusBar,
  AppState,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Header from '../components/Header';

const ScanStore = ({ navigation }) => {
  const isFocused = useIsFocused();
    const device = useCameraDevice('back')



  const { hasPermission, requestPermission } = useCameraPermission()



  console.log(hasPermission, "hasCameraPermisson");
  
  

  const [appState, setAppState] = useState(AppState.currentState);
  const scannedRef = useRef(false); // prevent multiple triggers

  /* ================= PERMISSION ================= */

  useEffect(() => {
    if(!hasPermission){
      requestPermission()

    }
  }, []);

  /* ================= APP STATE ================= */

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  const isActive = isFocused && appState === 'active';

  /* ================= CODE SCANNER ================= */

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (scannedRef.current) return;

      const value = codes[0]?.value;

      if (!value) return;

      scannedRef.current = true;

      Linking.openURL(value).catch(() => {});


      setTimeout(() => {
        scannedRef.current = false;
      }, 2000);
    },
  });

  if (!device) return null;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <Header
        title="Scan Store"
        titleColor="#fff"
        style={{
          position: 'absolute',
          width: '100%',
          marginTop: hp(2),
        }}
        navigation={navigation}
      />
     <View style={styles.cameraWrapper}>
  <View style={styles.scanFrame}>
  {
    isActive && device && (
        <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isActive}
      codeScanner={codeScanner}
    />
    )
  }
  </View>
</View>



      

    

      {/* Bottom helper text */}
      <View style={styles.overlay}>
        <Text style={styles.text}>
          Align QR inside the frame to scan
        </Text>
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
  cameraWrapper: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

scanFrame: {
  width: 280,
  height: 280,
  borderWidth: 3,
  borderColor: '#00FF00',   // ✅ Green border
  borderRadius: 16,
  overflow: 'hidden',      // keeps camera inside frame
},
  overlay: {
    position: 'absolute',
    bottom: hp(12),
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: wp(3.5),
    color: '#0482AD',
    fontFamily: 'Roboto-Bold',
  },
});
