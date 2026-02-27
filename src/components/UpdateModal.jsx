import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
} from 'react-native';

const UpdateModal = ({ visible, onUpdate }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {
        // Disable back button (Android)
        BackHandler.exitApp(); // optional: app close
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* 🔄 Update Image */}
          <Image
            source={require('../assets/image/update.jpg')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Update Required</Text>

          <Text style={styles.message}>
            A new version of the app is available.
            Please update to continue using the app.
          </Text>

          <TouchableOpacity style={styles.updateBtn} onPress={onUpdate}>
            <Text style={styles.updateText}>Update Now</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode:"contain",
    // marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  updateBtn: {
    backgroundColor: '#F6CE4B',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  updateText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
