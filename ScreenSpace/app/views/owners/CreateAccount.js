import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Assets from '../../components/Assets';
import { showMessage } from 'react-native-flash-message';
import store from "../../../redux/store";
import { register } from "../../../redux/reducers/userReducer";
import TextInputComponent from '../../components/TextInput';
const { width, height } = Dimensions.get('window');

const CreateAccount = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const createUser = async () => {
    const name = email.split('@')[0]
    console.log(email, ' = email,', password, ' = password,', name, ' = name')
    try {
      const response = await store.dispatch(register({email, password, name})).unwrap();
      console.log('dispatch result:');
      console.log(response);
      navigation.navigate('OnBoardingOne')
    }
    catch (error) {
      console.log('register view caught error:')
      console.log(error)
      if (error.status === 400) {
        showMessage({
          message: error.message === 'This email is already in use.' ? 'El email ya está registrado' : 'Los datos ingresados son inválidos',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      } else {
        showMessage({
          message: 'Hubo un error creando la cuenta',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      }
    }
  }

  const handleCreateAccount = async () => {
    if (email === '' || password === '' || confirmPassword === '') {
      showMessage({
        message: 'Por favor, complete todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
    else if (password !== confirmPassword) {
      showMessage({
        message: 'Las contraseñas no coinciden',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
    else if (!email.includes('@')) {
      showMessage({
        message: 'El email no es valido, debe contener un @',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });}
    else {
      //fetch fucntion to create user in database
      await createUser();
   }  
    
  }

  const handleEmail = text => {
    setEmail(text);
    console.log(text);
  }
  const handlePassword = text => {
    setPassword(text);
    console.log(text);
  }
  const handleConfirmedPassword = text => {
    setConfirmPassword(text);
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
        <Text style={styles.title}>¡Crea tu cuenta!</Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Por favor, completá los campos debajo.</Text>
      </View>
      <TextInputComponent IconSVG={Assets.SVG.Email} label='Correo Electrónico' placeHolder='Correo electrónico' handleTextChange={handleEmail} keyboardType='email-address'/>
      <TextInputComponent IconSVG={Assets.SVG.Password} label='Contraseña' placeHolder='Contraseña' handleTextChange={handlePassword} secureText={true} />
      <TextInputComponent IconSVG={Assets.SVG.Password} label='Confirmar contraseña' placeHolder='Confirmar contraseña' handleTextChange={handleConfirmedPassword} secureText={true}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity style={styles.footerContainerButton} onPress={() => navigation.navigate('Login')}>
          <Text  style={styles.footerButton}>Iniciar sesión</Text>
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
  containerLogo:{
    marginHorizontal: width * 0.2,
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
    marginTop:'5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  subtitleContainer: {
    marginTop:'1%',
    marginBottom: '5%',
    marginHorizontal:'7%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Assets.COLORS.Subtitle,
    fontFamily: 'Roboto',
  },


  buttonContainer: {
    width: '70%',
    height: '10%',
    marginLeft:'14%',
    marginTop:height * 0.05,
    marginRight:'14%',
    justifyContent:'center',
    alignContent:'center',
  },
  button: {
    backgroundColor: Assets.COLORS.ButtonOK,
    //width: '100%',
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
  footerContainer:{
    marginTop: height * 0.02,
    flexDirection:'row',
    justifyContent:'center',
    alignContent:'center'
  },
  footerText:{
    color: Assets.COLORS.WhiteColor,
    fontFamily:'Roboto',
    fontSize:16,
  },
  footerContainerButton:{
  marginLeft: '3%',
  },
  footerButton:{
    color: Assets.COLORS.ButtonOK,
    fontSize:16,
  },
});

export default CreateAccount;
