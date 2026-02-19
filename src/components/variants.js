import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppIcon from './AppIcon';

const Variants = props => {
  const [count, setCount] = useState(0);
  const packingQuantity = props.data.item.packing_quantity || 0;

  useEffect(() => {
    console.log('Props data on variants 98989', props.modalItem);
    setCount([]);
  }, []);

  const increment = item => {
    console.log('Item:', item);

    setCount(prevCount => {
      const packingQuantity = item.packing_quantity || 1; // Default packing quantity
      const orderLimit =
        props.modalItem.order_limit > 0
          ? props.modalItem.order_limit
          : Infinity; // Handle order limit

      const newCount = prevCount + packingQuantity;

      // **Check if new count exceeds order limit**
      if (newCount > orderLimit) {
        Alert.alert(`Maximum quantity of ${orderLimit} has been reached.`);
        props.getQuantity({id: item.product_id, quantity: orderLimit}); // Set to max limit
        return orderLimit; // Stop at the limit
      }

      // Otherwise, update normally
      props.getQuantity({id: item.product_id, quantity: newCount});
      return newCount;
    });
  };

  const decrement = item => {
    setCount(prevCount => {
      const packingQuantity = item.packing_quantity || 1; // Default packing quantity

      // Ensure we do not go below packing quantity
      if (prevCount - packingQuantity < packingQuantity) {
        Alert.alert(
          `You cannot decrease below the packing quantity of ${packingQuantity}.`,
        );
        return prevCount; // Prevent decrease
      }

      // Otherwise, decrease normally
      const newCount = prevCount - packingQuantity;
      props.getQuantity({id: item.product_id, quantity: newCount});
      return newCount;
    });
  };

  // const decrement = item => {
  //   setCount(prevCount => {
  //     const newCount =
  //       prevCount >= packingQuantity ? prevCount - packingQuantity : 0;

  //     // Inform the parent to update the cart
  //     props.getQuantity({id: item.product_id, quantity: newCount});

  //     return newCount;
  //   });
  // };

  return (
    <View
      style={{
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // flex: 1,
        // backgroundColor: '#ffff',
        // elevation: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Image
          source={{uri: props?.data.item.image}}
          style={{height: 60, width: 60, borderRadius: 5}}
          resizeMode="cover"
        />
        <View
          style={{
            flexDirection: 'column',
            width: 100,
            marginLeft: 20,

            justifyContent: 'space-around',
            height: 50,
          }}>
          <Text style={[styles.variantName]}>{props.data.item.name}</Text>
          <Text
            style={{
              fontSize: 8,
              color: '#808080',
              fontWeight: '500',
              // left: 60,
              top: 8,
            }}>
            (Name,Size,Colour)
          </Text>
          <Text style={styles.variantPrice}>₹ {props.data.item.price}</Text>
          <Text
            style={{
              color: props.data.item?.is_stock === 0 ? 'red' : '#000080',
              backgroundColor: '#fff',
              fontSize: 10,
              borderRadius: 2,
              elevation: 2,
              width: 70,
              textAlign: 'center',
              top: 13,
            }}>
            {props.data.item?.is_stock === 0 ? 'Out of Stock' : 'In Stock'}
          </Text>
        </View>
      </View>

      {count > 0 ? (
        <View
          style={{
            width: 80,
            height: 25,
            backgroundColor: '#555',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 3,
            paddingHorizontal: 10,
            right: 15,
          }}>
          <TouchableOpacity onPress={() => decrement(props.data.item)}>
            <AppIcon type="fa" name="minus" color="#fff" size={15} />
          </TouchableOpacity>

          <Text style={{color: '#fff'}}>{count}</Text>

          <TouchableOpacity
            onPress={() => {
              increment(props.data.item);
            }}>
            <AppIcon type="fa" name="plus" color="#fff" size={15} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (props.data.item.cart_count > 0) {
              return;
            } else {
              setCount(packingQuantity > 0 ? packingQuantity : 1); // Start count with packing_quantity if available, otherwise 1
              props.getQuantity({
                id: props.data.item.product_id,
                quantity: packingQuantity > 0 ? packingQuantity : 1,
              });
            }
          }}
          style={{
            width: 80,
            height: props.data.item?.is_stock === 0 ? 35 : 35,
            backgroundColor:
              props.data.item.cart_count === 0 ? '#C04547' : '#949494',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 3,

            right: 10,
          }}>
          <Text
            style={styles.addButton}
            // onPress={() => {
            //   if (props.data.item.cart_count > 0) {
            //     return;
            //   } else {
            //     setCount(packingQuantity > 0 ? packingQuantity : 1); // Start count with packing_quantity if available, otherwise 1
            //     props.getQuantity({
            //       id: props.data.item.product_id,
            //       quantity: packingQuantity > 0 ? packingQuantity : 1,
            //     });
            //   }
            // }}
          >
            <Text style={{fontSize: 12, color: '#fff'}}>
              {props.data.item.cart_count > 0
                ? 'Added'
                : props.data.item?.is_stock === 0
                ? 'Add to Wishlist'
                : 'Add'}
            </Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Variants;

const styles = StyleSheet.create({
  variantName: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#000',
  },
  variantPrice: {
    fontSize: 16,
    fontFamily: 'Roboto-Semi-Bold',
    color: '#000',
    marginTop: 15,
  },
});
