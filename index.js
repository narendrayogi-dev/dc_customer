/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import notifee, { EventType, AndroidStyle } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './src/redux/store/configureStore';

// ✅ Handle Notifee background events (e.g., press/dismiss)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  switch (type) {
    case EventType.DISMISSED:
    case EventType.PRESS:
      await notifee.cancelNotification(detail.notification.id);
      break;
    default:
      break;
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[🔥 Background Message]', remoteMessage);

  if (Platform.OS !== 'android') return;

  if (remoteMessage.notification) {
    return;
  }

  const { title, body, image } = remoteMessage.data || {};

  if (!title && !body) return;

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'noti',
    vibration: true,
    vibrationPattern: [300, 500],
  });

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

const Main = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

// ✅ Register app
AppRegistry.registerComponent(appName, () => Main);
