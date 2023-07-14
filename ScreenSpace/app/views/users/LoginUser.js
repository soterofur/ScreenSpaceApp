import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import Assets from '../../components/Assets';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
// import { requestSender } from '../../../networking/endpoints';
import {loginWithGoogle }from '../../../redux/reducers/userReducer';
import store from '../../../redux/store';
import { showMessage } from 'react-native-flash-message';
const { width, height } = Dimensions.get('window');
const LoginUser = ({navigation}) => {

  const handleGoogleLogin = async () => {
    try {
      GoogleSignin.configure({
        androidClientId: 'API KEY SANTI',
        webClientId: 'API KEY SANTI',
        // offlineAccess: true,
      });
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo==>', userInfo);
      const response = await store.dispatch(loginWithGoogle({
        email: userInfo.user.email, 
        token: userInfo.idToken,
        name: userInfo.user.name,
        photo: userInfo.user.photo})).unwrap();
      navigation.navigate('HomePageUser');
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Error al iniciar sesion con Google',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED', error.code)
        showMessage({
          message: 'El usuario cancelo el inicio de sesion',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS', error.code)
        showMessage({
          message: 'Ya hay un inicio de sesión en curso',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE', error.code)
        showMessage({
          message: 'Los servicios de Google Play no están disponibles en el dispositivo del usuario',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      } else {
        showMessage({
          message: `OTROS ERRORES: ${error.code}`,
          type: 'danger',
          icon: 'danger',
          duration: 10000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
        // Otros errores
        console.log('Otros errores==>', error.code)
      }
    }
  };

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
        <Text style={styles.subtitle}>Ingresa a la aplicación con tu cuenta de Google</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
            <Assets.SVG.Google/>
          <Text style={styles.buttonText}> Enviar correo electrónico</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerFooter}>
        <Text style={styles.footerText}>¿Eres dueño de un Cine?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonLogin}>Ingresar</Text>
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
    flexGrow: 1,
  },
  containerLogo:{
    marginHorizontal: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:height * 0.1,
  },
  screenImage:{
    width: width * 0.2,
    height: height * 0.2,
    marginRight: width * 0.03,
  },
  titleContainer: {
    marginTop:'20%',
    marginBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
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
    textAlign: 'center',
  },
  buttonContainer: {
    height: '10%',
    marginTop:'25%',
    justifyContent:'center',
    alignContent:'center',
    marginHorizontal:'5%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Assets.COLORS.ButtonOK,
    height: '60%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    paddingLeft: '3%',
    color: Assets.COLORS.BlackColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerFooter:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:'30%'
  },
  footerText:{
    color: Assets.COLORS.WhiteColor,
    fontSize: 16,
    marginRight:'3%',
  },
  buttonLogin:{
    color: Assets.COLORS.ButtonOK,
    fontSize: 16,
  },
});

export default LoginUser;
