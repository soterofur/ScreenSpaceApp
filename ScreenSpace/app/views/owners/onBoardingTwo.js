import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Assets from '../../components/Assets';
import configureStore from '../../../redux/store';


const store = configureStore;

const OnBoardingTwo = ({navigation, route}) => {

   const handleContinue = async () => {
    navigation.navigate('CinemaRegistration03', route.params)
  };

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.titleContainer}>
        <Assets.SVG.Rocket style={styles.rocket} />
    </View>
    <View style={styles.titleContainer}>
        <Text style={styles.title}>¡Fantástico!</Text>
    </View>
    <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>¡Ahora, crearemos las salas que tendrá el establecimiento!</Text>
    </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerCircles}>
        <Assets.SVG.CircleEmpty/>
        <Assets.SVG.CircleFull/>
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
    fontSize: 24,
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
    marginTop: '30%',
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

export default OnBoardingTwo;
