import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import Assets from '../../components/Assets';
import configureStore from '../../../redux/store';
import { requestSender } from '../../../networking/endpoints';
import {deleteCinema, updateCinema } from '../../../redux/reducers/cinemaReducer';
import { showMessage } from 'react-native-flash-message';

const CinemaMenu = ({navigation, route}) => {
    console.log('route.params',route.params)
    const {name, street} = route.params.item;
    const [modifiedName, setModifiedName] = useState(name ?? '');
    const [modalVisibleEraseCinema, setModalVisibleEraseCinema] = useState(false);
    
    const [isOpen, setIsOpen] = useState(route.params.item.isOpen);
    
    const handleToggleOpen = async () => {
      
      try {
        console.log(isOpen)
        //console.log('route.params',route.params)
        await configureStore.dispatch(updateCinema({id: route.params.item._id, cinemaData: { isOpen: !isOpen}})).unwrap();
        setIsOpen(!isOpen);
      } catch (err) {
        console.log('No se pudo setear hasFinishOnboarding, hora de entrar en pánico: ', err)
      }
    };


    //console.log('item = ',route.params.item)
    //console.log('set = ',route.params.setMyCinemas)
    const handleModifyData = () =>{
      console.log('MODIFY DATAAAAAAAAAA')
        navigation.navigate('ModifyData', {
            modifiedName,
            onNameChange: setModifiedName,
            cinemaData: route.params.item,
            setMyCinemas: route.params.setMyCinemas,
          });
    };

    const handleDeleteCinema = async () => {
      console.log('handleDeleteCinema, setMyCinemas = ',route.params.setMyCinemas)
      try{      
        const response = await configureStore.dispatch(deleteCinema(
          route.params.item._id)).unwrap();
        //console.log('dispatch result:');
        //console.log(response);
        //console.log('Data guardada en el store: ', configureStore.getState().cinemas)
        let cinemasInit = []
        for (const [key, value] of Object.entries(configureStore.getState().cinemas.cinemas)) {
          // console.log(${key}: ${value});
          cinemasInit.push(value);
        }
        
        route.params.setMyCinemas(cinemasInit)
        //console.log('Cine eliminado correctamente');
        navigation.goBack();
      } catch (error) {
        showMessage({
          message: 'Error al eliminar el cine',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
        //console.log(error);
      }
    };

    const buttonColor = isOpen ? 'black' : 'white'; 
    const handleGoBack = () => {
      navigation.navigate('HomePageOwner');
      navigation.reset({
      index: 0,
      routes: [{ name: 'HomePageOwner' }],
    });
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} 
        onPress={handleGoBack}>
            <Assets.SVG.Back/>
        </TouchableOpacity>
        <View style={styles.containerCinema}>
            <Text style={styles.cinemaName}>{modifiedName}</Text>
            <Text style={styles.cinemaStreet}>{route.params.item.street}</Text>
        </View>
        <TouchableOpacity style={styles.modifyButton} onPress={handleModifyData}>
            <Text style={styles.modifyDataText}>Modificar Datos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modifyButton} onPress={() => navigation.navigate('CinemaRegistration03',{cinemaId: route.params.item._id})}>
            <Text style={styles.modifyDataText}>Modificar mis Salas y Funciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={isOpen ? styles.openButton : styles.closedButton} onPress={handleToggleOpen}>
          <Text style={[styles.dataText,{color:buttonColor}]}>{isOpen ? "Abierto" : "Cerrado"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modifyButton2} onPress={() => setModalVisibleEraseCinema(true)}>
            <Text style={styles.modifyDataText}>Eliminar Cine</Text>
        </TouchableOpacity>


        {/* MODAL ELIMINAR CINE */}
        <Modal visible={modalVisibleEraseCinema} transparent={true} animationType='fade'>
            <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>¿Estás seguro que deseas eliminar el cine?</Text>
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity style={[styles.modalButton,  styles.modalAcceptButton]} onPress={handleDeleteCinema}>
                            <Text style={styles.modalButtonText1}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.modalDeleteButton]} onPress={() => setModalVisibleEraseCinema(false)}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        {/* FIN MODAL */}

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
        // backgroundColor: 'cyan',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15%',
        marginBottom: '7%',
        
    },
    cinemaName:{
        marginHorizontal: '6%',
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: '5%',
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
        marginTop: '30%',
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
      openButton:{
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: '8%',
        marginHorizontal: '6%',
        backgroundColor: Assets.COLORS.ButtonOK,
    
      },
      closedButton:{
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: '8%',
        marginHorizontal: '6%',
        backgroundColor: Assets.COLORS.ButtonNotOk,
      },
      dataText:{
        fontSize: 20,
        fontWeight: 'bold',
      },

});

export default CinemaMenu;
