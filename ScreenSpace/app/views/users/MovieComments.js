import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Assets from '../../components/Assets';
import { requestSender } from '../../../networking/endpoints';
import { showMessage } from 'react-native-flash-message';
import configureStore from '../../../redux/store';
import { dateIsMoreThanSevenDaysAheadOfCurrentTime } from '../../components/utils';

const { width, height } = Dimensions.get('window');

const MovieComments = ({ navigation, route }) => {
  const [userScore, setUserScore] = useState(0);
  const [userCommentText, setUserCommentText] = useState('');
  const [postedComments, setPostedComments] = useState([]);
  const [commentsWereLoaded, setCommentsWereLoaded] = useState(false);
  const [movie, setMovie] = useState(route.params);
  const token = configureStore.getState().user.token;
  const userData = configureStore.getState().user.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestSender.getMovieScores(token, movie._id);
        console.log(
          'MovieComments got response for GET /movies/:id/scores: ',
          response.data,
        );
        setPostedComments(response.data);
        setCommentsWereLoaded(true);
      } catch (err) {
        console.log('Error getting comments: ', err);
        showMessage({
          message: 'Hubo un error buscando los comentarios de la película',
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
      </View>
    );
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setUserScore(i)}>
          {i <= userScore ? (
            <Assets.SVG.StarSelected />
          ) : (
            <Assets.SVG.StarUnSelected />
          )}
        </TouchableOpacity>,
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderComment = commentToRender => {
    console.log(commentToRender.item)
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>
            {commentToRender.item.userId.name}
          </Text>
          <View style={styles.tagContainer}>
            <Assets.SVG.Star />
            <Text style={styles.tagText}>{commentToRender.item.score}</Text>
          </View>
        </View>
        <Text style={styles.commentText}>{commentToRender.item.comment}</Text>
      </View>
    );
  };
  const handleGoBack = () => {
  navigation.navigate('MovieDetails',movie._id);

};
  const handleSubmit = async () => {
    if (!userScore || !userCommentText) {
      showMessage({
        message: 'Debe completar el contenido del comentario y seleccionar un puntaje',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return;
    }
    try {
      const response = await requestSender.createMovieScore(
        token,
        {
          comment: userCommentText,
          score: userScore,
        },
        movie._id,
      );
      const newMovieDetails = await requestSender.getMovieDetails(token, movie._id);
      const newPostedComments = await requestSender.getMovieScores(token, movie._id);
      setMovie(newMovieDetails.data);
      setPostedComments(newPostedComments.data);
      setUserScore(0);
      setUserCommentText('');
      showMessage({
        message: '¡Comentario enviado exitosamente!',
        type: 'success',
        icon: 'success',
        duration: 4000,
        backgroundColor: Assets.COLORS.GreenColor,
        color: Assets.COLORS.WhiteColor,
      });

    } catch (err) {
      console.log('Error creating score: ', JSON.stringify(err, null, 2));
      showMessage({
        message: `Hubo un error enviando el comentario`,
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
        <TouchableOpacity onPress={handleGoBack}>
          <Assets.SVG.Back style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Comentarios</Text>
      </View>
  
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
  
      <View style={styles.commentsContainer}>
        <FlatList
          data={postedComments}
          renderItem={renderComment}
          keyExtractor={item => item._id}
          numColumns={1}
          contentContainerStyle={styles.moviesContainer}
        />
      </View>
  
      {!commentsWereLoaded ||
      postedComments.some(
        comment => comment.userId._id === userData._id,
      ) ? null : (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Comentario</Text>
          <TextInput
            style={styles.input}
            multiline
            value={userCommentText}
            onChangeText={setUserCommentText}
            placeholder="Escribe tu comentario aquí..."
          />
          {renderStars()}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Assets.COLORS.Background,
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  headerText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  back: {
    width: width * 0.08,
    height: height * 0.04,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: Assets.COLORS.Tertiary,
    borderRadius: width * 0.03,
    color: Assets.COLORS.WhiteColor,
    marginBottom: height * 0.01,
    padding: width * 0.03,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  submitButton: {
    backgroundColor: Assets.COLORS.ButtonOK,
    borderRadius: width * 0.05,
    padding: width * 0.03,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.2,
  },
  submitButtonText: {
    color: Assets.COLORS.Background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  moviePhotoContainer: {
    width: width * 0.3,
    height: height * 0.2,
    borderRadius: width * 0.03,
    overflow: 'hidden',
  },
  moviePhoto: {
    width: '100%',
    height: '100%',
  },
  movieInfoContainer: {
    flex: 1,
    marginLeft: width * 0.05,
  },
  movieName: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  commentsContainer: {
    flex: 1,
  },
  commentContainer: {
    backgroundColor: Assets.COLORS.Tertiary,
    borderRadius: width * 0.03,
    padding: width * 0.03,
    marginBottom: height * 0.01,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  commentUserName: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  commentText: {
    color: Assets.COLORS.WhiteColor,
    fontSize: width * 0.04,
  },
  movieTagsContainer: {
    flexDirection: 'column',
    marginBottom: height * 0.01,
  },
  tagContainer: {
    backgroundColor: Assets.COLORS.MagentaColor,
    borderRadius: width * 0.07,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  tagText: {
    color: Assets.COLORS.WhiteColor,
    marginLeft: width * 0.01,
  },
});

export default MovieComments;
