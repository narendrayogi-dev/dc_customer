import {async_keys, getData} from './UserPreference';

// Base URL
// export const BASE_URL = 'https://app.dcjewelry.in/api/';
// export const BASE_URL = 'https://jewelrydukaan.com/api/';
//stage url

// export const BASE_URL = 'https://jewelrydukaan.com/dc_test/api/';
export const BASE_URL = 'https://staging.premad.in/dc-dukaan/api/';

// Methods
export const makeRequest = async (url, params = null, post = false) => {
  const token = await getData(async_keys.user_token);

  try {
    // request info
    let requestOptions = {};

    if (post) {
      // request method type
      requestOptions.method = 'POST';

      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);
      requestOptions.headers = myHeaders;

      // Preparing multipart/form-data
      if (params) {
        const formData = new FormData();
        for (const key in params) {
          formData.append(key, params[key]);
        }
        requestOptions.body = formData;
      }
    } else {
      // headers to prevent cache in GET request
      requestOptions.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };
    }

    const response = await fetch(url, requestOptions);

    const result = await response.json();
    console.log('API_INFO>>', {requestOptions, url, result});

    return result;
  } catch (error) {
    //  console.log(error.message);
  }
};
