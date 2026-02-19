import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

import Modal from 'react-native-modal';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const ZoomableImage = ({imageUrl, isVisible, onClose}) => {
  const [modalVisible, setModalVisible] = useState(isVisible);
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    setModalVisible(isVisible);
    if (isVisible) {
      handleOpen();
    }
  }, [isVisible]);

  const handleOpen = () => {
    setModalVisible(true);
    Animated.timing(scaleValue, {
      toValue: 1.2,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.9}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={{fontSize: wp(8), fontWeight: '900', color: '#fff'}}>
            X
          </Text>
        </TouchableOpacity>
        <Animated.Image
          source={{uri: imageUrl}}
          style={[styles.image, {transform: [{scale: scaleValue}]}]}
          resizeMode="contain"
          borderRadius={wp(1)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    zIndex: 1,
    paddingLeft: hp(1.5),
    alignSelf: 'flex-end',
    marginBottom: hp(1),
  },
  image: {
    width: wp(90),
    aspectRatio: 1 / 1,
  },
});

export default ZoomableImage;
