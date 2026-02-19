/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
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
import {async_keys, getData, storeData} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showSnack} from '../components/Snackbar';

const PCSscreen = ({navigation}) => {
  const [checked, setChecked] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const pcs = await getData(async_keys.pcs_perDesign);

      if (pcs) {
        setChecked(pcs || '');
      }
    };
    fetchData();
  }, []);

  const [data, setData] = useState([
    {id: 1, pcs: '50 - 60 PCS'},
    {id: 2, pcs: '12 - 24 PCS'},
    {id: 3, pcs: '05 - 10 PCS'},
    {id: 4, pcs: '01 - 02 PCS'},
  ]);

  const [loader, setLoader] = useState(false);

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

    await storeData(async_keys.pcs_perDesign, checked);

    try {
      setLoader(true);
      const name = await getData(async_keys.personal_name);
      const gender = await getData(async_keys.gender);
      const dob = await getData(async_keys.dob);
      const store_name = await getData(async_keys.business_name);
      const state = await getData(async_keys.state);
      const city = await getData(async_keys.city);
      const pin = await getData(async_keys.pin);
      const user_type = await getData(async_keys.user_type);
      const user_pcs = checked;

      const params = {
        name,
        gender,
        dob,
        state: state.name,
        city: city.name,
        store_name,
        pin,
        user_type,
        user_pcs,
      };
      console.log('gdshgdshgdshdgsdgsdhsgs', params);
      const response = await makeRequest(
        `${BASE_URL}customer_update_details`,
        params,
        true,
      );
      // console.log('res------', response);

      if (response) {
        const {Status, Message} = response;
        // const newResponse = response.Data.data;
        if (Status === true) {
          await storeData(async_keys.is_register, '1');
          showSnack(Message);
          navigation.navigate('LoggedIn');
        } else {
          showSnack('Some error occured', null, true);
        }
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#8E8EE0" barStyle="light-content" />

      <Image source={top_shape} style={styles.topShape} />
      <Image source={bottom_shape} style={styles.bottomShape} />

      <Image source={front_image_view} style={styles.frontImage} />

      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>PCS (Per Design)</Text>
        <Text style={styles.headerDetailText}>(example: earring)</Text>

        {data.map((item, index) => (
          <TouchableOpacity
            testID={`radioBotton${item.id}`}
            key={item.id}
            onPress={() => setChecked(item.pcs)}
            activeOpacity={0.8}
            style={styles.pcsButton}>
            <RadioButton
              color="green"
              uncheckedColor="#999"
              value={checked}
              status={checked === item.pcs ? 'checked' : 'unchecked'}
              onPress={() => setChecked(item.pcs)}
            />
            <Text style={styles.pcsButtonText}>{item.pcs}</Text>
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
  );
};

export default PCSscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topShape: {
    position: 'absolute',
    width: wp(89),
    height: hp(40),
    top: hp(-7),
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
    fontWeight: 'bold',
    marginTop: hp(3),
  },
  headerDetailText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#999',
    marginBottom: hp(3),
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

[
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
  },
  {
    code: 'AS',
    name: 'Assam',
  },
  {
    code: 'BR',
    name: 'Bihar',
  },
  {
    code: 'CG',
    name: 'Chandigarh',
  },
  {
    code: 'CH',
    name: 'Chhattisgarh',
  },
  {
    code: 'DH',
    name: 'Dadra and Nagar Haveli',
  },
  {
    code: 'DD',
    name: 'Daman and Diu',
  },
  {
    code: 'DL',
    name: 'Delhi',
  },
  {
    code: 'GA',
    name: 'Goa',
  },
  {
    code: 'GJ',
    name: 'Gujarat',
  },
  {
    code: 'HR',
    name: 'Haryana',
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
  },
  {
    code: 'JH',
    name: 'Jharkhand',
  },
  {
    code: 'KA',
    name: 'Karnataka',
  },
  {
    code: 'KL',
    name: 'Kerala',
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
  },
  {
    code: 'MH',
    name: 'Maharashtra',
  },
  {
    code: 'MN',
    name: 'Manipur',
  },
  {
    code: 'ML',
    name: 'Meghalaya',
  },
  {
    code: 'MZ',
    name: 'Mizoram',
  },
  {
    code: 'NL',
    name: 'Nagaland',
  },
  {
    code: 'OR',
    name: 'Odisha',
  },
  {
    code: 'PY',
    name: 'Puducherry',
  },
  {
    code: 'PB',
    name: 'Punjab',
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
  },
  {
    code: 'SK',
    name: 'Sikkim',
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
  },
  {
    code: 'TS',
    name: 'Telangana',
  },
  {
    code: 'TR',
    name: 'Tripura',
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
  },
  {
    code: 'WB',
    name: 'West Bengal',
  },
];
