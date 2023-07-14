import React, { useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList,Dimensions } from 'react-native';
import Assets from '../../components/Assets';
import configureStore from '../../../redux/store';

const { width, height } = Dimensions.get('window');

const HomePageOwner = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  let cinemasInit = []

  for (const [key, value] of Object.entries(configureStore.getState().cinemas.cinemas)) {
    // console.log(${key}: ${value});
    cinemasInit.push(value);
  }
  const [myCinemas, setMyCinemas] = useState(cinemasInit);



  console.log('myCinemas contains: ', configureStore.getState().cinemas.cinemas)
    
  const renderItem = ({item }) => (
    <View style={styles.item}>
      <View style={styles.dataContainer}>
        <Text style={styles.textName}>{item.name}</Text>
        <Text style={styles.textStreet}>{item.street}</Text>
      </View>
      <TouchableOpacity style={styles.containerPencil}
       onPress={() => navigation.navigate('CinemaMenu', {setMyCinemas,item}
       
       )}>
          <Assets.SVG.Pencil/>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Assets.SVG.Screen style={styles.screenImage}/>
        <Assets.SVG.Space style={styles.screenImage}/>
        <Assets.SVG.Rocket2/>
      </View>
      
      <FlatList style={styles.containerFlatlist}
      data={myCinemas}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    
      /> 
      <View style={styles.containerFooter}>
        <TouchableOpacity style={styles.buttons} onPress={()=> navigation.navigate('OwnerProfile')}>
          <Assets.SVG.Account/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={()=> navigation.navigate('CinemaRegistration01')}>
          <Assets.SVG.Plus/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    flex: 1,
    backgroundColor: Assets.COLORS.Background,
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  containerLogo:{
    marginHorizontal: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:height * 0.05,
  },
  screenImage:{
    width: width * 0.2,
    height: height * 0.2,
    marginRight: width * 0.03,
  },
  containerFlatlist:{
    marginTop: '15%',
    flex: 10,
    // backgroundColor: 'cyan'
  },
  item:{
    paddingHorizontal: '5%',
    paddingTop: '3%',
    marginBottom: '3%',
    borderRadius: 20,
    borderWidth: 1,
    // height: '100%',
    backgroundColor: Assets.COLORS.Tertiary,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataContainer:{
    marginBottom: '4%'
  },
  containerPencil:{
    // backgroundColor: 'green',
    width: '7%',
    // height: '100%',
    alignItems:'center',
    paddingTop: '3%',
  },
  containerFooter:{
    // flex: 1,
    // backgroundColor: 'cyan',
    marginTop: '2%',
    marginBottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    height:'5%',
    justifyContent: 'space-evenly',
  }, 
  buttons:{
    // backgroundColor: 'green',
    width:'10%',
    justifyContent: 'center',
    alignItems:'center',
    height: '100%',
  }, 
  textName:{
    color: Assets.COLORS.WhiteColor,
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textStreet:{
    color: Assets.COLORS.WhiteColor,
    fontWeight: '200',
    fontSize: 18,
  },
});

export default HomePageOwner;
