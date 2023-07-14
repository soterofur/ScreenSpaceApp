import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import Assets from '../../components/Assets';
import { showMessage } from 'react-native-flash-message';
import {requestSender} from "../../../networking/endpoints";
import configureStore from '../../../redux/store';

const ModifyPassword = ({navigation}) => {
  const [isOldPassword, setIsOldPassword] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [OldPassword, setOldPassword] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const storedUserData = configureStore.getState().user;

  const handleResetPassword = async () => {
    //validar que el formulario este completo
    if (OldPassword === '' || NewPassword === '' || ConfirmPassword === '') {
      showMessage({
        message: 'Por favor, complete todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
    //comparar que las contraseñas sean iguales
    else if (NewPassword !== ConfirmPassword) {
      showMessage({
        message: 'Las contraseñas no coinciden',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
    else {
      try {
        await requestSender.newPassword( storedUserData.user._id, {oldPassword:OldPassword,password:NewPassword},storedUserData.token);
        showMessage({
          message: 'Contraseña modificada correctamente',
          type: 'success',
          icon: 'success',
          duration: 4000,
          backgroundColor: Assets.COLORS.GreenColor,
          color: Assets.COLORS.WhiteColor,
        });
        navigation.navigate('HomePageOwner')
      } catch (error) {
        if (error.status === 400) {
          showMessage({
            message: 'La contraseña actual es incorrecta',
            type: 'danger',
            icon: 'danger',
            duration: 4000,
            backgroundColor: Assets.COLORS.RedColor,
            color: Assets.COLORS.WhiteColor,
          });
        } else {
          showMessage({
            message: 'Hubo un error al cambiar la contraseña',
            type: 'danger',
            icon: 'danger',
            duration: 4000,
            backgroundColor: Assets.COLORS.RedColor,
            color: Assets.COLORS.WhiteColor,
          });
          }
      }
    }

    
  };
  

  const handleOldPassword = text => {
    setOldPassword(text);
    console.log(text);
  }

  const handleNewPassword = text => {
    setNewPassword(text);
    console.log(text);
  }

  const handleConfirmPassword = text => {
    setConfirmPassword(text);
    console.log(text);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('OwnerProfile')}>
        <Assets.SVG.Back/>
      </TouchableOpacity>
      <View style={styles.containerLogo}>
      <Assets.SVG.Screen style={styles.screenImage}/>
        <Assets.SVG.Space style={styles.screenImage}/>
        <Assets.SVG.Rocket2/>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cambiar contraseña</Text>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Por favor, ingresá tu email debajo. Recibirás una contraseña provisoria.</Text>
      </View>
      <View style={[styles.inputContainer , isOldPassword && styles.inputContainerFocused]}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputSubContainer}>
          <Assets.SVG.Password  style={styles.email}/>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={Assets.COLORS.Subtitle}
            onChangeText={handleOldPassword}
            onFocus={() => setIsOldPassword(true)}
            onBlur={() => setIsOldPassword(false)}
            />
        </View>
      </View>
      <View style={[styles.inputContainer , isNewPassword && styles.inputContainerFocused]}>
        <Text style={styles.label}>Nueva contraseña</Text>
        <View style={styles.inputSubContainer}>
          <Assets.SVG.Password  style={styles.email}/>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor={Assets.COLORS.Subtitle}
            secureTextEntry={true}
            onChangeText={handleNewPassword}
            onFocus={() => setIsNewPassword(true)}
            onBlur={() => setIsNewPassword(false)}
            />
        </View>
      </View>
      <View style={[styles.inputContainer , isConfirmPassword && styles.inputContainerFocused]}>
        <Text style={styles.label}>Confirmar nueva contraseña</Text>
        <View style={styles.inputSubContainer}>
          <Assets.SVG.Password  style={styles.email}/>
          <TextInput
            style={styles.input}
            placeholder="Confirmar nueva contraseña"
            placeholderTextColor={Assets.COLORS.Subtitle}
            onChangeText={handleConfirmPassword}
            secureTextEntry={true}
            onFocus={() => setIsConfirmPassword(true)}
            onBlur={() => setIsConfirmPassword(false)}
            />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Cambiar</Text>
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
  backButton:{
    marginTop:'4%',
    width:'7%',
    height:'3%',
    justifyContent:'center',
    alignContent:'center',
  },
  containerLogo:{
    marginHorizontal: '15%',
    justifyContent:'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:'4%',
    marginBottom: '10%',
  },
  titleContainer: {
    marginTop:'3%',
    marginBottom: '2%',
    justifyContent: 'flex-start',
    marginLeft: '6%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  subtitleContainer: {
    marginTop:'1%',
    marginBottom: '10%',
    marginLeft: '6%',
    justifyContent: 'flex-start',
  },
  subtitle: {
    fontSize: 18,
    color: Assets.COLORS.Subtitle,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    width: '100%',
    marginBottom: '5%',
    borderRadius:12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity:0.6,
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
    // backgroundColor:'black',
  },
  inputContainerFocused:{
    width: '100%',
    marginBottom: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity:1,
  },
  email:{
    marginLeft: '3%',
    marginRight: '3%',
  },
  input: {
    marginTop:'2%',
    width: '85%',
    height: '80%',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: Assets.COLORS.WhiteColor,
    alignContent: 'flex-end',
    marginBottom: '3%'
  },
  buttonContainer: {
    width: '70%',
    height: '10%',
    marginLeft:'14%',
    marginTop:'5%',
    marginRight:'14%',
    justifyContent:'center',
    alignContent:'center',
  },
  button: {
    backgroundColor: Assets.COLORS.ButtonOK,
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

export default ModifyPassword;
