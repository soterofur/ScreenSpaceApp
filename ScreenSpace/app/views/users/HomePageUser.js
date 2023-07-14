import React, { useEffect, useState, useRef } from 'react';
import {
  PanResponder,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import Assets from '../../components/Assets';
import { requestSender } from '../../../networking/endpoints';
import configureStore from '../../../redux/store';
import { showMessage } from 'react-native-flash-message';
import { stringInsensitiveIncludes } from '../../components/utils';
import Geolocation from '@react-native-community/geolocation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const dimensions = {
  padding: 0.05 * windowWidth,
  movieItemMarginHorizontal: 0.2 * windowWidth,
  movieItemMarginBottom: 0.02 * windowHeight,
  movieItemWidth: 0.35 * windowWidth, // ancho del botón de filtro + margen derecho
  movieItemAspectRatio: 1, // para que sea cuadrado
  filterButtonWidth: 0.15 * windowWidth,
  filterButtonAspectRatio: 1,
  searchContainerMarginRight: 0.02 * windowWidth,
  searchInputHeight: 0.08 * windowHeight,
};

const MainScreen = ({ navigation }) => {
  const username = configureStore.getState().user.user.name;
  const token = configureStore.getState().user.token;  
  let latitude = null;
  let longitude = null;
  const [modalVisible, setModalVisible] = useState(false);

  const [filter, setFilter] = useState(false);

  //const [mov, setMov] = useState([]);
  const [shouldShowMoviePicker, setShouldShowMoviePicker] = useState(false);
  const [movieId, setMovieId] = useState(null);

  //GENEROS
  const [shouldShowGenres, setShouldShowGenres] = useState(false);
  const [genresId, setGenresId] = useState(null);

  const genres = [
    { label: 'Acción', value: 'accion' },
    { label: 'Animación', value: 'animacion' },
    { label: 'Aventura', value: 'aventura' },
    { label: 'Biografía', value: 'biografia' },
    { label: 'Ciencia ficción', value: 'ciencia_ficcion' },
    { label: 'Comedia', value: 'comedia' },
    { label: 'Crimen', value: 'crimen' },
    { label: 'Documental', value: 'documental' },
    { label: 'Drama', value: 'drama' },
    { label: 'Familia', value: 'familia' },
    { label: 'Fantasía', value: 'fantasia' },
    { label: 'Guerra', value: 'guerra' },
    { label: 'Historia', value: 'historia' },
    { label: 'Misterio', value: 'misterio' },
    { label: 'Musical', value: 'musical' },
    { label: 'Romance', value: 'romance' },
    { label: 'Suspenso', value: 'suspenso' },
    { label: 'Terror', value: 'terror' },
    { label: 'Thriller', value: 'thriller' },
    { label: 'Western', value: 'western' },
  ];

  //Cines
  const [shouldShowCinema, setShouldShowCinema] = useState(false);
  const [cinemaId, setCinemaId] = useState(null);
  const [cinemaList, setCinemaList] = useState([]);

  const dropDownRef = useRef(null);

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreChange = item => {
    setSelectedGenre(item.value);
  };

  const [distancia, setDistancia] = useState(3);
  const handleDistanciaChange = valor => {
    setDistancia(valor);
  };
  const [priceLabel, setPriceLabel] = useState(false);

  const [rating, setRating] = useState(0);
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          {i <= rating ? (
            <Assets.SVG.StarSelected />
          ) : (
            <Assets.SVG.StarUnSelected />
          )}
        </TouchableOpacity>,
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [movieDataById, setMovieDataById] = useState({});

  const isMovieComingInMoreThanSevenDays = date => {
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    return timeDiff / (1000 * 3600 * 24) > 7;
  };

  const fetchData = async () => {

    console.log('FETCH latitude is: ', latitude);
    console.log('FETCH longitude is: ', longitude);
    try {
      const moviesQuery = {};
      if (cinemaId) {
        console.log('cinemaId is: ', cinemaId);
        moviesQuery.cinemaId = cinemaId;
      }
      if (rating) {
        console.log('rating is: ', rating);
        moviesQuery.rating = rating;
      }
      if (selectedGenre) {
        console.log('selectedGenre is: ', selectedGenre);
        moviesQuery.genre = selectedGenre;
      }
      if (latitude && longitude) {
        console.log('latitude is: ', latitude);
        console.log('longitude is: ', longitude);
        moviesQuery.distance = distancia;
        moviesQuery.latitude = latitude;
        moviesQuery.longitude = longitude;
      }
      console.log('Using moviesQuery: ', JSON.stringify(moviesQuery, null, 2));
      const response = await requestSender.getMovies(token, moviesQuery);
      console.log(
        'User homepage got response for GET /movies: ',
        response.data,
      );
      let allMovies = [];
      let allMoviesData = {};
      for (const movie of response.data) {
        allMovies.push({
          label: movie.name,
          value: movie._id,
        });
        console.log('MOVIEEEEEEEEEEEEEEEEEEEE= ', movie.name)
        allMoviesData[movie._id] = movie;
      }
      setMovies(allMovies);
      setFilteredMovies(allMovies);
      setMovieDataById(allMoviesData);
      console.log('DONE SETTING MOVIES');
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

  const fetchCinemasData = async () => {
    try {
      const response = await requestSender.getCinemas(token);
      console.log(
        'User homepage got response for GET /cinemas: ',
        response.data,
      );
      setCinemaList(
        response.data.map(c => {
          return { label: c.name, value: c._id };
        }),
      );
    } catch (err) {
      console.log('Error getting cinemas: ', err);
    }
  };

  useEffect(() => {
    fetchData().then(() => {});
    fetchCinemasData().then(() => {});
  }, []);

  const getCurrentPositionPromise = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        info => resolve(info),
        error => reject(error)
      );
    });
  };
  
  const handleFilteredSearch = async () => {
    try {
      const info = await getCurrentPositionPromise();
      latitude = info.coords.latitude;
      longitude = info.coords.longitude;
      
      await fetchData();
      setModalVisible(false);
    } catch (error) {
      console.error('Error getting geolocation:', error);
    }
  };

  const handleNameFilterChange = text => {
    setFilteredMovies(
      movies.filter(m => {
        return stringInsensitiveIncludes(m.label, text);
      }),
    );
  };

  const renderMovieItem = ({ item }) => {
    const movieData = movieDataById[item.value];
    const releaseDate = new Date(movieData.releaseDate);
    const releasesInMoreThanSevenDays =
      isMovieComingInMoreThanSevenDays(releaseDate);
    return (
      <TouchableOpacity
        style={styles.movieItemWrapper}
        onPress={() => navigation.navigate('MovieDetails', item.value)}>
        <View style={styles.movieItem}>
          <View style={styles.moviePhotoContainer}>
            {releasesInMoreThanSevenDays && (
              <View style={styles.releaseOverlay}>
                <Text style={styles.releaseText}>
                  PRÓXIMAMENTE{' '}
                  {releaseDate.toLocaleString('es-AR', {
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
            <Image
              source={{ uri: movieData.photo.url }}
              style={[
                styles.moviePhoto,
                releasesInMoreThanSevenDays && styles.moviePhotoEstreno,
              ]}
            />
          </View>
          <Text style={styles.movieName}>{movieData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //ACA ARRANCA LA PANTALLA
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.subHeader}>
          <Text style={styles.welcomeText}>
            ¡Hola, {username.split(' ')[0]}!
          </Text>
          <Text style={styles.welcomeText}>¿Qué te gustaría ver?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileStyle}
          onPress={() => navigation.navigate('UserProfile')}>
          <Assets.SVG.Profile />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="¿Qué película querés ver?"
            placeholderTextColor={Assets.COLORS.Subtitle}
            onChangeText={handleNameFilterChange}
            style={styles.filterInput}
          />
          <Assets.SVG.Browse />
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.filterButton}>
          <Assets.SVG.Filter />
        </TouchableOpacity>
      </View>

      {movies.length === Object.keys(movieDataById).length ? (
        <FlatList
          data={filteredMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.moviesContainer}
        />
      ) : null}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <View style={styles.cruzStyle}>
              <TouchableOpacity
                style={styles.buttonCruz}
                onPress={() => setModalVisible(false)}>
                <Assets.SVG.Cruz />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCleanFilter}
                onPress={() => {
                  setCinemaId(null);
                  setSelectedGenre(null);
                  setDistancia(3);
                  setRating(null);
                  setFilter(false);
                }}>
                <Text style={styles.buttonTextCleanFilter}>Quitar filtros</Text>
              </TouchableOpacity>
            </View>

            <View style={{ zIndex: 2 }}>
              <DropDownPicker
                placeholder="Cine"
                dropDownContainerStyle={styles.dropDownCineContainer}
                style={styles.dropDownCineStyle}
                open={shouldShowCinema}
                value={cinemaId}
                items={cinemaList}
                itemKey="value"
                maxHeight={180}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                setOpen={setShouldShowCinema}
                setValue={setCinemaId}
                searchable={true}
                searchPlaceholder="Buscar..."
                searchContainerStyle={{
                  borderBottomColor: Assets.COLORS.Tertiary,
                }}
                searchTextInputStyle={{
                  color: Assets.COLORS.WhiteColor,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                textStyle={{
                  fontSize: 20,
                  color: Assets.COLORS.Subtitle,
                  fontFamily: 'Roboto',
                }}
                arrowStyle={{
                  color: Assets.COLORS.WhiteColor,
                }}
              />
            </View>

            <View style={[styles.SliderBoxStyle]}>
              <Text style={styles.distanceName}>Distancia: {distancia} km</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.sliderStyle}
                  minimumValue={0}
                  maximumValue={10}
                  minimumTrackTintColor="#781C84"
                  maximumTrackTintColor="white"
                  thumbTintColor="#0DF5E3" // Cambiar color del punto
                  minimumTrackWidth={10} // Cambiar grosor de la línea
                  step={0.5}
                  value={distancia}
                  onValueChange={handleDistanciaChange}
                />
              </View>
            </View>

            <View style={{ zIndex: 2 }}>
              <DropDownPicker
                placeholder="Género"
                dropDownContainerStyle={styles.dropDownGenresContainer}
                style={styles.dropDownGenresStyle}
                open={shouldShowGenres}
                value={selectedGenre}
                items={genres}
                defaultValue={selectedGenre}
                onChangeItem={handleGenreChange}
                maxHeight={120}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                //modalAnimationType="slide"
                //showsVerticalScrollIndicator={true}
                setOpen={setShouldShowGenres}
                setValue={setSelectedGenre}
                //searchable={false}
                //searchPlaceholder="Buscar..."

                searchContainerStyle={{
                  borderBottomColor: Assets.COLORS.Tertiary,
                }}
                searchTextInputStyle={{
                  color: Assets.COLORS.WhiteColor,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                textStyle={{
                  fontSize: 20,
                  color: Assets.COLORS.Subtitle,
                  fontFamily: 'Roboto',
                }}
                arrowStyle={{
                  color: Assets.COLORS.WhiteColor,
                }}
              />
            </View>

            <View style={[styles.inputContainerFocused]}>
              <Text style={styles.modalName}>Calificación:</Text>
              {renderStars()}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleFilteredSearch}
                style={styles.button}>
                <Text style={styles.buttonText}>Filtrar </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  releaseOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  releaseText: {
    fontSize: 13,
    color: Assets.COLORS.WhiteColor,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    padding: dimensions.padding,
    backgroundColor: Assets.COLORS.Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0.02 * windowHeight,
  },
  subHeader: {
    height: 70,
  },
  welcomeText: {
    flex: 1,
    fontSize: 0.03 * windowHeight,
    color: Assets.COLORS.WhiteColor,
  },
  profileStyle: {
    paddingHorizontal: '3%',
    paddingVertical: '3%',
  },
  userIcon: {
    marginLeft: 0.02 * windowWidth,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0.02 * windowHeight,
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: dimensions.searchContainerMarginRight,
    paddingHorizontal: 0.02 * windowWidth,
    backgroundColor: Assets.COLORS.Tertiary,
    borderRadius: 10,
    borderColor: Assets.COLORS.WhiteColor,
  },
  searchIcon: {
    marginLeft: 0.01 * windowWidth,
  },
  filterInput: {
    flex: 1,
    height: '10%',
    color: Assets.COLORS.WhiteColor,
    fontSize: 16,
  },
  filterTextInput: {
    color: Assets.COLORS.WhiteColor,
  },
  filterButton: {
    //width: dimensions.filterButtonWidth,
    aspectRatio: dimensions.filterButtonAspectRatio,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Assets.COLORS.Tertiary,
    //borderWidth: 1,
    paddingHorizontal: '4.5%',
    paddingVertical: '4.5%',
  },
  moviesContainer: {
    padding: 0.01 * dimensions.movieItemMarginHorizontal,
  },
  movieItem: {
    alignItems: 'center',
    marginHorizontal: dimensions.movieItemMarginHorizontal,
    marginBottom: 3 * dimensions.movieItemMarginBottom,
    width: dimensions.movieItemWidth,
    aspectRatio: dimensions.movieItemAspectRatio,
    borderRadius: 10,
    backgroundColor: Assets.COLORS.Background,
    borderWidth: 0,
    borderColor: Assets.COLORS.WhiteColor,
    flexGrow: 1,
  },
  moviePhotoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  moviePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moviePhotoEstreno: {
    opacity: 0.3,
  },
  movieName: {
    marginTop: 0.01 * windowHeight,
    color: Assets.COLORS.WhiteColor,
    fontSize: 0.03 * windowHeight,
  },
  movieItemWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: dimensions.movieItemMarginHorizontal,
    marginBottom: dimensions.movieItemMarginBottom,
  },

  // MODAL
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
    padding: '5%',
    width: '80%',
  },
  buttonCruz: {
    alignSelf: 'flex-start',
    //paddingBottom: '4%'
  },
  cruzStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCleanFilter: {
    backgroundColor: Assets.COLORS.ButtonNotOk,
    //height: '100%',
    borderRadius: 40,
    paddingVertical: '1%',
    paddingHorizontal: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextCleanFilter: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 14,
    //fontWeight: 'bold',
  },

  //DROPDOWN CINES
  dropDownCineContainer: {
    placeholderTextColor: 'red',
    position: 'relative',
    top: 0,
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
    fontSize: 20,
  },
  dropDownCineStyle: {
    marginTop: '7%',
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
  },
  dropDownPickerSearchContainer: {
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
  },
  //SLIDER
  SliderBoxStyle: {
    marginTop: '7%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
  },
  distanceName: {
    marginTop: '3%',
    fontSize: 18,
    marginLeft: '3%',
    color: Assets.COLORS.WhiteColor,
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
  },
  sliderStyle: {
    width: '100%',
  },

  //DROPDOWN GENEROS
  dropDownGenresContainer: {
    position: 'Relative',
    top: 0,
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
    fontSize: 20,
  },
  dropDownGenresStyle: {
    marginTop: '7%',
    backgroundColor: Assets.COLORS.Tertiary,
    borderWidth: 0,
  },

  //CALIFICACION
  inputContainerFocused: {
    marginTop: '7%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 1,
  },
  modalName: {
    marginTop: '3%',
    fontSize: 18,
    marginLeft: '3%',
    color: Assets.COLORS.WhiteColor,
  },

  //ESTRELLAS
  starContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    marginLeft: 10,
  },

  //BOTON
  buttonContainer: {
    width: '70%',
    height: 45,
    marginTop: '7%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: Assets.COLORS.ButtonOK,
    height: '100%',
    borderRadius: 40,
    marginVertical: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Assets.COLORS.BlackColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
};

export default MainScreen;
