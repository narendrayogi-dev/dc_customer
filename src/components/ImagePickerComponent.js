import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import ImageResizer from '@bam.tech/react-native-image-resizer';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// ICONS
import ic_gallery from '../assets/icons/gallery.png';
import ic_camera from '../assets/icons/camera.png';

const ImagePickerComponent = ({
  isVisible,
  setIsVisible,
  handleDone,
}) => {

  /* ================= RESIZE IMAGE ================= */

  const resizeImage = async (asset) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        asset.uri,
        322,              // width
        332,              // height
        'JPEG',
        70,               // quality (0–100)
        0,
        undefined,
        false,
        { mode: 'stretch' }
      );
      console.log(resized, "resized");
      return
      

      handleDone({
        name: resized.name || 'image.jpg',
        type: 'image/jpeg',
        uri: resized.uri,
        base64: asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : null,
      });

    } catch (error) {
      console.log('Resize error:', error);
      Alert.alert('Error', 'Image processing failed');
    }
  };

  /* ================= CAMERA ================= */

  const openCamera = async () => {
    setIsVisible(false);

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
      cameraType: 'back',
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Camera error', result.errorMessage);
      return;
    }

    resizeImage(result.assets[0]);
  };

  /* ================= GALLERY ================= */

  const openGallery = async () => {
    setIsVisible(false);

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Gallery error', result.errorMessage);
      return;
    }

    resizeImage(result.assets[0]);
  };


  return (
   <Modal
  visible={isVisible}
  transparent
  statusBarTranslucent
  animationType="slide"
  onRequestClose={() => setIsVisible(false)}
>
  <TouchableOpacity
    activeOpacity={1}
    style={styles.overlay}
    onPress={() => setIsVisible(false)}
  >
    {/* Stop closing when clicking modal box */}
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modalContainer}
    >
      <TouchableOpacity
        onPress={openCamera}
        style={styles.buttonContainer}
      >
        <View style={styles.iconContainer}>
          <Image source={ic_camera} style={styles.icon} />
        </View>
        <Text style={styles.text}>Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openGallery}
        style={styles.buttonContainer}
      >
        <View style={styles.iconContainer}>
          <Image source={ic_gallery} style={styles.icon} />
        </View>
        <Text style={styles.text}>Gallery</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => setIsVisible(false)}
        style={[styles.buttonContainer, { marginTop: 10 }]}
      >
        <Text style={{ color: 'red' }}>Cancel</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>

  );
};

export default ImagePickerComponent;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#c1c1c1',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#fff',
    padding: 13,
  },
  icon: {
    width: 25,
    height: 25,
  },
  text: {
    color: '#000080',
    marginTop: 5,
  },
});
