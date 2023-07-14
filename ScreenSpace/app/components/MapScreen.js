import { Dimensions, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionsAndroid } from 'react-native';

const MapScreen = ({latitudMapa, longitudMapa}) => {    



  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Ubicación',
            message: 'Se requiere acceso a la ubicación para mostrar el mapa correctamente.',
            buttonPositive: 'Aceptar',
            buttonNegative: 'Cancelar',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso de ubicación concedido');
        } else {
          console.log('Permiso de ubicación denegado');
        }
      } catch (error) {
        console.warn('Error al solicitar permiso de ubicación:', error);
      }
    };

    requestLocationPermission();
  }, []);

  const initialRegion = {
    latitude: latitudMapa, 
    longitude: longitudMapa, 
    latitudeDelta: 0.02, 
    longitudeDelta: 0.02, 
  };

  const handleMap = () => {
    setShowMap(true);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>
      <MapView
        style={{marginTop:'5%', height: 200, widht: 200, borderRadius: 50}}
        initialRegion={initialRegion}
        loadingEnabled={true}
        zoomControlEnabled={true}
      >
        <Marker
          draggable
          coordinate={{ latitude: latitudMapa, longitude: longitudMapa }} // Coordenadas del marcador
        />
      </MapView>
    </View>
    </SafeAreaView>

  );
};


const styles = StyleSheet.create({
  // googleButton: {
  //   marginTop:'5%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Assets.COLORS.Tertiary,
  //   borderRadius: 50,
  //   width: '100%',
  //   height: '50%',
  // },
  // googleText: {
  //   color: Assets.COLORS.WhiteColor,
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   fontFamily:'Roboto',
  // },
});


export default MapScreen;

