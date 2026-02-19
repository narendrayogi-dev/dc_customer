import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AppIcon from './AppIcon';

interface AppAvatarProps {
  uri?: string;
  placeholder: any;
  size?: number;
  onEditPress?: () => void;
  style?: any;
}

const AppAvatar: React.FC<AppAvatarProps> = ({
  uri,
  placeholder,
  size = 80,
  onEditPress,
  style,
}) => {
  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      <Image
        source={uri ? { uri } : placeholder}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />

      {onEditPress && (
        <TouchableOpacity
          style={[
            styles.cameraButton,
            {
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: (size * 0.28) / 2,
            },
          ]}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <AppIcon
            family="fa"
            name="camera"
            size={size * 0.14}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppAvatar;
const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: '#eee',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { height: 1, width: 0 },
  },
});
