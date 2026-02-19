// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, {useEffect, useState} from 'react';

// const CategoryVariants = props => {
//   console.log('props on category component', props);
//   const [select, setSelected] = useState(false);

//   useEffect(() => {
//     if (select) {
//       props.selectedItem(props.data.item);
//     }
//   }, [select]);

//   return (
//     <TouchableOpacity
//       onPress={() => {
//         setSelected(!select);
//       }}
//       style={{
//         width: 93,
//         height: 110,
//         borderRadius: 5,
//         backgroundColor: '#fff',
//         marginHorizontal: 20,
//         paddingVertical: 10,
//         paddingHorizontal: 5,
//         marginVertical: 5,
//         alignItems: 'center',
//         borderWidth: 2,
//         borderColor: select ? '#DFC9BB' : 'white',
//         elevation: 5,
//       }}>
//       <Image
//         style={{
//           height: 41,
//           width: 41,
//           borderRadius: 5,
//         }}
//         source={{uri: props.data.item.image}}
//       />

//       <Text
//         style={{
//           fontSize: 10,
//           color: '#000',
//           marginTop: 5,
//         }}>
//         {props.data.item.name}
//       </Text>

//       <Text
//         style={{
//           fontSize: 14,
//           color: '#000',
//           marginTop: 1,
//         }}>
//         ₹ {props.data.item.price}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// export default CategoryVariants;

// const styles = StyleSheet.create({});

import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const CategoryVariants = ({data, selectedItem, isSelected}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        selectedItem(data.item);
      }}
      style={{
        width: 93,
        height: 125,
        borderRadius: 5,
        backgroundColor: isSelected ? '#C04547' : '#fff',
        // backgroundColor:
        //   data.item.id === selectedItem?.id ? '#8fc7ff' : '#f0f0f0',
        marginHorizontal: 20,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginVertical: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: isSelected ? '#C04547' : 'white',
        elevation: 5,
      }}>
      <Image
        style={{
          height: 41,
          width: 41,
          borderRadius: 5,
        }}
        source={{uri: data.item.image}}
      />

      <Text
        style={{
          fontSize: 10,
          color: isSelected ? '#fff' : '#000',
          marginTop: 5,
        }}>
        {data.item.name}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: isSelected ? '#fff' : '#000',
          marginTop: 1,
        }}>
        ₹ {data.item.price}
      </Text>
      <Text
        style={{
          color: data.item?.is_stock === 0 ? 'red' : '#000080',
          backgroundColor: '#fff',
          fontSize: 8,
          borderRadius: 2,
          elevation: 2,
          width: 50,
          textAlign: 'center',
        }}>
        {data.item?.is_stock === 0 ? 'Out of Stock' : 'In Stock'}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryVariants;

const styles = StyleSheet.create({});
