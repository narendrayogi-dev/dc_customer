/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RadioButton} from 'react-native-paper';

//shape
import top_shape from '../assets/business_type/top_shape.png';
import bottom_shape from '../assets/business_type/bottom_shape.png';

//image
import front_image_view from '../assets/business_type/Blogging-bro.png';
//icon
import ic_next from '../assets/image/forward.png';
import ic_back from '../assets/image/back.png';
import {
  async_keys,
  getData,
  removeItem,
  storeData,
} from '../api/UserPreference';
import {showSnack} from '../components/Snackbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const BusinessType = ({navigation}) => {
  const [checked, setChecked] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user_type = await getData(async_keys.user_type);

      if (user_type) {
        setChecked(user_type);
      }
    };
    fetchData();
  }, []);

  const [data, setData] = useState([
    {id: 1, type: 'Super StockIT'},
    {id: 2, type: 'Wholeseller'},
    {id: 3, type: 'Reseller'},
    {id: 4, type: 'Retailer'},
    {id: 5, type: 'Customer'},
  ]);

  // Back
  useEffect(() => {
    const eventListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBack();
        return true;
      },
    );

    return () => eventListener.remove();
  }, [navigation]);

  const handleBack = () => navigation.goBack();

  //Last
  const handleNext = async () => {
    if (!checked) {
      alert('Please choose an option');
      return false;
    }

    await storeData(async_keys.user_type, checked);
    navigation.navigate('ChoosePCS');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#8E8EE0" barStyle="light-content" />
        <Image
          source={top_shape}
          style={styles.topShape}
          resizeMode="contain"
        />
        <Image
          source={bottom_shape}
          style={styles.bottomShape}
          resizeMode="contain"
        />

        <Image
          source={front_image_view}
          style={styles.frontImage}
          resizeMode="contain"
        />

        <View style={styles.homeContainer}>
          <Text style={styles.headerText}>Choose User Type</Text>
          {data.map((item, index) => (
            <TouchableOpacity
              testID={`radioBotton${item.id}`}
              key={item.id}
              onPress={() => setChecked(item.type)}
              activeOpacity={0.8}
              style={styles.pcsButton}>
              <RadioButton
                color="green"
                uncheckedColor="#999"
                value={checked}
                status={checked === item.type ? 'checked' : 'unchecked'}
                onPress={() => setChecked(item.type)}
              />
              <Text style={styles.pcsButtonText}>{item.type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            testID="backButton"
            activeOpacity={0.8}
            style={styles.lower}
            onPress={handleBack}>
            <Image source={ic_back} style={styles.backIcon} />
            <View style={styles.upper}>
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            testID="nextButton"
            style={styles.lower}
            activeOpacity={0.8}
            onPress={handleNext}>
            <View style={styles.upper}>
              <Text style={styles.buttonText}>Next</Text>
            </View>
            <Image source={ic_next} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BusinessType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topShape: {
    position: 'absolute',
    width: wp(89),
    height: hp(40),
    top: hp(-10),
    right: wp(-42),
  },
  bottomShape: {
    position: 'absolute',
    width: wp(67),
    height: hp(31),
    bottom: hp(-11),
    left: wp(-26),
  },
  frontImage: {
    width: wp(65),
    height: hp(30),
    alignSelf: 'center',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    marginVertical: hp(3),
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    color: '#000',
  },
  pcsButton: {
    backgroundColor: '#fff',
    width: wp(73),
    height: hp(5.5),
    borderRadius: hp(3),
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
    marginTop: hp(2),
  },
  pcsButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: wp(3.5),
    marginLeft: wp(5),
    color: '#000',
  },
  actionContainer: {
    marginBottom: hp(6),
    flexDirection: 'row',
    width: wp(85),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  lower: {
    backgroundColor: '#29B1F4',
    width: wp(28),
    height: hp(5),
    borderRadius: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 5, height: 5},
  },
  backIcon: {
    width: wp(8),
    height: hp(2.8),
  },
  upper: {
    backgroundColor: '#fff',
    width: wp(20),
    height: hp(5),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: wp(3.5),
  },
});
