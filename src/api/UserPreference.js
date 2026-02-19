import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './ApiInfo';

// User Preferences Keys
export const async_keys = {
  user_token: 'user_token',
  user_id: 'user_id',
  is_register: 'is_register',
  mobile_number: 'mobile_number',
  personal_name: 'personal_name',
  gender: 'gender',
  dob: 'dob',
  business_name: 'business_name',
  state: 'state',
  city: 'city',
  pin: 'pin',
  user_type: 'user_type',
  pcs_perDesign: 'pcs_perDesign',
  active_store_code: 'active_store_code',
  email: '',
};

// User Preferences Methods
export const storeData = async (key, data) => {
  try {
    const info = JSON.stringify(data);
    await AsyncStorage.setItem(key, info);
  } catch (error) {
    //  console.log(error.message);
  }
};

export const getData = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    const info = JSON.parse(data);
    return info;
  } catch (error) {
    //  console.log(error.message);
    return null;
  }
};

export const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
    //  console.log(`Item "${key}" cleared from AsyncStorage successfully.`);
  } catch (error) {
    console.error(`Error clearing item "${key}" from AsyncStorage:`, error);
  }
};

export const clearData = async () => {
  console.log('clearDataCall');

  try {
    const token = await getData(async_keys.user_token);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    const url = new URL(`${BASE_URL}logout`);
    console.log('Constructed URL:', url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const responseData = await response.json();
    console.log('Logout response:', responseData);

    if (responseData?.ResponseCode === 200) {
      console.log('Logout successful. Clearing AsyncStorage...');
      await AsyncStorage.clear();
    } else {
      console.log('Logout failed:', responseData?.Message);
    }
  } catch (error) {
    console.log('Logout error:', error.message);
  }
};
