import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import configureStore from '../../../redux/store';
import { requestSender } from '../../../networking/endpoints';
import { showMessage } from 'react-native-flash-message';
import { upsertById } from '../../components/utils';
import Assets from '../../components/Assets';
import TextInputComponent from '../../components/TextInput.js';
import { ScrollView } from 'react-native-gesture-handler';

const windowHeight = Dimensions.get('window').height;

const CinemaRegistration03 = ({ navigation, route }) => {
  const [modalVisibleCompanyName, setModalVisibleCompanyName] = useState(false);

  const [movies, setMovies] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [rows, setRows] = useState('1');
  const [columns, setColumns] = useState('1');
  const [seatPrice, setSeatPrice] = useState('');
  const [isRoomOpen, setIsRoomOpen] = useState(true);

  const handleNameChange = text => {
    setRoomName(text);
    console.log('Cambiando nombre a: ', text);
  };

  const convertToNumberIfValid = (
    value,
    originalValue,
    limitToInt = false,
    ceiling = null,
  ) => {

    let cleanedValue = value;
    if (value instanceof String) {
      cleanedValue = limitToInt ? value.replace(/[^0-9]/g, '') : value;
    }
    if (value < 0 || (ceiling && value > ceiling)) return originalValue;
    const parsedValue = limitToInt
      ? parseInt(cleanedValue)
      : Number(cleanedValue);
    console.log('VALORES: ');
    console.log('originalValue: ', originalValue);
    console.log('cleanedValue: ', cleanedValue);
    if (cleanedValue.startsWith('0')) {
      cleanedValue = cleanedValue.replace(/^0+/, '');
    }
    return isNaN(parsedValue) ? originalValue : cleanedValue;
  };

  const convertToNumberIfValidSalas = (
    value,
    originalValue,
    limitToInt = false,
    ceiling = null,
  ) => {

    let cleanedValue = value;
    if (value instanceof String) {
      cleanedValue = limitToInt ? value.replace(/[^0-9]/g, '') : value;
    }
    if (value <= 0 || (ceiling && value > ceiling)) return originalValue;
    const parsedValue = limitToInt
      ? parseInt(cleanedValue)
      : Number(cleanedValue);
    return isNaN(parsedValue) ? originalValue : cleanedValue;
  };


  const [shouldShowMoviePicker, setShouldShowMoviePicker] = useState(false);
  const [movieId, setMovieId] = useState(null);

  const initRooms = [];
  const [rooms, setRooms] = useState(initRooms);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: mostrar círculo de loading o algo así
      try {
        const response = await requestSender.getCinemaRooms(
          token,
          cinemaData._id,
        );
        setRooms(rooms.concat(response.data));
        console.log('StarCinema got response for get rooms: ', response);
      } catch (err) {
        console.log('Error getting rooms: ', err);
        showMessage({
          message: 'Hubo un error buscando las salas del cine',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      }
      try {
        const response = await requestSender.getMovies(token);
        console.log('StarCinema got response for GET /movies: ', response.data);
        setMovies(
          response.data.map(movie => {
            return {
              label: movie.name,
              value: movie._id,
            };
          }),
        );
      } catch (err) {
        console.log('Error getting movies: ', err);
        showMessage({
          message: 'Hubo un error buscando las películas',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          backgroundColor: Assets.COLORS.RedColor,
          color: Assets.COLORS.WhiteColor,
        });
      }
    };
    fetchData().then(() => {});
  }, []);

  
  const ownerFinishedOnboarding =
    configureStore.getState().user.user.hasFinishedOnboarding;
  const cinemaData =
    configureStore.getState().cinemas.cinemas[route.params.cinemaId];
  const token = configureStore.getState().user.token;

  console.log('Owner finished onboarding? -> ', ownerFinishedOnboarding);
  console.log(
    `StarCinema read cinema data for cinema "${cinemaData.name}": `,
    cinemaData,
  );
  const [roomName, setRoomName] = useState('');
  console.log('StarCinema read token: ', token);

  const handleNext = async () => {
    const data = {
      columns: parseInt(columns),
      isOpen: isRoomOpen,
      movieId,
      name: roomName,
      seatPrice: parseFloat(seatPrice),
      rows: parseInt(rows),
    };
    console.log('Showing data for api:');
    console.log(data);
    console.log('Reading user data from: ', configureStore.getState().user);
    console.log(
      'User finished onboarding? -> ',
      configureStore.getState().user.user.hasFinishedOnboarding,
    );
    if (!columns || !movieId || !roomName || !seatPrice || !rows) {
      showMessage({
        message: 'Debe completar todos los campos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    }
    try {
      console.log('Creating room for cinema: ', cinemaData._id);
      const response = roomId
        ? await requestSender.updateCinemaRoom(
            token,
            data,
            cinemaData._id,
            roomId,
          )
        : await requestSender.createCinemaRoom(token, data, cinemaData._id);
      console.log('Response after creation: ', response.data);
      setRooms(upsertById(rooms, response.data));
      console.log('Updated rooms: ', rooms);
      setModalVisibleCompanyName(false);
      setColumns('1');
      setIsRoomOpen(true);
      setMovieId(null);
      setRoomName('');
      setSeatPrice('0');
      setRows('1');
      setRoomId(null);
      showMessage({
        message: `¡Sala ${roomId ? 'actualizada' : 'creada'} exitosamente!`,
        type: 'success',
        icon: 'success',
        duration: 4000,
        backgroundColor: Assets.COLORS.GreenColor,
        color: Assets.COLORS.WhiteColor,
      });
    } catch (err) {
      console.log('Error creating room: ', err);
      showMessage({
        message: `Hubo un error ${roomId ? 'actualizando' : 'creando'} la sala`,
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
  };

  const handleEdit = roomData => {
    setColumns(roomData.columns.toString());
    setIsRoomOpen(roomData.isOpen);
    setMovieId(roomData.movieId);
    setRoomName(roomData.name);
    setSeatPrice(roomData.seatPrice.toString());
    setRows(roomData.rows.toString());
    setRoomId(roomData._id);
    console.log('Editing room: ', JSON.stringify(roomData, null, 2));
    setModalVisibleCompanyName(true);
  };

  const handleDelete = async roomData => {
    try {
      console.log('Borrando sala: ', roomData);
      await requestSender.deleteCinemaRoom(token, cinemaData._id, roomData._id);
      setRooms(
        rooms.filter(room => {
          console.log(`Comparando ${room._id} con ${roomData._id}`);
          return room._id !== roomData._id;
        }),
      );
      showMessage({
        message: '¡Sala eliminada exitosamente!',
        type: 'success',
        icon: 'success',
        duration: 4000,
        backgroundColor: Assets.COLORS.GreenColor,
        color: Assets.COLORS.WhiteColor,
      });
    } catch (err) {
      console.log('Error deleting room: ', err);
      showMessage({
        message: 'Hubo un error eliminando la sala',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
  };

  const handleContinue = () => {
    if (ownerFinishedOnboarding) {
      navigation.navigate('CinemaRegistration04', {
        rooms,
        cinemaId: cinemaData._id,
      });
    } else {
      navigation.navigate('OnBoardingThree', {
        rooms,
        cinemaId: cinemaData._id,
      });
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemNumber}>{index + 1}</Text>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <View style={styles.buttonContainerFL}>
        <TouchableOpacity
          style={styles.buttonFL}
          onPress={() => handleEdit(item)}>
          <Assets.SVG.Pencil />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonFL}
          onPress={() => handleDelete(item)}>
          <Assets.SVG.TaskIcon />
        </TouchableOpacity>
      </View>
    </View>
  );

  const incrementRow = () => {
    setRightContainer(false);
    setLeftContainer(true);
    setRows(
      convertToNumberIfValidSalas(parseInt(rows) + 1, parseInt(rows), true, 10),
    );
  };

  const decrementRow = () => {
    setRightContainer(false);
    setLeftContainer(true);
    setRows(
      convertToNumberIfValidSalas(parseInt(rows) - 1, parseInt(rows), true, 10),
    );
  };

  const incrementColumn = () => {
    setLeftContainer(false);
    setRightContainer(true);
    setColumns(
      convertToNumberIfValidSalas(
        parseInt(columns) + 1,
        parseInt(columns),
        true,
        10,
      ),
    );
  };

  const decrementColumn = () => {
    setLeftContainer(false);
    setRightContainer(true);
    setColumns(
      convertToNumberIfValidSalas(
        parseInt(columns) - 1,
        parseInt(columns),
        true,
        10,
      ),
    );
  };

  const handleRoomOpennessChange = () => {
    console.log('Is open: ', isRoomOpen);
    setIsRoomOpen(!isRoomOpen);

    console.log('Is open2: ', isRoomOpen);    
  };

  const buttonColor = isRoomOpen ? 'black' : 'white';

  const [nameLabel, setNameLabel] = useState(false);
  const [priceLabel, setPriceLabel] = useState(false);
  const [leftContainer, setLeftContainer] = useState(false);
  const [rightContainer, setRightContainer] = useState(false);

  const handleCancelModal = () => {
    console.log('ISOPEN CRUZ', isRoomOpen);
    setIsRoomOpen(true);
    setModalVisibleCompanyName(false);
    setColumns('1');
    setMovieId(null);
    setRoomName('');
    setSeatPrice('0');
    setRows('1');
    setRoomId(null);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {ownerFinishedOnboarding ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HomePageOwner')}>
          <Assets.SVG.Back />
        </TouchableOpacity>
      ) : null}

      <Text style={styles.heading}>Mi cine</Text>
      <View
        style={[
          styles.inputContainer,
          roomName && styles.inputContainerFocused,
        ]}>
        <Text style={styles.label}>Nombre del establecimiento</Text>
        <View style={styles.inputSubContainer}>
          <Text style={styles.inputHeader}>{cinemaData.name}</Text>
        </View>
      </View>
      <View style={styles.containerUpCinema}>
        <Text style={styles.titleCinema}>Alta de salas de Cine</Text>
        <TouchableOpacity
          onPress={() => {
            [
              setModalVisibleCompanyName(true),
              setRightContainer(false),
              setLeftContainer(false),

            ];
          }}>
          <Assets.SVG.Plus />
        </TouchableOpacity>
      </View>

      {/* MODAL NOMBRE EMPRESA */}
      <Modal
        visible={modalVisibleCompanyName}
        transparent={true}
        animationType="fade">
        <ScrollView style={styles.scrollViewStyle}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.buttonCruz}
                onPress={handleCancelModal}>
                <Assets.SVG.Cruz />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Datos de la sala</Text>

              <TextInputComponent
                label="Nombre de la Sala "
                handleTextChange={handleNameChange}
                valor={roomName}
              />
              <TextInputComponent
                label="Precio por Butaca"
                handleTextChange={val =>
                  setSeatPrice(convertToNumberIfValid(val, seatPrice))
                }
                valor={seatPrice}
                keyboardType="numeric"
              />

              <View style={{ zIndex: 2, marginTop: '2%' }}>
                <DropDownPicker
                  placeholder="Película a proyectar"
                  dropDownContainerStyle={styles.dropDownContainer}
                  style={styles.dropDownStyle}
                  open={shouldShowMoviePicker}
                  value={movieId}
                  items={movies}
                  itemKey="value"
                  maxHeight={180}
                  autoScroll={true}
                  setOpen={setShouldShowMoviePicker}
                  setValue={setMovieId}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  searchable={true}
                  searchPlaceholder="Buscar..."
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

              <Text style={styles.sizeCinemaTitle}>Tamaño de sala</Text>

              <View style={styles.sizeCinemaTitleContainer}>
                <View
                  style={[
                    styles.sizeContainer,
                    leftContainer && styles.sizeContainerFocused,
                  ]}>
                  <View style={styles.sizeLeftContainer}>
                    <Text style={styles.sizeStyle}>Filas</Text>
                    <Text
                      style={styles.inputSizeStyle}
                      placeholderTextColor={Assets.COLORS.Subtitle}>
                      {rows}
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <TouchableOpacity
                      style={styles.arrowSizeStyle}
                      onPress={incrementRow}>
                      <Assets.SVG.ArrowUp />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.arrowSizeStyle}
                      onPress={decrementRow}>
                      <Assets.SVG.ArrowDown />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    styles.sizeContainer,
                    rightContainer && styles.sizeContainerFocused,
                  ]}>
                  <View style={styles.sizeLeftContainer}>
                    <Text style={styles.sizeStyle}>Columnas</Text>
                    <Text
                      style={styles.inputSizeStyle}
                      placeholderTextColor={Assets.COLORS.Subtitle}>
                      {columns}
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <TouchableOpacity
                      style={styles.arrowSizeStyle}
                      onPress={incrementColumn}>
                      <Assets.SVG.ArrowUp />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.arrowSizeStyle}
                      onPress={decrementColumn}>
                      <Assets.SVG.ArrowDown />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.containerButton}>
                <TouchableOpacity
                  style={isRoomOpen ? styles.openButton : styles.closedButton}
                  onPress={handleRoomOpennessChange}>
                  <Text
                    style={[styles.placeHolderButton, { color: buttonColor }]}>
                    {isRoomOpen ? 'Abierto' : 'Cerrado'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonForward}
                  onPress={() => handleNext()}>
                  <Assets.SVG.Forward />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      {/*FIN MODAL */}

      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
      {rooms.length ? (
        <TouchableOpacity
          style={styles.buttonContainerContinuar}
          onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      ) : null}
    </KeyboardAvoidingView>
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Assets.COLORS.WhiteColor,
  },
  modalName: {
    marginTop: '3%',
    fontSize: 18,
    marginLeft: '5%',
    color: Assets.COLORS.WhiteColor,
  },
  heading: {
    fontSize: 24,
    marginTop: '5%',
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  inputContainer: {
    width: '100%',
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 1,
  },
  inputContainerLabel: {
    width: '100%',
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 0.6,
  },
  inputContainerFocused: {
    width: '100%',
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 1,
  },
  label: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 18,
    marginLeft: '10%',
    marginTop: '2%',
    fontStyle: 'italic',
  },
  inputSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '10%',
  },
  inputHeader: {
    marginTop: '2%',
    width: '100%',
    height: '80%',
    borderRadius: 10,
    fontSize: 16,
    color: Assets.COLORS.WhiteColor,
    marginBottom: '3%',
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

  // MODAL
  scrollViewStyle: {
    //backgroundColor: 'red',
    //paddingTop: 100,
    //flex: 1,
  },
  modalContainer: {
    //flex: 9,
    //height: '100%',
    //width: '100%',
    height: windowHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Assets.COLORS.Background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    width: '80%',
    padding: '5%',
  },
  buttonCruz: {
    alignSelf: 'flex-start',
    paddingBottom: '4%',
  },
  input: {
    zIndex: 1,
    borderRadius: 10,
    paddingHorizontal: '5%',
    fontSize: 20,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
    alignContent: 'flex-end',
    width: '100%',
  },
  dropDownContainer: {
    position: 'Relative',
    top: '-3%',
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
    fontSize: 20,
  },
  dropDownStyle: {
    marginVertical: '3%',
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
  },
  dropDownPickerSearchContainer: {
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
  },
  sizeCinemaTitle: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 5,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  sizeCinemaTitleContainer: {
    flexDirection: 'row', // Alineación horizontal
    justifyContent: 'space-between', // Espacio entre los contenedores
    borderRadius: 10, // Bordes redondeados
    //backgroundColor: 'red',
  },
  sizeContainer: {
    flexDirection: 'row',
    width: '48%',
    height: 70,
    paddingRight: 10,
    justifyContent: 'space-between',
    backgroundColor: Assets.COLORS.Tertiary,
    borderRadius: 10, // Bordes redondeados
    opacity: 0.3,
  },
  sizeContainerFocused: {
    flexDirection: 'row',
    width: '48%',
    height: 70,
    paddingRight: 10,
    justifyContent: 'space-between',
    backgroundColor: Assets.COLORS.Tertiary,
    borderRadius: 10, // Bordes redondeados
    opacity: 1,
  },

  sizeStyle: {
    fontSize: 15,
    //marginLeft: 10,
    fontWeight: 'bold',
    color: Assets.COLORS.WhiteColor,
  },
  inputSizeStyle: {
    zIndex: 1,
    borderRadius: 10,
    fontSize: 20,
    color: Assets.COLORS.WhiteColor,
    alignContent: 'flex-end',
    marginBottom: '3%',
  },
  sizeLeftContainer: {
    width: '75%',
    paddingLeft: '12%',
    justifyContent: 'space-around',
  },

  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  arrowSizeStyle: {
    paddingHorizontal: '12%',
    paddingVertical: '12%',
  },

  //BOTON
  containerButton: {
    width: '100%',
    // backgroundColor: 'red',
    marginTop: '5%',
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: '6%',
    alignItems: 'center',
    marginBottom: '2%',
  },
  buttonForward: {
    //marginHorizontal: '8%',
    justifyItem: 'center',
    alignContent: 'center',
    // backgroundColor: 'red',
  },
  buttonContainerContinuar: {
    alignItems: 'center',
    marginBottom: '2%',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '8%',
    paddingVertical: '5%',
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonOK,
    marginBottom: '5%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  openButton: {
    width: '100%',
    // textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '4%',
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonOK,
  },
  closedButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '4%',
    borderRadius: 50,
    backgroundColor: Assets.COLORS.ButtonNotOk,
  },
  placeHolderButton: {
    fontSize: 20,
    fontWeight: 'bold',
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

export default CinemaRegistration03;
