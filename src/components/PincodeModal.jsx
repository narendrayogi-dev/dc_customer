import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import AppIcon from './AppIcon';

const PincodeModal = ({
  visible,
  code,
  setCode,
  onVerify,
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>

            <AppIcon name='close' type='material' style={{
                alignSelf:'flex-end'
            }}  onPress={()=>{
                onClose()
            }} />

          <Text style={styles.title}>Verify Pincode</Text>

          <Text style={styles.message}>
            OTP has been sent to your registered phone number
          </Text>

          {/* ✅ Simple native input (keyboard always works) */}
          <TextInput
            value={code}
            onChangeText={text =>
              setCode(text.replace(/[^0-9]/g, '').slice(0, 4))
            }
            keyboardType="number-pad"
            autoFocus
            maxLength={4}
            placeholder="Enter OTP"
            style={styles.otpInput}
            textAlign="center"
          />

          <TouchableOpacity
            style={[
              styles.verifyBtn,
              code.length !== 4 && styles.disabledBtn,
            ]}
            disabled={code.length !== 4}
            onPress={onVerify}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PincodeModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },

  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 22,
  },

  otpInput: {
    height: 55,
    borderWidth: 1.5,
    borderColor: '#F6CE4B',
    borderRadius: 10,
    fontSize: 20,
    width: '50%',
    alignSelf:'center',
    color: '#000',
    paddingHorizontal: 10,
  },

  verifyBtn: {
    backgroundColor: '#F6CE4B',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 28,
    alignItems: 'center',
  },

  disabledBtn: {
    backgroundColor: '#F6CE4B30',
  },

  verifyText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
