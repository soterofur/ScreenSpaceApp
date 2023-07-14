import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Assets from '../../components/Assets';
import { requestSender } from '../../../networking/endpoints';
import configureStore from '../../../redux/store';
import { showMessage } from 'react-native-flash-message';

const { width, height } = Dimensions.get('window');

const BuyTickets05 = ({ navigation, route }) => {
  console.log('buyTickets05 received route.params: ', route.params);
  const [modalVisible, setModalVisible] = useState(false);
  const token = configureStore.getState().user.token;

  const handleTicketReservation = async () => {
    try {
      const response = await requestSender.createReservation(token, {
        seats: route.params.selectedSeats,
        seatsUser: route.params.seats,
        showId:
          route.params.movie.shows[route.params.cinemaId][route.params.day][
            route.params.time]._id,
      });
      console.log('Response after creating seats: ', response.data);
      setModalVisible(true);
    } catch (err) {
      console.log('Error creating reservation: ', err);
      showMessage({
        message: 'Hubo un error creando la reserva',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Confirmar reserva</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Película</Text>
        <Text style={styles.value}>{route.params.movie.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>{route.params.day}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cine</Text>
        <Text style={styles.value}>
          {
            route.params.movie.shows[route.params.cinemaId][route.params.day][
              route.params.time
            ].cinemaName
          }
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Función</Text>
        <Text style={styles.value}>{route.params.time} hs</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Entradas</Text>
        <Text style={styles.value}>{route.params.selectedSeats.length}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ubicaciones</Text>
        <Text style={styles.value}>{route.params.seats.sort().join(' - ')}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>${route.params.totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={handleTicketReservation}>
          <Text style={styles.reserveButtonText}>Reservar entradas</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>RESERVA EXITOSA</Text>
            <View style={styles.modalContent}>
              <View style={styles.row}>
                <Text style={styles.label}>Película</Text>
                <Text style={styles.value}>{route.params.movie.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha</Text>
                <Text style={styles.value}>{route.params.day}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cine</Text>
                <Text style={styles.value}>
                  {
                    route.params.movie.shows[route.params.cinemaId][
                      route.params.day
                    ][route.params.time].cinemaName
                  }
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Función</Text>
                <Text style={styles.value}>{route.params.time} hs</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Entradas</Text>
                <Text style={styles.value}>
                  {route.params.selectedSeats.length}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ubicaciones</Text>
                <Text style={styles.value}>{route.params.seats.sort().join(' - ')}</Text>
            </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.value}>${route.params.totalPrice}</Text>
              </View>
              <Text style={styles.modalDescription}>
                Le enviamos un correo electrónico con la reserva. Por favor, no
                olvide llevarlo el día de la función para pedir sus entradas.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => navigation.navigate('HomePageUser')}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Assets.COLORS.Background,
    paddingHorizontal: Dimensions.get('window').width * 0.05, // 5% del ancho total
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10%',
  },
  back: {
    width: 30,
    height: 30,
  },
  headerText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2%',
    marginBottom: '2%',
  },
  label: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  value: {
    color: Assets.COLORS.Subtitle,
    fontSize: width * 0.04,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: height * 0.05,
  },
  reserveButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
    borderRadius: width * 0.05,
    padding: width * 0.03,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.166,
    marginTop: height * 0.05,
  },
  reserveButtonText: {
    color: Assets.COLORS.Background,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
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
    alignItems: 'center',
    padding: '5%',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Assets.COLORS.WhiteColor,
  },
  modalContent: {
    marginBottom: 20,
    alignItems: 'left',
  },
  modalText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.04,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalValue: {
    color: Assets.COLORS.Subtitle,
    fontSize: width * 0.04,
    fontWeight: 'normal',
  },
  modalDescription: {
    color: Assets.COLORS.Subtitle,
    fontSize: width * 0.03,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
    borderRadius: 25,
    paddingHorizontal: '30%',
    paddingVertical: '3%',
  },
  modalButtonText: {
    color: Assets.COLORS.Background,
    fontSize: width * 0.03,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  acceptButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
    borderRadius: width * 0.05,
    padding: width * 0.03,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.166,
  },
  acceptButtonText: {
    color: Assets.COLORS.Background,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BuyTickets05;
