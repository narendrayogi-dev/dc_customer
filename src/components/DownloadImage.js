import { Alert, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { showSnack } from './Snackbar';

const requestPhotoPermission = async () => {
  try {
    const permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;

    let status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED) {
      status = await request(permission);
      return status === RESULTS.GRANTED;
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Please allow Photos access from Settings to save images.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    return false;
  } catch (error) {
    console.log('Permission error:', error);
    return false;
  }
};

export const downloadImage = async (url, name = 'image', setLoader) => {
  try {
    setLoader?.(true);

    /* Check permission first */
    const hasPermission = await requestPhotoPermission();
    if (!hasPermission) {
      setLoader?.(false);
      return;
    }

    const timestamp = Date.now();
    const fileName = `${name}_${timestamp}.jpg`;

    const downloadPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

    /* Download image */
    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadPath,
    }).promise;

    if (result.statusCode === 200) {
      /* Save to Photos */
      await CameraRoll.save(downloadPath, { type: 'photo' });

      showSnack?.('Image saved to Photos');
    } else {
      throw new Error('Download failed');
    }
  } catch (error) {
    console.log('Download error:', error);

    Alert.alert(
      'Download Failed',
      'Something went wrong while downloading the image.',
    );
  } finally {
    setLoader?.(false);
  }
};