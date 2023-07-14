import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import Assets from '../../components/Assets';
import { showMessage } from 'react-native-flash-message';
import store from '../../../redux/store';
import {logout, updateUser} from "../../../redux/reducers/userReducer";
import configureStore from '../../../redux/store';

const OwnerProfile = ({navigation}) => {
    //MODAL STATES
    const [modalVisibleEraseAccount, setModalVisibleEraseAccount] = useState(false);
    const [modalVisibleCompanyName, setModalVisibleCompanyName] = useState(false);
    const [modalVisibleLogOut, setModalVisibleLogOut] = useState(false);
    const storedUserData = configureStore.getState().user;

    console.log('STORED USER DATA ',storedUserData)

    //STATES PARA INPUTS
    const [newCompanyName, setNewCompanyName] = useState('');
    const [oldCompanyName, setOldCompanyName] = useState(configureStore.getState().user.user.company);//NOMBRE CON EL FETCH
    
    const deleteAccount = () => {
        //HACER EL DELETE A LA BDD
        console.log('Cuenta eliminada correctamente');
        setModalVisibleEraseAccount(false);
        //navigation.navigate('HomePageOwner');
    }

    const modifyCompanyName = async () => {
      //HACER EL PUT A LA BDD
      const hasNumbers = /\d/.test(newCompanyName);
      if(hasNumbers){
        showMessage({
          message: 'El nombre de la empresa no puede contener números',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
        setModalVisibleCompanyName(false);
        return;
      }
      else if(newCompanyName == '') {
        showMessage({
          message: 'El nombre de la empresa no puede estar vacío',
          type: 'danger',
          icon: 'danger',           
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
        setModalVisibleCompanyName(false);
        return;
      }
      else {
        try {
          const result = await configureStore.dispatch(updateUser({ company: newCompanyName })).unwrap();
          console.log(result);
          showMessage({
            message: 'Nombre de la empresa modificado correctamente. Puede tardar un par de minutos en verse reflejado',
            type: 'success',
            icon: 'success',
            duration: 4000,
            backgroundColor: Assets.COLORS.GreenColor,
            color: Assets.COLORS.WhiteColor,
          });
          setOldCompanyName(newCompanyName);
          console.log('Nombre de la empresa modificado correctamente');
          setModalVisibleCompanyName(false);
          // navigation.navigate('HomePageOwner');
        } catch (error) {
          console.log(error);
        }
      }
  }
    const handleName = text => {
        setNewCompanyName(text);
        console.log(text);
    }


    const closeSesion = () => {
        store.dispatch(logout());
        console.log('Sesión cerrada correctamente');
        setModalVisibleLogOut(false);
        navigation.navigate('Login');
    }



  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.navigate('HomePageOwner')}>
            <Assets.SVG.Back/>
        </TouchableOpacity>
        <View style={styles.containerCinema}>
            <Text style={styles.companyName}>{oldCompanyName}</Text>
        </View>
        <TouchableOpacity style={styles.modifyButton} onPress={() => setModalVisibleLogOut(true)}>
            <Text style={styles.modifyDataText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modifyButton} onPress={()=> navigation.navigate('ModifyPassword')}>
            <Text style={styles.modifyDataText}>Modificar contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modifyButton} onPress={() => setModalVisibleCompanyName(true)}>
            <Text style={styles.modifyDataText}>Modificar nombre de la empresa</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.modifyButton2} onPress={() => setModalVisibleEraseAccount(true)}>
            <Text style={styles.modifyDataText}>Borrar cuenta</Text>
        </TouchableOpacity>

        {/* MODAL CERRAR SESION */}
        <Modal visible={modalVisibleLogOut} transparent={true} animationType='fade'>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>¿Estás seguro de que queres cerrar sesión?</Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalAcceptButton]} onPress={closeSesion}>
                  <Text style={styles.modalButtonText1}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalDeleteButton]} onPress={() => setModalVisibleLogOut(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/*FIN MODAL */}
        
        {/* MODAL NOMBRE EMPRESA */}
        <Modal visible={modalVisibleCompanyName} transparent={true} animationType='fade'>
          <View style={styles.modalContainer}>
            
            <View style={styles.modalBox}>
              <TouchableOpacity style={styles.buttonCruz} onPress={() => setModalVisibleCompanyName(false)}>
                <Assets.SVG.Cruz/>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Ingresar nuevo nombre de la empresa</Text>
              <TextInput
                style={styles.input}
                placeholder="Nuevo nombre"
                placeholderTextColor={Assets.COLORS.Subtitle}
                onChangeText={handleName}
                />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalAcceptButton]} onPress={modifyCompanyName}>
                  <Text style={styles.modalButtonText1}>Cambiar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/*FIN MODAL */}

        {/* MODAL BORRAR CUENTA */}
        <Modal visible={modalVisibleEraseAccount} transparent={true} animationType='fade'>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>¿Estás seguro de que queres borrar tu cuenta? Tu cambio sera permanente.</Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalAcceptButton]} onPress={deleteAccount}>
                  <Text style={styles.modalButtonText1}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalDeleteButton]} onPress={() => setModalVisibleEraseAccount(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/*FIN MODAL */}

    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Assets.COLORS.Background,
    },
    backButton:{
        paddingTop: '3%',
        paddingLeft: '3%',
    },
    containerCinema:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15%',
        marginBottom: '7%',
    },
    companyName:{
        fontFamily: 'Roboto',
        fontSize: 36,
        color: Assets.COLORS.WhiteColor,
    },
    cinemaStreet:{
        marginTop: '2%',
        fontSize: 18,
        fontWeight: '300',
        color: Assets.COLORS.WhiteColor,
    },
    modifyButton:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '6%',
        borderRadius: 50,
        height: '8%',
        marginHorizontal: '6%',
        backgroundColor: Assets.COLORS.Tertiary,
    },
    modifyDataText:{
        color: Assets.COLORS.WhiteColor,
        fontSize: 20,
        fontWeight: 'bold',
    },
    modifyButton2:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '35%',
        borderRadius: 50,
        height: '8%',
        marginHorizontal: '6%',
        backgroundColor: Assets.COLORS.ButtonNotOk,
    },


    // MODAL
    input: {
        borderRadius: 10,
        paddingHorizontal: '5%',
        fontSize: 20,
        backgroundColor: Assets.COLORS.Tertiary,
        color: Assets.COLORS.WhiteColor,
        alignContent: 'flex-end',
        marginTop: '3%',
        marginBottom: '3%',
        width: '100%',
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
      buttonCruz:{
        alignSelf: 'flex-start',
        paddingBottom: '4%'
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Assets.COLORS.WhiteColor,
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
      modalButtonText1: {
        color: Assets.COLORS.BlackColor,
        fontSize: 16,
      },

});

export default OwnerProfile;
