import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import store from '../../../redux/store';
import { logout } from '../../../redux/reducers/userReducer';
import { ScrollView } from 'react-native-gesture-handler';
import Assets from '../../components/Assets';
import { showMessage } from 'react-native-flash-message';
import { updateUser } from '../../../redux/reducers/userReducer';
import configureStore from '../../../redux/store';
import {requestSender} from "../../../networking/endpoints";

const { width, height } = Dimensions.get('window');

const UserProfile = ({ navigation }) => {
  const [newUserName, setNewUserName] = useState('');
  const [oldUserName, setOldUserName] = useState(configureStore.getState().user.user.name);
  const [oldUserPhoto, setOldUserPhoto] = useState(configureStore.getState().user.user.photo.url);
  const [userid, setUserId] = useState(configureStore.getState().user.user._id);

  const [isFocused, setIsFocused] = useState(false);
  const token = configureStore.getState().user.token;
  const [modalVisible, setModalVisible] = useState(false);

  console.log('Usuario: ', oldUserPhoto);

  // update newUserName with oldUserName when the component mounts
  useEffect(() => {
    setNewUserName(oldUserName);
  }, [oldUserName]);

  const handleImageUpload = () => {
    // ToDo subir imagen
  };

  const modifyName = async () => {
    if (newUserName === oldUserName) {
      console.log("El nombre no ha cambiado");
      return;
  }
    const hasNumbers = /\d/.test(newUserName);
    if (hasNumbers) {
      showMessage({
        message: 'Su nombre no puede contener números',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    } else if (newUserName === '') {
      console.log('El nuevo nombre está vacío');
      showMessage({
        message: 'Su nombre no puede estar vacío',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    } else {
      try {
        const result = await configureStore
          .dispatch(updateUser({ name: newUserName }))
          .unwrap();
        console.log(result);
        showMessage({
          message:
            'Nombre modificado correctamente. Puede tardar un par de minutos en verse reflejado',
          type: 'success',
          icon: 'success',
          duration: 4000,
          backgroundColor: Assets.COLORS.GreenColor,
          color: Assets.COLORS.WhiteColor,
        });
        setOldUserName(newUserName);
        console.log('Nombre modificado correctamente');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLogout = () => {
    store.dispatch(logout());
    console.log('Sesión cerrada correctamente');
    navigation.navigate('Login');
  };

  const handleDeleteAccount = async () => {
      try {
        await requestSender.deleteUser(token,userid);
        showMessage({
          message: 'Se ha eliminado su cuenta correctamente.',
          type: 'success',
          icon: 'success',
          duration: 4000,
          backgroundColor: Assets.COLORS.GreenColor,
          color: Assets.COLORS.WhiteColor,
        })
        setModalVisible(false);
        store.dispatch(logout());
        console.log('Sesión cerrada correctamente');
        navigation.navigate('Login');
      } catch (err) {
        console.log('Error resetting password: ', err);
        if (!err.status || err.status !== 400) {
          showMessage({
            message: err.message,
            type: 'danger',
            icon: 'danger',
            duration: 4000,
            backgroundColor: Assets.COLORS.RedColor,
            color: Assets.COLORS.WhiteColor,
          });
          return;
        }
      }
    }
    
  const handleGoBack = () => {
    navigation.navigate('HomePageUser');
    navigation.reset({
    index: 0,
    routes: [{ name: 'HomePageUser' }],
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Perfil</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleImageUpload}>
              {oldUserPhoto ? (
                <Image source={{ uri: oldUserPhoto }} style={styles.profileImage} />
              ) : (
                <Image
                  source={require('./empty-profile.png')}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>
            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputSubContainer}>
            <Assets.SVG.Profile style={styles.profileIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={Assets.COLORS.Subtitle}
              value={newUserName}
              onChangeText={setNewUserName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                modifyName();
              }}
            />
          </View>
          </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonTextWhite}>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} transparent={true} animationType='fade'>
            <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>¿Estás seguro que deseas eliminar tu cuenta?</Text>
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity style={[styles.modalButton,  styles.modalAcceptButton]} onPress={handleDeleteAccount}>
                            <Text style={styles.modalButtonText1}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.modalDeleteButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Assets.COLORS.Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.04,
    marginTop: height * 0.02,
  },
  scrollView: {
    paddingHorizontal: '5%',
  },
  headerText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  contentContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: height * 0.1, 
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    marginBottom: 20,
  },
  inputContainer: {
    width: width * 0.9, 
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Assets.COLORS.Background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    width: '80%',
    alignItems: 'center',
    padding: '5%',
  },
  label: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 18,
    marginLeft: '10%',
    marginTop: '2%',
    fontStyle: 'italic',
  },
  inputSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '10%',
  },
  inputContainerFocused: {
    width: width * 0.9, 
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 1,
  },
  profileIcon: {
    marginRight: width * 0.03,
  },
  input: {
    marginTop: '2%',
    width: '100%',
    height: '80%',
    borderRadius: 10,
    fontSize: 16,
    color: Assets.COLORS.WhiteColor,
    marginBottom: '3%',
  },
  logoutButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
    borderRadius: height * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.17,
    marginBottom: height * 0.03,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '3%',
  },
  modalButton: {
    borderRadius: 25,
    marginHorizontal: '5%',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
  },
  modalAcceptButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
  },
  modalDeleteButton: {
    backgroundColor: Assets.COLORS.ButtonNotOk,
  },
  modalButtonText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 16,
  },
  modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Assets.COLORS.WhiteColor,
      },
  modalButtonText1: {
    color: Assets.COLORS.BlackColor,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: Assets.COLORS.ButtonNotOk,
    borderRadius: height * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.15,
    marginBottom: height * 0.1,
  },
  buttonText: {
    color: Assets.COLORS.Background,
    fontSize: height * 0.03,
   fontWeight: 'bold',
  },
  buttonTextWhite: {
    color: Assets.COLORS.WhiteColor,
    fontSize: height * 0.03,
   fontWeight: 'bold',
  },
});

export default UserProfile;
