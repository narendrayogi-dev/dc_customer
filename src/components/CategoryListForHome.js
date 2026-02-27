import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { log } from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';
import { useDispatch } from 'react-redux';
import {
  applyFilterSort,
  fetchProductRequest,
} from '../redux/action/productActions';
import { async_keys, getData } from '../api/UserPreference';
import { applyFilterSort_demo } from '../redux/action/demoProductActions';
import ShimmerLoader from './ShimmerLoader';
import { navigate, replace, resetTo } from '../routes/NavigationService';

const CategoryListForHome = ({ loading, category, navigation }) => {
  const dispatch = useDispatch();

  const handlePressOnCategory = async filterBy => {
    if (await getData(async_keys.user_token)) {
      dispatch(applyFilterSort({ filterBy }));
      navigate('Product', {
        screen:'AllProductsScreen'
      });
    } else {
      dispatch(applyFilterSort_demo({ filterBy }));
      navigate('Demo_Product', {
        screen:"Demo_ProductsScreen"
      })

      // navigation.navigate('Demo_ProductsScreen');
    }
  };

  const renderCategory = ({ item, index }) => {
    return loading ? (
      <ShimmerLoader
        key={item}
        loading={true}
        width={wp(16.2)}
        height={hp(8.64)}
        borderRadius={wp(3)}
        style={{
          marginBottom: hp(2),
          marginHorizontal: wp(1.3),
        }}
      />
    ) : (
      <View
        style={{
          alignItems: 'center',
          marginBottom: hp(2),
          width: '18%',
          marginHorizontal: '1%',
        }}
      >
        <TouchableOpacity
          onPress={() => handlePressOnCategory(item.id)}
          testID={`categoryButton${item?.id}`}
          activeOpacity={0.8}
          key={item?.id}
          style={styles.categoryItem}
        >
          <FastImage
            source={{
              uri: item?.image,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[styles.categoryImage]}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 10,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginTop: 5,
          }}
        >
          {item?.title}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.categoryContainer}>
      <FlatList
        keyExtractor={(item, index) => item?.id || index}
        scrollEnabled={false}
        numColumns={5}
        data={loading ? [1, 2, 3, 4, 5] : category}
        renderItem={renderCategory}
      />
    </View>
  );
};

export default memo(CategoryListForHome);

const styles = StyleSheet.create({
  categoryContainer: {
    // borderWidth: 1,
    marginHorizontal: wp(4),
  },
  categoryItem: {
    backgroundColor: '#F3F9FF',
    height: hp(8.64),
    width: '100%',
    borderRadius: wp(3),
    // marginRight: wp(6),
    // marginBottom: hp(0.5),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    overflow: 'hidden',
    // marginHorizontal: wp(1.4),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
});
