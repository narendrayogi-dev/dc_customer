import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import Header from '../components/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import WebView from 'react-native-webview';

const privacyPoilcy = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Privacy Policy"
        width={wp(60)}
        navigation={navigation}
        goBack="DrawerScreen"
      />

      <View style={styles.webviewWrapper}>
        <WebView
          source={{
            uri: 'https://www.freeprivacypolicy.com/live/6ce68059-de86-425f-a7ad-655fceffa4d3',
          }}
          style={styles.webview}
        />
      </View>
    </View>
  );
};

export default privacyPoilcy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewWrapper: {
    width: '100%', // Set width of the WebView container
    height: '80%',
    alignSelf: 'center', // Center content horizontally
  },
  webview: {
    flex: 1, // Make WebView fill its container
    backgroundColor: 'transparent', // Remove WebView background
  },
});
