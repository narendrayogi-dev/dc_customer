/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions, Animated, Easing, Alert} from 'react-native';

const AnimatedScroll = props => {
  const DATA = props.data;
  const width = props.width;
  const height = props.height;
  //   const {width} = Dimensions.get('window');
  const [selectedIndex, setselectedIndex] = useState(0);
  const scrollView = useRef();
  const scrollAnimation = useRef(new Animated.Value(width * selectedIndex));

  // const setIndex = event => {
  //   const contentOffset = event.nativeEvent.contentOffset;
  //   const viewSize = event.nativeEvent.layoutMeasurement;
  //   // Divide the horizontal offset by the width of the view to see which page is visible
  //   setselectedIndex(Math.floor(contentOffset.x / viewSize.width));
  // };

  useEffect(() => {
    const fn = setInterval(() => {
      setselectedIndex(oldCount =>
        oldCount === DATA.length - 1 ? 0 : oldCount + 1,
      );
    }, 2500);

    scrollAnimation.current.addListener(animation => {
      scrollView.current &&
        scrollView.current.scrollTo({
          x: animation.value,
          animated: false,
        });
    });

    Animated.timing(scrollAnimation.current, {
      toValue: width * selectedIndex,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
    return () => {
      clearInterval(fn);
      scrollAnimation.current.removeAllListeners();
    };
  });

  // Script will executed every time selectedIndex updates
  // useEffect(() => {
  //   scrollView.current.scrollTo({
  //     animated: true,
  //     x: width * selectedIndex,
  //     y: 0,
  //   });
  // });

  //Transition
  const anim1 = useRef(new Animated.Value(0)).current;
  const transForm1 = anim1.interpolate({
    inputRange: [0, width],
    outputRange: [-height, 0],
  });
  const transForm2 = anim1.interpolate({
    inputRange: [width, width * 2],
    outputRange: [height, 0],
  });
  // const transForm3 = anim1.interpolate({
  //   inputRange: [width * 2, width * 3],
  //   outputRange: [height, 0],
  // });
  const transForm3 = anim1.interpolate({
    inputRange: [width * 3, width * 4],
    outputRange: [-height, 0],
  });

  return (
    // <View>
    <View style={{flex: 1}}>
      <Animated.ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        // onMomentumScrollEnd={setIndex}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets
        onScrollBeginDrag={() => {
          scrollAnimation.current.stopAnimation();
        }}
        // onContentSizeChange={() => {
        //   scrollView.current.scrollToEnd;
        // }}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: anim1}}}], {
          useNativeDriver: true,
        })}
        scrollEnabled={false}>
        {DATA.map((item, index) => {
          return (
            <Animated.Image
              key={item.id}
              source={{
                uri: item.image,
              }}
              style={{
                width: width,
                height: height,
                borderRadius: 10,

                transform: [
                  {
                    translateY:
                      index === 0
                        ? 0
                        : index === 1
                        ? transForm1
                        : index === 2
                        ? transForm2
                        : index === 3
                        ? 0
                        : index === 4
                        ? transForm3
                        : 0,
                  },
                ],
              }}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
    // </View>
  );
};

export default AnimatedScroll;
