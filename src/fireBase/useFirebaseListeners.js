import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle } from '@notifee/react-native';
import { Platform } from 'react-native';

// Request notification permission
async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  await notifee.requestPermission();

  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

// Initialize foreground listener only
async function initializeNotificationListeners() {
  if (Platform.OS !== 'android') return;

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'noti',
    vibration: true,
    vibrationPattern: [300, 500],
  });

  const unsubscribe = messaging().onMessage(async remoteMessage => {
  console.log('[🔥 Forground  Message]', remoteMessage);

    const { title, body } = remoteMessage.notification || {};
    const { image } = remoteMessage.data || {};

    if (!title && !body) return;

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        sound: 'noti',
        vibrationPattern: [300, 500],
        pressAction: { id: 'default' },
        style: image
          ? {
              type: AndroidStyle.BIGPICTURE,
              picture: image,
            }
          : undefined,
        largeIcon: image || undefined,
      },
    });
  });

  return unsubscribe;
}

// Main function to call in App.js
async function setupNotifications() {
  const permissionGranted = await requestNotificationPermission();

  if (permissionGranted && Platform.OS === 'android') {
    await initializeNotificationListeners();
  }
}

export default setupNotifications;
