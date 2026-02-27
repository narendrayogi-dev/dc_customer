import {async_keys, getData} from './UserPreference';
import {Alert} from 'react-native';

export const ApiServices = {
  // baseURL: 'https://jewelrydukaan.com/dc_test/api/',
  // baseURL: 'https://jewelrydukaan.com/api/',
  // baseURL: 'http://10.188.76.121/jwlrydukan/api/',


  baseURL: 'https://staging.premad.in/dc-dukaan/api/',

  // baseURL: 'https://acharya.skykraft.in/api/',

  async get(endPoint, formdata) {
    const token = await getData(async_keys.user_token);

    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    // Navigator.showLoader(true);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    return new Promise(async (resolver, reject) => {
      fetch(this.baseURL + endPoint, requestOptions)
        .then(response => {
          // Navigator.showLoader(false);
          resolver(response.json());
        })
        .then(result => {
          // Navigator.showLoader(false);
          return resolver(result);
        })
        .catch(err => {
          // Navigator.showLoader(false);
          reject(err);
          // Navigator.showAlert('Something went wrong..');
        });
    });
  },

  async postUser(endPoint, formData) {
    // console.log(
    //   'formData:',
    //   formData,
    //   await getData(async_keys.user_token);
    //   this.baseURL + endPoint,
    // );
    const token = await getData(async_keys.user_token);
    console.log('token print here', token);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);

    const requestOptions: any = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
      headers: myHeaders,
    };
    return new Promise((resolver, reject) => {
      fetch(this.baseURL + endPoint, requestOptions)
        .then((response: any) => {
          console.log('Response Api', response);
          response.isLoading = false;

          if (response.status === 500) {
            Alert.alert(response.status + '', 'something went wrong');
            // Navigator.showLoader(false);
          } else if (response.status === 401) {
            // Navigator.setRoot(screenName.Login);
            // Navigator.showLoader(false);
          }
          resolver(response.json());
        })
        .then((result: any) => {
          console.log('API RESPONSE', result);

          result.isLoading = false;

          return resolver(result);
        })
        .catch(err => {
          // Alert.alert("Response", '', 'something went wrong');
          return reject(err);
        });
    });
  },

  async deleteUser(endPoint: string) {
    try {
      const token = await getData(async_keys.user_token);
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'DELETE',
        redirect: 'follow',
        headers: myHeaders,
      };

      const response = await fetch(this.baseURL + endPoint, requestOptions);
      console.log('Response Api for delete', response);

      if (response.status === 500) {
        Alert.alert(`${response.status}`, 'Something went wrong');
        return null;
      } else if (response.status === 401) {
        // Navigate to login if needed
        // Navigator.setRoot(screenName.Login);
        return null;
      }

      const result = await response.json();
      console.log('API RESPONSE', result);

      return result;
    } catch (error) {
      console.error('API Error', error);
      throw error;
    }
  },
};
