import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Assets from '../../components/Assets';

const BuyTickets01 = ({ navigation, route }) => {
  console.log('buyTickets01 recibió route.params: ', route.params);

  const cinemas = [];
  for (const [key, value] of Object.entries(route.params.shows)) {
    cinemas.push({ _id: key, name: value.name });
  }

  const renderItem = ({ item }) => {
    console.log('Rendering item: ', item);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BuyTickets02', {
            movie: route.params,
            cinemaId: item._id,
          })
        }>
        <View style={styles.cinemaContainer}>
          <Text style={styles.cinemaName}>{item.name}</Text>
          <Text style={styles.cinemaDistance}></Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecciona un cine</Text>
      </View>
      <FlatList
        data={cinemas}
        renderItem={renderItem}
        keyExtractor={item => item._id}
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
  cinemaContainer: {
    backgroundColor: Assets.COLORS.Tertiary,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: width * 0.03,
  },
  cinemaName: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.035,
  },
  cinemaDistance: {
    color: Assets.COLORS.Subtitle,
    fontSize: width * 0.03,
  },
});
export default BuyTickets01;
