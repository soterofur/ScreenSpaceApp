import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Assets from '../../components/Assets.js';
import store from '../../../redux/store';
import { login } from '../../../redux/reducers/userReducer';
import {getMyCinemas} from "../../../redux/reducers/cinemaReducer";
import { Dimensions } from 'react-native';
import TextInputComponent from '../../components/TextInput';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const LoginOwner = ({navigation}) => {
  //STATES PARA INPUTS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const loginUser = async () => {
    try {
      const response = await store.dispatch(login({email, password})).unwrap();
      console.log('dispatch result:');
      console.log(response);

      if (response.status === 201 || response.status === 200) {
        await store.dispatch(getMyCinemas(response.data.token)).unwrap();
        if (store.getState().user.user.hasFinishedOnboarding) {
          navigation.navigate('HomePageOwner')
        } else {
          navigation.navigate('OnBoardingOne')
        }
      }
    } catch (error) {
      showMessage({
        message: 'Usuario no encontrado',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      console.log('login caught error:')
      console.log(error)
    }
  }


  const handleLogin = async () => {
    // //validar que el formulario este completo
    if (email === '' || password === '') {
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

    //validar que el email sea valido
    else if (!email.includes('@')) {
      showMessage({
        message: 'El email no es válido, debe contener un @',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    }
    else {
      await loginUser();
    }
  };

  const handleEmail = text => {
    setEmail(text);
    console.log(text);
  }
  const handlePassword = text => {
    setPassword(text);
    console.log(text);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.containerLogo}>
      <Assets.SVG.Screen style={styles.screenImage}/>
        <Assets.SVG.Space style={styles.screenImage}/>
        <Assets.SVG.Rocket2/>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>¡Inicia sesión!</Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Completá los campos para iniciar sesión como dueño</Text>
      </View>
      <TextInputComponent IconSVG={Assets.SVG.Email}label='Correo Electrónico' placeHolder='Correo Electronico' handleTextChange={handleEmail} keyboardType='email-address' />
      <TextInputComponent IconSVG={Assets.SVG.Password}label='Contraseña' placeHolder='Contraseña' handleTextChange={handlePassword} secureText={true} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerForgotPassword}>
        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.dontHaveAccount}>
          <Text style={styles.footerText}>¿No tenés una cuenta?</Text>
          <TouchableOpacity style={styles.footerContainerButton} onPress={() => navigation.navigate('CreateAccount')}>
            <Text  style={styles.footerButton}>¡Registrate!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.haveAnAccount}>
          <Text style={styles.footerText}>¿No sos dueño? ¡No hay problema! </Text>
          <TouchableOpacity style={styles.footerContainerButton} onPress={() => navigation.navigate('LoginUser')}>
            <Text  style={styles.footerButton}>Ingresa acá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: windowHeight,
    backgroundColor: Assets.COLORS.Background,
    paddingHorizontal: windowWidth * 0.05,
  },
  containerLogo:{
    marginHorizontal: windowWidth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:windowHeight * 0.1,
  },
  screenImage:{
    width: windowWidth * 0.2,
    height: windowHeight * 0.2,
    marginRight: windowWidth * 0.03,
  },
  titleContainer: {
    marginTop:windowHeight * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: windowWidth * 0.08,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  subtitleContainer: {
    marginTop:windowHeight * 0.015,
    marginBottom: windowHeight * 0.01,
    marginHorizontal:windowWidth * 0.01,
    textAlign: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: windowWidth * 0.04,
    color: Assets.COLORS.Subtitle,
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    marginTop: windowHeight * 0.06,
    height: '7%',
    marginHorizontal:windowWidth * 0.1,
  },
  button: {
    backgroundColor: Assets.COLORS.ButtonOK,
    height: windowHeight * 0.07,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Assets.COLORS.BlackColor,
    fontSize: windowWidth * 0.05,
    fontWeight: 'bold',
  },
  containerForgotPassword:{
    marginTop:windowHeight * 0.01,
    alignItems:'center',
    borderColor:'white',
    marginHorizontal:windowWidth * 0.1,
  },
  forgotPassword:{
    marginTop:windowHeight * 0.02,

  },
  forgotPasswordText:{
    color: Assets.COLORS.ButtonOK,
    fontFamily:'Roboto',
    fontSize:windowWidth * 0.05,
    textDecorationLine: 'underline',
  },
  footerContainer:{
    marginTop:windowHeight * 0.05,
  },
  footerText:{
    color: Assets.COLORS.WhiteColor,
    fontFamily:'Roboto',
    fontSize:windowWidth * 0.04,
  },
  footerContainerButton:{
  marginLeft: windowHeight * 0.01,
  },
  dontHaveAccount:{
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center', 
    marginBottom:windowHeight * 0.001,
  },
  haveAnAccount:{
    marginTop:windowHeight * 0.02,
    marginBottom:windowHeight * 0.02,
    marginLeft:windowHeight * 0.02,
    marginRight:windowHeight * 0.02,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center', 
  },
  footerButton:{
    color: Assets.COLORS.ButtonOK,
    fontSize:16,
  },
});

export default LoginOwner;
