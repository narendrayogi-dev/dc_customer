/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Components
import Gradient from '../components/Gradient';
import Header from '../components/Header';

//Icon
import img_shop from '../assets/image/shop.png';
import {useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';

const AboutStore = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 4000);
  }, []);
 
  // }

  const [data, setData] = useState({
    shopName: 'Keshav 22 Carat Shop',
    ratingValue: '4.4',
    image: img_shop,
    description: `Lorem ipsum dolor sit amet. Non quibusdam beatae in ratione voluptas et impedit quasi.${`\n`}${`\n`}Aut libero deleniti At perspiciatis molestiae ad vero quisquam ut odit galisum.`,
  });

  return (
    <Gradient fromColor="#DBD9F6" toColor="#fff" gh="32%">
      <View style={styles.container}>
        <Header
          title="About Store"
          width={wp(65)}
          navigation={navigation}
          // params={params}
          //   style={{marginBottom: hp(5)}}
        />

        <View style={styles.webviewWrapper}>
          <WebView
            source={{
              uri: 'https://dcjewelry.in/pages/about-us',
            }}
            style={styles.webview}
          />
        </View>
      </View>
    </Gradient>
  );
};

export default AboutStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    padding: wp(7),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
    width: wp(50),
  },
  rating: {
    width: wp(13.5),
    height: hp(3.7),
    borderRadius: hp(2),
    backgroundColor: '#2BC48A',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ratingValue: {
    color: '#fff',
    fontFamily: 'Roboto-Black',
    fontSize: wp(4.5),
  },
  imageContainer: {
    marginTop: hp(2),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 1},
    backgroundColor: '#fff',
    borderRadius: hp(2),
    overflow: 'hidden',
  },
  shopImage: {
    aspectRatio: 175 / 117,
    height: hp(30),
  },
  about: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(5),
    marginVertical: hp(4),
  },
  aboutContainer: {
    marginHorizontal: wp(3),
  },
  aboutText: {
    fontFamily: 'Roboto-Light',
    fontSize: wp(4.5),
    lineHeight: hp(3.2),
    width: wp(80),
  },
  webview: {
    flex: 1, // Make WebView fill its container
    backgroundColor: 'transparent', // Remove WebView background
  },
  webviewWrapper: {
    width: '100%', // Set width of the WebView container
    height: '80%',
    alignSelf: 'center', // Center content horizontally
  },
});
