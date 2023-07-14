import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Share,
} from 'react-native';
import Assets from '../../components/Assets';

import { dateIsMoreThanSevenDaysAheadOfCurrentTime } from '../../components/utils';
import { showMessage } from 'react-native-flash-message';
import { requestSender } from '../../../networking/endpoints';
import configureStore from '../../../redux/store';
const { width, height } = Dimensions.get('window');

const MovieDetails = ({ navigation, route }) => {
  const movieId = route.params;
  const token = configureStore.getState().user.token;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestSender.getMovieDetails(token, movieId);
        console.log(
          'Movie details got response for GET /movie: ',
          response.data,
        );
        setMovie(response.data);
        console.log('Movie details: ', movie)
      } catch (err) {
        console.log('Error getting movie: ', err);
        showMessage({
          message: 'Hubo un error buscando la película',
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

  const handleShare = async (data) => {
    
    data = `¡Mirá esta película! ${movie.name} - ${movie.synopsis}`;

    try {
      await Share.share({
        message: data
      });
    } catch (error) {
      showMessage({
        message: 'Hubo un error al compartir la película',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
    }
  };

  const renderMovieTags = () => {

    return (
      <View style={styles.movieTagsContainer}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{movie.genre}</Text>
        </View>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{movie.duration} min</Text>
        </View>
        <View style={styles.tagContainer}>
          {movie.rating ? (
            <>
              <Assets.SVG.Star />
              <Text style={styles.tagText}>{movie.rating?.toFixed(1)}</Text>
            </>
          ) : !dateIsMoreThanSevenDaysAheadOfCurrentTime(
              new Date(movie.releaseDate),
            ) ? (
            <Text style={styles.tagText}>Sin calificar</Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Assets.SVG.Share />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMovieButtons = () => {
    if (
      dateIsMoreThanSevenDaysAheadOfCurrentTime(new Date(movie.releaseDate))
    ) {
      return (
        <View>
          <Text style={styles.releaseText}>
            PRÓXIMAMENTE{' '}
            {new Date(movie.releaseDate).toLocaleString('es-AR', {
              month: 'numeric',
              day: 'numeric',
            })}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => navigation.navigate('MovieComments', movie)}>
            <Text style={styles.buttonTextComents}>Comentarios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => navigation.navigate('BuyTickets01', movie)}>
            <Text style={styles.buttonTextTikets}>Reservar entradas</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Película</Text>
      </View>

      {movie !== null ? (
        <>
          <View style={styles.movieContainer}>
            <View style={styles.moviePhotoContainer}>
              <Image
                source={{ uri: movie.photo.url }}
                style={styles.moviePhoto}
                resizeMode="cover"
              />
            </View>
            <View style={styles.movieInfoContainer}>
              <Text style={styles.movieName}>{movie.name}</Text>
              {renderMovieTags()}
            </View>
          </View>
          <ScrollView style={styles.scrollContentContainer}>
            <Text style={styles.movieDescription}>{movie.synopsis}</Text>
          </ScrollView>
        </>
      ) : null}
      {movie !== null ? renderMovieButtons() : null}
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
  scrollContentContainer: {
    flexGrow: 1,
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
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  moviePhotoContainer: {
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
  },
  moviePhoto: {
    width: '100%',
    height: '100%',
  },
  movieInfoContainer: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'column',
  },
  movieName: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieTagsContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  tagContainer: {
    backgroundColor: Assets.COLORS.MagentaColor,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  tagText: {
    color: Assets.COLORS.WhiteColor,
    marginLeft: 5,
  },
  movieDescription: {
    fontSize: width * 0.038,
    color: Assets.COLORS.WhiteColor,
    fontWeight: 'light',
    marginBottom: 20,
  },
  releaseText: {
    fontSize: width * 0.04,
    color: Assets.COLORS.WhiteColor,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  commentButton: {
    backgroundColor: Assets.COLORS.ButtonNotOk,
    borderRadius: width * 0.05,
    marginBottom: '5%',
    padding: width * 0.03,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.2,
  },
  reserveButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
    borderRadius: width * 0.05,
    padding: width * 0.03,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.166,
  },
  buttonTextComents: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextTikets: {
    color: Assets.COLORS.Background,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareButton: {
    position: 'absolute',
    bottom: '12%',
    right: '1%',
  },
});

export default MovieDetails;
