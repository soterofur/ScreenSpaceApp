import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import Assets from '../../components/Assets';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import configureStore from '../../../redux/store';
import TextInputComponent from '../../components/TextInput';

const store = configureStore;

const CinemaRegistration01 = ({navigation, route}) => {
  const userData = store.getState().user;

  //STATES PARA LOS HOVERS DE LOS INPUTS
  const [name, setName] = useState(false);
  const [street, setStreet] = useState(false);
  const [streetNumber, setStreetNumber] = useState(false);
  const [localidad, setLocalidad] = useState(false);
  const [barrio, setBarrio] = useState(false);

  //STATES PARA LOS TEXTOS DE LOS INPUTS
  const [companyNameText, setCompanyNameText] = useState('');
  const [streetNameText, setStreetNameText] = useState('');
  const [numberText, setNumberText] = useState('');
  const [localidadText, setLocalidadText] = useState('');
  const [barrioText, setBarrioText] = useState('');

  //PROPS
  const validateFields = () => {
    if (streetNameText === '' || numberText === '' || localidadText === '' || barrioText === '') {
      showMessage({
        message: 'Debe completar todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    } else if(isNumber(numberText) === false) {
      showMessage({
        message: 'El campo "Numero" debe ser un numero',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    } else {
      navigation.navigate('CinemaRegistration02', {
        name: companyNameText || barrioText,
        street: streetNameText,
        streetNumber: numberText,
        location: localidadText,
        neighborhood: barrioText,
      });
    }
  };

  //i want to check if numberText is a number
  const isNumber = (numberText) => {
    return !isNaN(parseFloat(numberText)) && isFinite(numberText);
  }



  
  const handleCompany = text => {
    setCompanyNameText(text);
    console.log(text);
  }
  const handleStreetName = text => {
    setStreetNameText(text);
    console.log('Street = ',text);
  }
  const handleStreetNumber = text => {
    setNumberText(text);
    console.log('Street Number = ',text);
  }
  const handleLocalidad = text => {
    setLocalidadText(text);
    console.log('Localidad = ',text);
  }
  const handleBarrio = text => {
    setBarrioText(text);
    console.log('Barrio = ',text);
  }

  const handleBack = () => {
    if (store.getState().user.user.hasFinishedOnboarding) {
      navigation.navigate('HomePageOwner')
    } else {
      navigation.navigate('OnBoardingOne')
    }
  }


  return (
  <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Assets.SVG.Back/>
      </TouchableOpacity>
      <Text style={styles.heading}>Mi cine</Text>
      <TextInputComponent label='Nombre del establecimiento' handleTextChange={handleCompany}/>
      <Text style={styles.heading2}>Ubicacion de mi Cine</Text>
      <TextInputComponent label='Calle' handleTextChange={handleStreetName}/>
      <TextInputComponent label='Numero' handleTextChange={handleStreetNumber} keyboardType='numeric'/>
      <TextInputComponent label='Localidad' handleTextChange={handleLocalidad}/>
      <TextInputComponent label='Barrio' handleTextChange={handleBarrio}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={validateFields}>
            <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Assets.COLORS.Background,
    paddingHorizontal: '5%',
  },
  backButton: {
    marginTop:'2%',
    marginBottom: '2%',
    width: '10%',
    height:'5%',
    justifyContent:'center',
    alignItems: 'center',
  },
  heading:{
    fontSize:24,
    marginTop: '2%',
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'bold',
    fontFamily:'Roboto',
  },
  heading2:{
    fontSize:24,
    marginTop: '5%',
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'bold',
    fontFamily:'Roboto',
  },

  buttonContainer: {
    marginTop: '4%',
    justifyContent:'center',
    alignContent:'center',
    flex:1,
    marginBottom: '5%',
  },
  button: {
    marginHorizontal:'10%',

  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Assets.COLORS.BlackColor,
    textAlign: 'center',
    paddingVertical: '3%',
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonOK,
  },
});

export default CinemaRegistration01;
