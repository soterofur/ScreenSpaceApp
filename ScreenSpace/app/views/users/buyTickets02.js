import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';

import Assets from '../../components/Assets';
const { width, height } = Dimensions.get('window');

const BuyTickets02 = ({ navigation, route }) => {
  console.log('buyTickets02.js got route params: ', route.params);
  delete route.params.movie.shows[route.params.cinemaId].name;
  const days = Object.keys(route.params.movie.shows[route.params.cinemaId]);

  const renderItem = ({ item }) => {
    const amountOfShows = Object.keys(
      route.params.movie.shows[route.params.cinemaId][item],
    ).length;
    return (
      <TouchableOpacity
        style={styles.dayContainer}
        onPress={() =>
          navigation.navigate('BuyTickets03', {
            movie: route.params.movie,
            cinemaId: route.params.cinemaId,
            day: item,
          })
        }>
        <Text style={styles.dayName}>{item}</Text>
        <Text style={styles.dayFunctions}>
          {amountOfShows} {amountOfShows > 1 ? 'funciones' : 'función'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecciona un día</Text>
      </View>
      <FlatList
        data={days}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
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
    marginBottom: 20,
  },
  headerText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  back: {
    width: 30,
    height: 30,
  },
  dayContainer: {
    backgroundColor: Assets.COLORS.Tertiary,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: width * 0.03,
  },
  dayName: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.035,
  },
  dayFunctions: {
    color: Assets.COLORS.Subtitle,
    fontSize: width * 0.03,
  },
});

export default BuyTickets02;
