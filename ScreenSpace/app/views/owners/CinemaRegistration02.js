import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import Assets from '../../components/Assets';
import {showMessage} from "react-native-flash-message";
import {createCinema} from "../../../redux/reducers/cinemaReducer";
import configureStore from '../../../redux/store';
import MapScreen from '../../components/MapScreen';
import { useEffect } from 'react';
import TextInputComponent from '../../components/TextInput';
import { locationMaps } from '../../components/utils';

const store = configureStore;

const CinemaRegistration02 = ({navigation, route}) => {
  //props
  console.log('Route params: ', route.params)
  
  // const street = "Hipolito Yrigoyen"
  // const streetNumber = "2618"
  // const location = "Vicente Lopez"
  // const neighborhood = "Florida"

  const { name, street, streetNumber, location, neighborhood } = route.params;

  //states para los hovers de los inputs
  const [companyName, setCompanyName] = useState(name);
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');

  const [latitude, setLat] = useState(0);
  const [longitude, setLong] = useState(0);

  const handleProvincia = text => {
    setProvince(text);
    console.log(text);
  };
  const handlePais = text => {
    setCountry(text);
    console.log(text);
  };

  const handleContinue = async () => {

    if (!showMap){
      showMessage({
        message: 'Por favor, verifique la ubicación del cine en el mapa',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    }

    console.log('País: ', country)
    console.log('Provincia: ', province)
      // if (!country || !province || !latitude || !longitude) { TODO: cuando esté implementado google maps
      if (!country || !province) {
        showMessage({
          message: 'Por favor, complete todos los campos',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
        // return;
      }
      try {
        const response = await store.dispatch(createCinema({
          name,
          street,
          streetNumber,
          location,
          neighborhood,
          country,
          province,
          latitude: latitude, // TODO: mandar valor posta cuando se implemente google maps
          longitude: longitude,
        })).unwrap();
        console.log('dispatch result:');
        console.log(response);
        console.log('Data guardada en el store: ', store.getState().cinemas)
        const ownerFinishedOnboarding = configureStore.getState().user.user.hasFinishedOnboarding;
        if (ownerFinishedOnboarding) {
          navigation.navigate('CinemaRegistration03', {cinemaId: response._id});
        }else{
          navigation.navigate('OnBoardingTwo', {cinemaId: response._id});
        }
      } catch (error) {
        console.log('create cinema view caught error:')
        console.log(error)
        showMessage({
          message: error.status === 400 ? 'Los datos ingresados son inválidos' : 'Hubo un error creando el cine',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      }
  };
  


  const handleMap = () => {
    if (!province || !country) {
      showMessage({
        message: 'Para ver el mapa, por favor complete todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    } else {
      
      const address = `${street}+${streetNumber}+${location}+${neighborhood}+${country}+${province}`;
      // locationMaps(address)
      locationMaps(address)
      .then(({ latitud, longitud }) => {
        console.log('ADDRESS = ', address);
        console.log('LATITUD CINEMA REGISTRATION= ', latitud);
        console.log('LONGITUD CINEMA REGISTRATION= ', longitud);
        setLat(latitud);
        setLong(longitud);
        setShowMap(true);
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
    }
  }

  const [showMap, setShowMap] = useState(false);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Assets.SVG.Back />
      </TouchableOpacity>
      <Text style={styles.heading}>Mi cine</Text>
      <View style={[styles.inputContainer, companyName && styles.inputContainerFocused,]}>
        <Text style={styles.label}>Nombre del establecimiento</Text>
        <View style={styles.inputSubContainer}>
          <Text
            style={styles.inputCompany}
            placeholderTextColor={Assets.COLORS.Subtitle}
          >{name}</Text>
        </View>
      </View>
    <Text style={styles.heading2}>Ubicacion de mi Cine</Text>
    <TextInputComponent label='Provincia' handleTextChange={handleProvincia}/>
    <TextInputComponent label='País' handleTextChange={handlePais}/>
    
    {showMap ? 
    <View style={styles.maps}>
      <MapScreen  latitudMapa={latitude} longitudMapa={longitude}/>
    </View>
    : 
    <TouchableOpacity style={styles.googleButton} onPress={handleMap}>
        <Text style={styles.googleText}>Tocar para mostrar mapa de ubicacion</Text>
      </TouchableOpacity>  
    }


    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button}  onPress={handleContinue} >
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
  label: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 18,
    marginLeft:'10%',
    marginTop:'2%',
    fontStyle: 'italic',
  },
  inputSubContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginHorizontal:'10%',
},
inputCompany:{
  marginTop:'8%',
  width: '100%',
  height: '80%',
  borderRadius: 10,
  fontSize: 16,
  color: Assets.COLORS.WhiteColor,
  marginBottom: '3%'
},
googleContainer: {
    width: '100%',
    marginTop:'5%',
    borderRadius:12,
    borderWidth: 1, 
    backgroundColor: Assets.COLORS.Tertiary,
    // opacity:0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maps: {
    borderRadius: 50,
    marginTop:'10%',
    width: '100%',
    height: '10%',
  },
  googleButton: {
    marginTop:'5%',
    width: '100%',
    height: '20%',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: Assets.COLORS.Tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 20,
    fontStyle: 'italic',
  },
maps: {
    width: '100%',
    height: '20%',
    borderRadius: 12,
},

  input: {
    marginTop: '2%',
    width: '100%',
    height: '80%',
    borderRadius: 10,
    fontSize: 16,
    color: Assets.COLORS.WhiteColor,
    marginBottom: '3%'
  },
  buttonContainer: {
    marginTop: '4%',
    justifyContent:'center',
    alignContent:'center',
    flex:1,
    marginBottom: '5%',
    // marginHorizontal:'40%',
  },
  button: {
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal:'3%',

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

export default CinemaRegistration02;
