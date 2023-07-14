import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Assets from '../../components/Assets';
const { width, height } = Dimensions.get('window');

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const BuyTickets04 = ({ navigation, route }) => {
  const { rows, columns, seatPrice, unavailableSeats } =
    route.params.movie.shows
    [route.params.cinemaId]
    [route.params.day]
    [route.params.time];
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  //console.log('buyTickets04 received route.params: ', route.params);

  useEffect(() => {
    initializeSeats();
  }, []);

  const initializeSeats = () => {
    let newSeats = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push({
          id: `${i}-${j}`,
          isSelected: false,
          isOccupied: false,
        });
      }
      newSeats.push(row);
    }

    for (const seatPosition of unavailableSeats) {
      const seatRow = Math.floor(seatPosition / columns);
      const seatColumn = seatPosition % columns;
      newSeats[seatRow][seatColumn].isOccupied = true;
    }
    setSeats(newSeats);
  };

    // Mapeo de valores de i a letras
    const letterMap = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
      5: 'F',
      6: 'G',
      7: 'H',
      8: 'I',
      9: 'J',
      10: 'K',
    };


const [seatsUser, setVector] = useState([]);

const selectSeat = (i, j) => {
  const letterSeat = letterMap[i] + (j + 1);
  console.log('BUTACA: ', letterSeat);
  const isSeatSelected = seatsUser.includes(letterSeat);
  console.log('ESTA SELECCIONADO :',isSeatSelected)

  if (isSeatSelected) {
    // Si el asiento ya está seleccionado, quitarlo del array

    seatsUser.splice(seatsUser.indexOf(letterSeat), 1);

  } else {
    // Si el asiento no está seleccionado, agregarlo al array
    seatsUser.push(letterSeat);
  }
  console.log('Array de Seats: ',seatsUser)

  console.log('Filas: ', i);
  console.log('Columnas: ', j);
  let newSeats = [...seats];
  newSeats[i][j].isSelected = !(
    newSeats[i][j].isOccupied || newSeats[i][j].isSelected
  );
  setSeats(newSeats);
  calculateTotal(newSeats);
  updateSelectedSeats(newSeats);
};


  const updateSelectedSeats = newSeats => {
    const selectedPositions = newSeats.flatMap((row, i) =>
      row
        .map((seat, j) => ({
          isSelected: seat.isSelected,
          position: getPosition(seat, i, j),
        }))
        .filter(seat => seat.isSelected)
        .map(seat => seat.position),
    );
    setSelectedSeats(selectedPositions);
  };

  const calculateTotal = seats => {
    let count = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (seats[i][j].isSelected) {
          count++;
        }
      }
    }
    setSelectedSeats(count);
    setTotalPrice(count * seatPrice);
  };




  const renderSeat = (item, i, j) => {

    const letter = letterMap[i] || '';

    return (
      <View>
        <TouchableOpacity
          disabled={item.isOccupied}
          onPress={() => selectSeat(i, j)}
          style={[
            styles.seat,
            item.isOccupied
              ? styles.occupiedSeat
              : item.isSelected
              ? styles.selectedSeat
              : styles.availableSeat,
          ]}
          key={item.id}>
          <Text style={styles.seatText}>{`${letter}${j + 1}`}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  const getPosition = seat => {
    const i = parseInt(seat.id.split('-')[0], 10);
    const j = parseInt(seat.id.split('-')[1], 10);
    return i * columns + j;
  };

  const renderRow = (item, i) => (
    <View style={styles.seatRow} key={i}>
      {item.map((seat, j) => renderSeat(seat, i, j))}
    </View>
  );

  const canContinue = selectedSeats.length > 0;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecciona las butacas</Text>
      </View>
      <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Pantalla</Text>
      </View>

      <SafeAreaView style={styles.SafeAreaViewStyle}>
        <ScrollView horizontal style={styles.ScrollViewStyle}>
          <ScrollView>
            <View style={styles.seatPlan}>{seats.map(renderRow)}</View>
            
          </ScrollView>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.availableSeat]} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.selectedSeat]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.occupiedSeat]} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Subtotal:</Text>
        <Text style={styles.summaryTotal}>
          {selectedSeats.length} x ${seatPrice}
        </Text>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total:</Text>
        <Text style={styles.summaryTotal}>${totalPrice}</Text>
      </View>
      <TouchableOpacity
        style={[styles.continueButton, !canContinue && styles.disabledButton]}
        onPress={() =>
          navigation.navigate('BuyTickets05', {
            movie: route.params.movie,
            cinemaId: route.params.cinemaId,
            day: route.params.day,
            time: route.params.time,
            seats: seatsUser,
            totalPrice,
            selectedSeats,
          })
        }
        disabled={!canContinue}>
        <Text style={styles.continueText}>Continuar con la reserva</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201A30',
    paddingHorizontal: Dimensions.get('window').width * 0.05, // 5% del ancho total
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  screenContainer: {
    height: '5%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    marginHorizontal: '10%',
    marginBottom: '10%',
    borderRadius: 5,
  },

  back: {
    width: '3%',
    height: '3%',
  },


  SafeAreaViewStyle:{
    flex: 1,
    marginBottom: 20,
    alignSelf: 'center',
  },
  ScrollViewStyle:{
    flexDirection: 'row',
  },
  seatPlan: {
    flex: 1,
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  seat: {
    width: 35,
    height: 35,
    marginHorizontal: 5,
    marginVertical: 5,
    justifyContent: 'center',
  },

  seatText:{
    textAlign: 'center',
    color: Assets.COLORS.Subtitle,
  },


  availableSeat: {
    backgroundColor: '#38304C73',
  },
  selectedSeat: {
    backgroundColor: 'green',
  },
  occupiedSeat: {
    backgroundColor: 'red',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    color: '#fff',
    fontSize: width * 0.035,
    marginLeft: 5,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  summaryTotal: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  continueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    backgroundColor: '#0df5e3',
    marginTop: '10%',
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: '10%',
    paddingVertical: '2%',
  },
  disabledButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
    backgroundColor: '#0df5e3',
    marginTop: '10%',
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: '10%',
    paddingVertical: '2%',
    opacity: 0.2,
  },
  continueText: {
    color: 'black',
    fontSize: width * 0.04,
  },
});

export default BuyTickets04;
