import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const NotificationModal = ({ approved, disApproved, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleOnClose = () => {
    setVisible(false);
    onClose();
  };
  
  return (
     
    <Modal transparent visible={visible}>
        {approved ?
      <View style={styles.container}>
        <View style={[styles.message, { backgroundColor: 'green' }]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        <TouchableOpacity style={styles.okButton} onPress={handleOnClose}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
      :null}
      {disApproved ?
        <View style={styles.container}>
        <View style={[styles.message, { backgroundColor: 'red' }]}>
            <Text style={styles.messageText}>{message}</Text>
        </View>
        <TouchableOpacity style={styles.okButton} onPress={handleOnClose}>
            <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
        </View>
        :null}
    </Modal>
    
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    message: {
      padding: 20,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageText: {
      color: Assets.COLORS.WhiteColor,
      fontSize: 20,
      marginLeft: 10,
    },
    okButton: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      marginTop: 20,
    },
    okButtonText: {
      color: Assets.COLORS.BlackColor,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
