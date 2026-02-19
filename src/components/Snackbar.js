/* eslint-disable prettier/prettier */
// import Snackbar from 'react-native-snackbar';

// export const showSnack = (message, action, err) => {
//   Snackbar.show({
//     text: message,
//     duration: Snackbar.LENGTH_LONG,
//     backgroundColor: err ? 'red' : 'green',
//     action: action || {},
//   });
// };

// export const actionSnack = onTap => {
//   return {
//     text: 'UNDO',
//     textColor: 'green',
//     onPress: () => {
//       onTap();
//     },
//   };
// };

import {showMessage} from 'react-native-flash-message';

export const showSnack = (message, action, err) => {
  showMessage({
    message,
    type: !err ? 'success' : 'danger',
    position: 'top',
  });
};
