/* eslint-disable react/no-unstable-nested-components */
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivalProductRequest } from '../../redux/action/productActions';
import ShimmerLoader from '../ShimmerLoader';
import { navigate } from '../../routes/NavigationService';

const ProductList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { homeData, isLoading, error } = useSelector(state => state.home);
  const { arrival_products } = homeData;
  const flatListRef = useRef(null);
  const ITEM_WIDTH = hp(19);

  useEffect(() => {
    let scrollInterval;
    if (!isLoading && arrival_products?.length > 2) {
      scrollInterval = setInterval(() => {
        const nextIndex = getNextIndex();
        // console.log('nextIndex', nextIndex);

        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 2000);
    }
    return () => {
      clearInterval(scrollInterval);
    };
  }, [arrival_products, isLoading]);

  const getNextIndex = () => {
    const currentIndex = flatListRef.current?.scrollPosition || 0;
    // console.log('currentIndex', currentIndex);
    const nextIndex =
      currentIndex === arrival_products?.length - 1 ? 0 : currentIndex + 1;

    return nextIndex;
  };

  // console.log('isLoading', isLoading);

  const RenderProduct = useMemo(
    () =>
      memo(({ item, index }) => {
        // console.log('autoScrolling----', 'render product');
        return (
          <TouchableOpacity
            testID={`productContainerButton${item.id}`}
            onPress={() => {
              console.log('prodiuct detail click', item);
              // navigation.navigate('ProductDetails', {index, id: ''});
              navigate('Product', {
                screen: 'ProductDetails',
                params: {
                  id: item?.id,
                  index,
                  item,
                },
              });
            }}
            activeOpacity={0.7}
            key={item.id}
            style={styles.productItemContainer}
          >
            {item?.images?.length !== 0 ? (
              item.images && (
                <Image
                  source={
                    isLoading || !item?.images[0]
                      ? require('../../assets/icons/diamond.png')
                      : { uri: item?.images[0] }
                  }
                  style={styles.productImage}
                  resizeMode="stretch"
                />
              )
            ) : (
              <View style={styles.productImage}>
                <Text style={{ textAlign: 'center' }}>NOT AVAILABLE</Text>
              </View>
            )}
            {!isLoading && (
              <View style={styles.productDetailsContainer}>
                <Text style={styles.productPriceText}>
                  ₹ {item.sp}
                  {item.unit && (
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 10,
                      }}
                    >
                      /{item.unit}
                    </Text>
                  )}
                </Text>

                <Text style={styles.productNameText}>{item.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      }),
    [arrival_products],
  );

  return (
    <>
      {arrival_products?.length === 0 && !isLoading && (
        <View
          style={{
            width: wp(100),
            height: hp(24.3),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!isLoading && <Text>Not available</Text>}
        </View>
      )}

      {isLoading ? (
        <View style={{ flexDirection: 'row' }}>
          {Array(3)
            .fill(1)
            .map((item, index) => (
              <ShimmerLoader
                key={index}
                loading={true}
                width={hp(19)}
                height={hp(24.3)}
                borderRadius={hp(2)}
                style={{
                  marginHorizontal: wp(1.9),
                  marginVertical: hp(2),
                }}
              />
            ))}
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={arrival_products}
          horizontal
          showsHorizontalScrollIndicator={false}
          // pagingEnabled
          keyExtractor={(item, index) => item?.id || index}
          renderItem={({ item, index }) => (
            <RenderProduct
              key={item?.id?.toString()}
              item={item}
              index={index}
            />
          )}
          initialScrollIndex={0}
          // snapToInterval={ITEM_WIDTH + wp(1.9) * 2}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: (ITEM_WIDTH + 2 * wp(1.9)) * index,
            index,
          })}
          onEndReached={() => {
            if (arrival_products?.length > 2) {
              flatListRef.current.scrollPosition = arrival_products?.length - 1;
            }
          }}
          onScroll={event => {
            const { contentOffset } = event.nativeEvent;
            const scrollPosition = Math.floor(contentOffset.x / ITEM_WIDTH);
            flatListRef.current.scrollPosition = scrollPosition;
          }}
        />
      )}
    </>
  );
};

export default memo(ProductList);

const styles = StyleSheet.create({
  productItemContainer: {
    width: hp(19),
    height: hp(24.3),
    backgroundColor: '#E5E4E2',
    borderRadius: hp(2),
    alignItems: 'center',
    marginHorizontal: wp(1.9),
    justifyContent: 'space-between',
    elevation: 5,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
    marginVertical: hp(2),
    // overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: hp(24.3) - hp(5.8),
    borderTopLeftRadius: hp(2),
    borderTopRightRadius: hp(2),
  },
  productDetailsContainer: {
    width: hp(19),
    height: hp(5.8),
    backgroundColor: '#F0FFF0',
    borderBottomRightRadius: hp(2),
    borderBottomLeftRadius: hp(2),
    paddingLeft: wp(3),
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: 'center',
    // shadowColor: '#fff',
  },
  productPriceText: {
    fontWeight: '800',
    fontSize: hp(1.7),
  },
  productNameText: {
    color: '#838383',
    fontSize: hp(1.4),
    fontFamily: 'Roboto-Black',
  },
});
