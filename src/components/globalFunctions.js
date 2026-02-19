import {Alert} from 'react-native';
import {clearData} from '../api/UserPreference';

export const goForLogin = async navigation => {
  Alert.alert('Login', 'Please Login first to perform this action!', [
    {
      text: 'Cancel',
    },
    {
      text: 'Login',
      style: 'destructive',
      onPress: async () => {
        await clearData();
        navigation.navigate('Mobile');
      },
    },
  ]);
};
