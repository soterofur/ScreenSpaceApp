import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

import Assets from '../../components/Assets'
import DropDownPicker from 'react-native-dropdown-picker';
import configureStore from '../../../redux/store';
import { showMessage } from "react-native-flash-message";
import DatePicker from 'react-native-date-picker'
import {requestSender} from "../../../networking/endpoints";
import {upsertById} from "../../components/utils";


const CinemaRegistration04 = ({ navigation, route }) => {
  const roomsForDropdown = route.params.rooms.map((room) => { 
    //<--- Es lo que queremos usar cuando esté el flujo listo
  // const roomsForDropdown = [
  //   { name: 'Sala de prueba', _id: '648639cabfee38f7684d487e' },
  //   { name: 'nueva sala', _id: '648e50dbc5258a9709e39e93' },
  // ].map((room) => {
    return {label: room.name, value: room._id} 
    //<--- Es lo que queremos usar cuando esté el flujo listo
    // return {label: room.name, value: room._id}
  });
  console.log('Se armó un listado de rooms para la flatlist: ', roomsForDropdown);
  let initShowsByRoomId = {};
  for (const room of roomsForDropdown) {
    initShowsByRoomId[room.value] = [];
  }
  const [showsByRoomId, setShowsByRoomId] = useState(initShowsByRoomId);
  console.log('Estado inicial de showsByRoomId: ', initShowsByRoomId)
  const [currentShowData, setCurrentShowData] = useState(null);
  const currentDate = new Date();
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(roomsForDropdown);

  const token = configureStore.getState().user.token;
  const ownerFinishedOnboarding = configureStore.getState().user.hasFinishedOnboarding;
  const finishedOnboarding = configureStore.getState().user.user.hasFinishedOnboarding
  const handleNext = () => {
    if (finishedOnboarding) {
      navigation.navigate('HomePageOwner');
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomePageOwner' }],
      });
    } else {
   navigation.navigate('OnBoardingFour', { cinemaId: route.params.cinemaId });
  };
  };


  useEffect(() => {
    const fetchData = async () => { // TODO: mostrar círculo de loading o algo así
      let newSetOfShowsByRoomId = {};
      try {
        for (const room of roomsForDropdown) {
          const response = await requestSender.getRoomShows(token, route.params.cinemaId, room.value);
          console.log(`Found shows for room "${room.label}": `, response.data)
          newSetOfShowsByRoomId[room.value] = response.data;
        }
        console.log('Built object with shows by room id: ', newSetOfShowsByRoomId);
        setShowsByRoomId(newSetOfShowsByRoomId);
        console.log('Updated state? Content is now: ', showsByRoomId);
      } catch (err) {
        console.log('Error getting shows: ', err);
        showMessage({
          message: 'Hubo un error buscando las funciones',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      }
    };
    fetchData().then(() => {});
  },  []);


  const handleShowConfirm = async (date) => {
    console.log('handleShowConfirm')
    console.log('Reading date: ', date);
    console.log('Reading show: ', currentShowData);

    if (date < currentDate) {
      console.log('fecha en el pasado!');
      showMessage({
        message: 'La fecha de la función no puede ser en el pasado',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }else{
    try {
      console.log('Creating show for room: ', selectedRoom)
      console.log('and cinema ', route.params.cinemaId)
      const response = // TODO: cleanup (no usar id hardcodeado)
          currentShowData
              ? await requestSender.updateRoomShow(token, { date }, route.params.cinemaId, selectedRoom, currentShowData._id)
              : await requestSender.createRoomShow(token, { date }, route.params.cinemaId, selectedRoom);
      console.log('Response after creation: ', response.data)
      showMessage({
        message: `¡Función ${!!currentShowData ? 'actualizada' : 'creada'} exitosamente!`,
        type: 'success',
        icon: 'success',
        duration: 4000,
        backgroundColor: Assets.COLORS.GreenColor,
        color: Assets.COLORS.WhiteColor,
      });
      setShowsByRoomId({ ...showsByRoomId, [selectedRoom]: upsertById(showsByRoomId[selectedRoom], response.data) });
    } catch (err) {
      console.log('Error creating show: ', err);
      showMessage({
        message: `Hubo un error ${!!currentShowData ? 'actualizando' : 'creando'} la función`,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
    setOpenModal(false);
    }
  }

  const handleDelete = async (index) => {
    console.log('Read index for deletion: ', index)
    if (selectedRoom) {
      try {
        const showId = showsByRoomId[selectedRoom][index]._id;
        await requestSender.deleteRoomShow(token, route.params.cinemaId, selectedRoom, showId);
        setShowsByRoomId({ ...showsByRoomId, [selectedRoom]: showsByRoomId[selectedRoom].filter((show) => show._id !== showId) });
        showMessage({
          message: '¡Función eliminada exitosamente!',
          type: 'success',
          icon: 'success',
          duration: 4000,
          backgroundColor: Assets.COLORS.GreenColor,
          color: Assets.COLORS.WhiteColor,
        });
      } catch (err) {
        console.log('Error deleting room: ', err);
        showMessage({
          message: 'Hubo un error eliminando la función',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      }
    }
  };
  
  const handleEdit = (index) => {
    console.log('handleEditHorario')
    const showData = showsByRoomId[selectedRoom][index];
    console.log('Show data: ', showData);
    setCurrentShowData(showData);
    setOpenModal(true);
  };

  return (
    <View style={styles.container}>

      {finishedOnboarding ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Assets.SVG.Back />
        </TouchableOpacity>
      ) : null
      }

      <Text style={styles.heading}>Seleccionar Sala</Text>
      <View style={{ zIndex: 3 }}>
        <DropDownPicker
          placeholder="Nombre de Sala"
          dropDownContainerStyle={styles.dropDownContainer}
          style={styles.dropDownStyle}
          open={isRoomDropdownOpen}
          value={selectedRoom}
          items={availableRooms}
          maxHeight={250}
          setOpen={setIsRoomDropdownOpen}
          setValue={setSelectedRoom}
          setItems={setAvailableRooms}
          // eslint-disable-next-line react-native/no-inline-styles
          searchContainerStyle={{
           borderBottomColor: Assets.COLORS.Tertiary,
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          searchTextInputStyle={{
            color: Assets.COLORS.WhiteColor,
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          textStyle={{
            fontSize: 20,
            color: Assets.COLORS.Subtitle,
            fontFamily: 'Roboto',
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          arrowStyle={{
            color: Assets.COLORS.WhiteColor,
          }}
        />
      </View>
      <View style={styles.containerUpCinema}>
        <Text style={styles.titleCinema}>Funciones</Text>
        <TouchableOpacity onPress={() => {
          setCurrentShowData(null);
          setOpenModal(true)
        }} disabled={selectedRoom === null}>
          <DatePicker
            modal
            mode="datetime"
            minimumDate={currentDate}
            is24hourSource="locale"
            locale = "es-AR"
            open={openModal}
            date={currentShowData ? (new Date(currentShowData.date)) : (new Date())}
            timeZoneOffsetInMinutes={-180}
            onConfirm={(date) => handleShowConfirm(date)}
            onCancel={() => {
              setOpenModal(false)
            }}
          />
          <Assets.SVG.Plus style={selectedRoom === null ? styles.unclickableButton : null} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={selectedRoom ? showsByRoomId[selectedRoom] : []}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemNumber}>{`${index + 1}. `}</Text>
              <Text style={styles.itemTitle}>{(new Date(item.date)).toLocaleString(
                  'es-AR',
                  {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  },
              )}</Text>
              <View style={styles.buttonContainerFL}>
                <TouchableOpacity onPress={() => handleEdit(index)} style={styles.buttonFL}>
                  <Assets.SVG.Pencil/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)} style={styles.buttonFL} >
                  <Assets.SVG.TaskIcon/>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {
        !ownerFinishedOnboarding && Object.values(showsByRoomId).filter(elem => elem.length).length
          ? <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonForward} onPress={handleNext}>
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Assets.COLORS.Background,
    paddingHorizontal: '5%',
  },
  backButton: {
    marginTop: '2%',
    marginBottom: '2%',
    width: '5%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    marginTop: '4%',
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  containerUpCinema: {
    fontSize: 24,
    marginTop: '8%',
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCinema: {
    fontSize: 24,
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  dropDownContainer: {
    marginVertical: '3%',
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
    fontSize: 20,
  },
  dropDownStyle: {
    marginVertical: '3%',
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Puedes personalizar el fondo según tus necesidades
    paddingVertical: 10,
  },
  buttonForward: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Assets.COLORS.BlackColor,
    textAlign: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '30%',
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonOK,
  },
  unclickableButton: {
    color: Assets.COLORS.Subtitle,
  },
  //FLAT LIST
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Assets.COLORS.Subtitle,
  },
  itemNumber: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTitle: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainerFL: {
    flexDirection: 'row',
  },
  buttonFL: {
    paddingHorizontal: 10,
  },
});

export default CinemaRegistration04;
