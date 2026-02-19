import {
  Platform,
  Alert,
  Linking,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import { showSnack } from './Snackbar';

export const downloadImage = async (url, name, setLoader) => {
  try {
    setLoader(true);

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Please allow storage permission from settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      setLoader(false);
      return;
    }

    const { fs, config, MediaCollection } = ReactNativeBlobUtil;

    const timestamp = Date.now();
    const fileName = `${name}_${timestamp}.png`;

    const downloadPath =
      Platform.OS === 'android'
        ? `${fs.dirs.DownloadDir}/${fileName}`
        : `${fs.dirs.DocumentDir}/${fileName}`;

    const res = await config({
      fileCache: true,
      path: downloadPath,
      addAndroidDownloads: Platform.OS === 'android'
        ? {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description: 'Downloading image...',
            mime: 'image/png',
            path: downloadPath,
          }
        : undefined,
    }).fetch('GET', url);

    // 📸 Register in Gallery / Photos
    await MediaCollection.copyToMediaStore(
      {
        name: fileName,
        parentFolder: 'DC_Jewellery', // your custom album
        mimeType: 'image/png',
      },
      'Image',
      res.path(),
    );

    Platform.OS === 'android'
      ? ToastAndroid.show(
          'Image saved to Gallery & Downloads',
          ToastAndroid.SHORT,
        )
      : showSnack('Image saved to Photos');

  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  } finally {
    setLoader(false);
  }
};



// ✅ Minimal permission handling
const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version <= 28) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true; // Android 10+ no permission needed
};
