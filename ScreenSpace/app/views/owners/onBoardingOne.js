import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';

import { showMessage } from 'react-native-flash-message';
import configureStore from '../../../redux/store';
import { updateUser } from "../../../redux/reducers/userReducer";
import Assets from '../../components/Assets.js';
import TextInputComponent from '../../components/TextInput';

const store = configureStore;

const OnBoardingOne = ({navigation}) => {
  const [company, setCompany] = useState('');
  const [companyFocused, setCompanyFocused] = useState(false);
  const userData = store.getState().user;
  console.log('userData contains: ', userData)

  const handleContinue = async () => {
    //validar que el formulario este completo
    if (!company.trim()) {
      showMessage({
        message: 'Por favor, complete todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    }
    try {
      const response = await store.dispatch(updateUser({company})).unwrap();
      console.log('dispatch result:');
      console.log(response);
      navigation.navigate('CinemaRegistration01', {companyName: company})
    } catch (error) {
      console.log('update user view caught error:')
      console.log(error)
      showMessage({
        message: error.status === 400 ? 'Los datos ingresados son inválidos' : 'Hubo un error creando la cuenta',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
  };

  
  const handleCompanyChange = text => {
    setCompany(text);
    console.log('Company name: ', text);
  }

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.titleContainer}>
        <Assets.SVG.Rocket style={styles.rocket} />
    </View>
    <View style={styles.titleContainer}>
        <Text style={styles.title}>¡Bienvenido!</Text>
    </View>
    <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>¡Comencemos dando de alta la empresa y un establecimiento!</Text>
    </View>
    <TextInputComponent label = 'Nombre de la Empresa' handleTextChange={handleCompanyChange}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerCircles}>
        <Assets.SVG.CircleFull/>
        <Assets.SVG.CircleEmpty/>
        <Assets.SVG.CircleEmpty/>
        <Assets.SVG.CircleEmpty/>
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
  rocket:{
    justifyContent:'center',
    alignContent:'center',
  },
  backButton:{
    marginTop:'4%',
    width:'7%',
    height:'3%',
    justifyContent:'center',
    alignContent:'center',
  },
  containerLogo:{
    marginHorizontal: '20%',
    justifyContent:'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:'15%',
    marginBottom: '10%',
  },
  titleContainer: {
    marginTop:'15%',
    marginBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  subtitleContainer: {
    marginTop:'10%',
    marginBottom: '10%',
    marginHorizontal:'7%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Assets.COLORS.Subtitle,
    fontFamily: 'Roboto',
    alignContent: 'center',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop:'5%',
    borderRadius:12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity:0.6,

  },
  inputContainerFocused:{
    width: '100%',
    marginTop:'5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity:1,
  },
  label:{
    color: Assets.COLORS.WhiteColor,
    fontSize: 18, 
    marginLeft:'10%',
    marginTop:'2%',
    fontStyle: 'italic',
  },
  inputSubContainer:{
    flexDirection: 'row',
    alignItems:'center',
    marginHorizontal:'10%',
},
  email:{
    marginLeft: '3%',
    marginRight: '3%',
  },
  input: {
    marginTop:'2%',
    width: '100%',
    height: '80%',
    borderRadius: 10,
    fontSize: 16,
    color: Assets.COLORS.WhiteColor,
    marginBottom: '3%'
  },
  buttonContainer: {
    marginTop: '20%',
    justifyContent:'center',
    alignContent:'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Assets.COLORS.BlackColor,
    textAlign: 'center',
    paddingVertical: '5%',
    paddingHorizontal: '35%',
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonOK,
  },
  containerCircles:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:'35%',
    borderColor:'white',
    marginTop:'10%'
  },
});

export default OnBoardingOne;
