// /* eslint-disable prettier/prettier */
// import {BottomTabBar} from '@react-navigation/bottom-tabs';
// import React from 'react';

// import {
//   View,
//   Pressable,
//   Dimensions,
//   StyleSheet,
//   ImageBackground,
//   Text,
// } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// // import NavigationIcon from './navigationIcon';

// // import MaterialFooterComponent from './MaterialFooterComponent';

// const {width} = Dimensions.get('window');

// import XD from '../assets/image/Path8.png';

// const TabBar = props => {
//   const {state} = props;
//   const {index} = state;
//   const home = index === 0;
//   const store = index === 1;
//   const wishlist = index === 2;
//   const orders = index === 3;
//   const help = index === 4;

//   return (
//     <MaterialFooterComponent
//       {...props}
//       name={
//         home
//           ? 'home'
//           : store
//           ? 'store'
//           : wishlist
//           ? 'wishlist'
//           : orders
//           ? 'orders'
//           : help
//           ? 'help'
//           : null
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 25,
//     backgroundColor: '#182028',
//     borderRadius: 25,
//     marginHorizontal: width * 0.1,
//   },
//   mainItemContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//     // borderRadius: 1,
//     // borderColor: '#333B42',
//   },
//   ImageBackground: {
//     // width: width,
//     // // height: 80,
//     // // height: 110,
//     // alignSelf: 'center',
//     // position: 'absolute',
//     // bottom: wp(8),
//     // flexDirection: 'row',
//     // justifyContent: 'space-between',
//     // backgroundColor: '#f1f1f1',
//   },
// });

// export default TabBar;
