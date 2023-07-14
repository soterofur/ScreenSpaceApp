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

const BuyTickets03 = ({ navigation, route }) => {
  console.log('buyTickets03 received route.params: ', route.params);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('BuyTickets04', {
          movie: route.params.movie,
          cinemaId: route.params.cinemaId,
          day: route.params.day,
          time: item,
        })
      }
      style={styles.functionContainer}>
      <Text style={styles.functionTime}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecciona una función</Text>
      </View>
      <FlatList
        data={Object.keys(
          route.params.movie.shows[route.params.cinemaId][route.params.day],
        )}
        renderItem={renderItem}
        keyExtractor={item => item}
        numColumns={2}
        columnWrapperStyle={{ flex: 1 }}
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
  functionContainer: {
    backgroundColor: Assets.COLORS.Tertiary,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: width * 0.03,
    flex: 1,
    marginRight: 10,
  },
  functionTime: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.035,
  },
});

export default BuyTickets03;
