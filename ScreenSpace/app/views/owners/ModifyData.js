import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import Assets from '../../components/Assets';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import configureStore from '../../../redux/store';
import { requestSender } from '../../../networking/endpoints';
import { updateCinema } from '../../../redux/reducers/cinemaReducer';
import MapScreen from '../../components/MapScreen';
import TextInputComponent from '../../components/TextInput';
import { locationMaps } from '../../components/utils';

const ModifyData = ({navigation, route}) => {

  //STATES PARA LOS TEXTOS DE LOS INPUTS
  const [companyNameText, setCompanyNameText] = useState(route.params.cinemaData.name);
  const [streetNameText, setStreetNameText] = useState(route.params.cinemaData.street);
  const [numberText, setNumberText] = useState(route.params.cinemaData.streetNumber);
  const [localidadText, setLocalidadText] = useState(route.params.cinemaData.location);
  const [barrioText, setBarrioText] = useState(route.params.cinemaData.neighborhood);
  const [provinciaText, setProvinciaText] = useState(route.params.cinemaData.province);
  const [paisText, setPaisText] = useState(route.params.cinemaData.country);
  const [address, setAddress] = useState(`${streetNameText} ${numberText}, ${localidadText}, ${barrioText}, ${provinciaText}, ${paisText}`);
  console.log('modify data: ', route.params.cinemaData)
  const [showMap, setShowMap] = useState(false);

  const [latitude, setLat] = useState(0);
  const [longitude, setLong] = useState(0);

  console.log('setMyCinemas: ', route.params.setMyCinemas)
  //PROPS
  const {modifiedName = '', onNameChange } = route.params;
  const [newName, setNewName] = useState(modifiedName);

  const handleChange = async () => {
    onNameChange(newName);
    //HACER EL PUT A LA BDD'
    const data = {
      name: newName,
      street: streetNameText,
      streetNumber: numberText,
      location: localidadText,
      neighborhood: barrioText,
      province: provinciaText,
      country: paisText,
      latitude: latitude,
      longitude: longitude,
    }
    //hacer latitud y longitud 

    try{
      
    const response = await configureStore.dispatch(updateCinema(
      {id: route.params.cinemaData._id, cinemaData: data})).unwrap();
    console.log('dispatch result:');
    console.log(response);
    console.log('Data guardada en el store: ', configureStore.getState().cinemas)


    showMessage({
      message: 'Datos modificados correctamente. Puede tardar un par de minutos en verse reflejado',
      type: 'success',
      icon: 'success',
      duration: 4000,
      backgroundColor: Assets.COLORS.GreenColor,
      color: Assets.COLORS.WhiteColor,
    });

    let cinemasInit = []

    for (const [key, value] of Object.entries(configureStore.getState().cinemas.cinemas)) {
      // console.log(${key}: ${value});
      cinemasInit.push(value);
    }
    route.params.setMyCinemas(cinemasInit)
    navigation.goBack();
    } catch (error) {
      showMessage({
        message: 'Error al modificar los datos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      console.log(error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    switch (fieldName) {
      case 'companyName':
        setNewName(value);
        break;
      case 'streetName':
        setStreetNameText(value);
        break;
      case 'number':
        setNumberText(value);
        break;
      case 'localidad':
        setLocalidadText(value);
        break;
      case 'barrio':
        setBarrioText(value);
        break;
      case 'provincia':
        setProvinciaText(value);
        break;
      case 'country':
        setPaisText(value);
        break;
      default:
        break;
    }
    

    const location = `${streetNameText}+ ${numberText}+ ${localidadText}+ ${barrioText}+ ${provinciaText}+ ${paisText}`;
    setAddress(location);
    setShowMap(false);
  };
  
  
  const handleMap = () => {
    if (streetNameText === '' || numberText === '' || localidadText === '' || barrioText === '' || provinciaText === '' || paisText === '') {
      showMessage({
        message: 'Debe completar todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    } else {
      console.log('ADDRESS = ', address);
      locationMaps(address)
      .then(({ latitud, longitud }) => {
        console.log('LATITUD MODIFY DATA= ', latitud);
        console.log('LONGITUD MODIFY DATA= ', longitud);
        setLat(latitud);
        setLong(longitud);
        setShowMap(true);
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
    }  
  };

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
       <Assets.SVG.Back/>
    </TouchableOpacity>
      <Text style={styles.heading}>Mi cine</Text>
      <TextInputComponent label='Nombre del establecimiento' handleTextChange={(text) => handleFieldChange('companyName', text)} valor={modifiedName}/>
      <Text style={styles.heading2}>Ubicacion de mi Cine</Text>
      <TextInputComponent label='Calle' handleTextChange={(text) => handleFieldChange('streetName', text)} valor={streetNameText}/>
      <TextInputComponent label='Número' handleTextChange={(text) => handleFieldChange('number', text)} valor={numberText} keyboardType='numeric'/>
      <TextInputComponent label='Localidad' handleTextChange={(text) => handleFieldChange('localidad', text)} valor={localidadText}/>
      <TextInputComponent label='Barrio' handleTextChange={(text) => handleFieldChange('barrio', text)} valor={barrioText}/>
      <TextInputComponent label='Provincia' handleTextChange={(text) => handleFieldChange('provincia', text)} valor={provinciaText}/>
      <TextInputComponent label='País' handleTextChange={(text) => handleFieldChange('country', text)} valor={paisText}/>

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
      <TouchableOpacity style={styles.button} onPress={handleChange}>
          <Text style={styles.buttonText}>Guardar</Text>
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
    alignItems: 'flex-start',
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
  maps: {
    borderRadius: 50,
    marginTop:'5%',
    marginBottom:'15%',
    width: '100%',
    height: '10%',
  },
  googleButton: {
    marginTop:'5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    backgroundColor: Assets.COLORS.Tertiary,
    borderRadius: 12,
    height: 100,
  },
  googleText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 20,
    fontStyle: 'italic',
  },
  buttonContainer: {
    // flex:1,
    justifyContent:'center',
    alignContent:'center',
     height: '5%',
    marginTop:'10%',
    marginBottom: '20%',
    marginHorizontal:'20%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonOK,
    height: '80%',    
  },
  buttonText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: Assets.COLORS.BlackColor,
    fontSize: 22,
    fontFamily: 'Roboto',
  },
});

export default ModifyData;
