import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  StatusBar,
  AppState,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import {
  Camera,
  useCameraDevice,
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
  const device = useCameraDevice('back');

  const { hasPermission, requestPermission } = useCameraPermission();

  const [appState, setAppState] = useState(AppState.currentState);
  const scannedRef = useRef(false);

  /* ================= Permission ================= */

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  /* ================= App State ================= */

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  const isActive = isFocused && appState === 'active';

  /* ================= Code Scanner ================= */

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
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

  /* ================= ERROR STATES ================= */

  // 1️⃣ Permission denied
  if (hasPermission === false) {
  return (
    <ErrorScreen
      navigation={navigation}
      title="Camera Permission Required"
      message="Please allow camera access to scan QR codes."
      action="Open Settings"
      onPress={() => Linking.openSettings()}
    />
  );
}

if (!device) {
  return (
    <ErrorScreen
      navigation={navigation}
      title="Camera Not Available"
      message={
        Platform.OS === 'ios'
          ? 'Camera does not work on iOS Simulator.'
          : 'Camera not available on this device.'
      }
    />
  );
}


  /* ================= MAIN UI ================= */

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
          {isActive && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              codeScanner={codeScanner}
            />
          )}
        </View>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.text}>Align QR inside the frame to scan</Text>
      </View>
    </View>
  );
};

export default ScanStore;

const ErrorScreen = ({ title, message, action, onPress, navigation }) => (
  <View style={styles.errorContainer}>
    
    {/* Back Button */}
    <TouchableOpacity
      style={styles.backBtn}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>

    <Text style={styles.errorTitle}>{title}</Text>
    <Text style={styles.errorMessage}>{message}</Text>

    {action && (
      <TouchableOpacity style={styles.errorBtn} onPress={onPress}>
        <Text style={styles.errorBtnText}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);


/* ================= STYLES ================= */

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
    borderColor: '#00FF00',
    borderRadius: 16,
    overflow: 'hidden',
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

  /* Error UI */

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000',
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },

  errorMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },

  errorBtn: {
    backgroundColor: '#00FF00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  errorBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  backBtn: {
  position: 'absolute',
  top: hp(6),
  left: wp(5),
},

backText: {
  color: '#00FF00',
  fontSize: 16,
  fontWeight: '600',
},

});
