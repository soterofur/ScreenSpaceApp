import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';

import Assets from '../../components/Assets';
import { showMessage } from 'react-native-flash-message';
import configureStore from '../../../redux/store';
import { updateUser } from "../../../redux/reducers/userReducer";
import {updateCinema} from "../../../redux/reducers/cinemaReducer";


const store = configureStore;

const OnBoardingFour = ({navigation, route}) => {
  const [company, setCompany] = useState('');
  const [companyFocused, setCompanyFocused] = useState(false);
  const userData = store.getState().user;
  console.log('userData contains: ', userData)
  const [isOpen, setIsOpen] = useState(true);

  console.log('Recibí cinemaId: ', route.params.cinemaId)

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleFinishOnboarding = async () => {
    console.log('Finish onboarding');
    try {
      await configureStore.dispatch(updateCinema({id: route.params.cinemaId, cinemaData: { isOpen }})).unwrap();
      await configureStore.dispatch(updateUser({ hasFinishedOnboarding: true })).unwrap();
    } catch (err) {
      console.log('No se pudo setear hasFinishOnboarding, hora de entrar en pánico: ', err)
    }
    //UPDATE OWNER DATA
    navigation.navigate('HomePageOwner');
  };


  const buttonColor = isOpen ? 'black' : 'white';
  return (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.titleContainer}>
        <Assets.SVG.Rocket style={styles.rocket} />
    </View>
    <View style={styles.titleContainer}>
        <Text style={styles.title}>¡PERFECTO!</Text>
    </View>
    <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>¡Ya está casi todo!</Text>
    </View>
    <TouchableOpacity style={isOpen ? styles.openButton : styles.closedButton} onPress={handleToggleOpen}>
      <Text style={[styles.dataText,{color:buttonColor}]}>{isOpen ? "Abierto" : "Cerrado"}</Text>
    </TouchableOpacity>
    <View style={styles.buttonHint}>
        <Text style={styles.subtitle}>Toca el boton para cambiar el estado del cine</Text>
    </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFinishOnboarding}>
            <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    <View style={styles.containerCircles}>
        <Assets.SVG.CircleEmpty/>
        <Assets.SVG.CircleEmpty/>
        <Assets.SVG.CircleEmpty/>
        <Assets.SVG.CircleFull/>
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
    flex: 1,
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
  openButton:{
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: '8%',
    marginHorizontal: '6%',
    backgroundColor: Assets.COLORS.ButtonOK,

  },
  closedButton:{
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: '8%',
    marginHorizontal: '6%',
    backgroundColor: Assets.COLORS.ButtonNotOk,

  },
  buttonHint:{
    marginTop:'3%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dataText:{
    fontSize: 20,
    fontWeight: 'bold',
},
containerCircles:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal:'35%',
  borderColor:'white',
  marginTop:'10%',
  flex: 1,
},
});

export default OnBoardingFour;
