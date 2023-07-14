import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

import Assets from '../../components/Assets';
import { showMessage } from 'react-native-flash-message';
import {requestSender} from "../../../networking/endpoints";
import TextInputComponent from '../../components/TextInput';
const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  //use state for changing component from an input to a text
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (email === '') {
      showMessage({
        message: 'Por favor, complete todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    } else if (!email.includes('@')) {
      showMessage({
        message: 'El email no es valido, debe contener un @',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    } else {
      try {
        await requestSender.resetPassword(email);
      } catch (err) {
        console.log('Error resetting password: ', err);
        if (!err.status || err.status !== 400) {
          showMessage({
            message: 'Hubo un error reiniciando la contraseña',
            type: 'danger',
            icon: 'danger',
            duration: 4000,
            backgroundColor: Assets.COLORS.RedColor,
            color: Assets.COLORS.WhiteColor,
          });
          return;
        }
      }
      setIsEmailSent(true); // Si el email no existe, no avisarle al usuario para proteger ese dato
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Assets.SVG.Back/>
      </TouchableOpacity>
      <View style={styles.containerLogo}>
      <Assets.SVG.Screen style={styles.screenImage}/>
        <Assets.SVG.Space style={styles.screenImage}/>
        <Assets.SVG.Rocket2/>
      </View>
      
      {!isEmailSent ? (
      <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Por favor, ingresá tu email debajo. Recibirás una contraseña provisoria.</Text>
      </View>
      <TextInputComponent IconSVG={Assets.SVG.Email} label='Correo electrónico' value={email} placeHolder="Correo electrónico" handleTextChange={(text) => setEmail(text)} keyboardType='email-address' />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Enviar correo electrónico</Text>
        </TouchableOpacity>
      </View>
      </>            
      ):(
        <>
        <View style={styles.titleContainer}>
         <Text style={styles.title}>¡Listo!</Text>
       </View>
       <View style={styles.subtitleContainer}>
         <Text style={styles.subtitle}>Acabamos de enviarte un correo electrónico con una nueva clave provisoria a "{email}".</Text>
       </View>
       <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
           <Text style={styles.buttonText}>Volver al inicio</Text>
         </TouchableOpacity>
       </View> 
     </> )}
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Assets.COLORS.Background,
    paddingHorizontal: '5%',
  },
  backButton:{
    marginTop:'4%',
    width:'7%',
    height:'3%',
    justifyContent:'center',
    alignContent:'center',
  },
  containerLogo:{
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
    marginTop:'10%',
    marginBottom: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  subtitleContainer: {
    marginTop:'3%',
    marginBottom: '15%',
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
    width: '100%',
    height: '11%',
    marginTop:'15%',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
  },
  button: {
    backgroundColor: Assets.COLORS.ButtonOK,
    width: width * 0.7,
    height: '60%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Assets.COLORS.BlackColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
