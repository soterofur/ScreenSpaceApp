import axios from 'axios';
import { config } from '../config/config';

axios.defaults.baseURL = config.BASE_URL;
axios.defaults.timeout = config.TIME_OUT;

export const requestSender = {
  register: async function (data) {
    console.log('Request sender got register request: ', data);
    const result = await axios.post(
      '/users',
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log('register request result: ', result);
    return result;
  },
  login: async function (data) {
    console.log('Request sender got login request: ', data);
    try {
      const result = await axios.post('/login', data);
      console.log('Axios result: ', result);
      return result;
    } catch (e) {
      throw e; // Necesario, por alguna razón extraña de Javascript
    }
  },
  loginWithGoogle: async function (data) {
    console.log('Request sender got login google request: ', data);
    try {
      const result = await axios.post('/users/googleSession', data);
      console.log('Axios result: ', result);
      return result;
    } catch (e) {
      throw e; // Necesario, por alguna razón extraña de Javascript
    }
  },
  updateUser: async function (token, userId, data) {
    const result = await axios.patch(`/users/${userId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    console.log('update user request result: ', result);
    return result;
  },
  deleteUser: async function (token, userId) {
    const result = await axios.delete(`/users/${userId}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    console.log('delete user request result: ', result);
    return result;
  },
  resetPassword: async function (email) {
    const result = await axios.post('/users/password-reset', { email });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('reset password result: ', result);
    return result;
  },
  newPassword: async function (id, data, token) {
    const result = await axios.put(`/users/${id}/new-password`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-access-token': token,
      },
    });
    console.log('new password result: ', result);
    return result;
  },
  myRestaurants: async function (token) {
    const result = await axios.get('/my-restaurants', {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    console.log('my restaurants request result: ', result);
    return result;
  },
  createCinema: async function (token, data) {
    const result = await axios.post('/cinemas', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('create cinema request result: ', result);
    return result;
  },
  updateCinema: async function (token, cinemaId, data) {
    const result = await axios.patch(`/cinemas/${cinemaId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    console.log('update cinema request result: ', result);
    return result;
  },
  deleteCinema: async function (token, cinemaId) {
    const result = await axios.delete(`/cinemas/${cinemaId}`, {
      headers: {
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('delete cinema request result: ', result);
    return result;
  },
  getMyCinemas: async function (token) {
    const result = await axios.get('/my-cinemas', {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('get my cinemas request result: ', result);
    return result;
  },
  getCinemas: async function (token) {
    const result = await axios.get('/cinemas', {
      headers: {
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('get cinemas request result: ', result);
    return result;
  },
  getCinemaRooms: async function (token, id) {
    const result = await axios.get(`/cinemas/${id}/rooms`, {
      headers: {
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('get cinema rooms request result: ', result);
    return result;
  },
  createCinemaRoom: async function (token, data, cinemaId) {
    const result = await axios.post(`/cinemas/${cinemaId}/rooms`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('create room request result: ', result);
    return result;
  },
  updateCinemaRoom: async function (token, data, cinemaId, roomId) {
    const result = await axios.patch(
      `/cinemas/${cinemaId}/rooms/${roomId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('patch room request result: ', result);
    return result;
  },

  deleteCinemaRoom: async function (token, cinemaId, roomId) {
    const result = await axios.delete(`/cinemas/${cinemaId}/rooms/${roomId}`, {
      headers: {
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('delete room request result: ', result);
    return result;
  },
  getRoomShows: async function (token, cinemaId, roomId) {
    const result = await axios.get(
      `/cinemas/${cinemaId}/rooms/${roomId}/shows`,
      {
        headers: {
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('get room shows request result: ', result);
    return result;
  },
  createRoomShow: async function (token, data, cinemaId, roomId) {
    const result = await axios.post(
      `/cinemas/${cinemaId}/rooms/${roomId}/shows`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('create show request result: ', result);
    return result;
  },
  updateRoomShow: async function (token, data, cinemaId, roomId, showId) {
    const result = await axios.patch(
      `/cinemas/${cinemaId}/rooms/${roomId}/shows/${showId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('patch show request result: ', result);
    return result;
  },
  deleteRoomShow: async function (token, cinemaId, roomId, showId) {
    const result = await axios.delete(
      `/cinemas/${cinemaId}/rooms/${roomId}/shows/${showId}`,
      {
        headers: {
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('delete show request result: ', result);
    return result;
  },
  getMovies: async function (token, params = {}) {
    console.log('getMovies sending request with params: ', JSON.stringify(params, null, 2));
    return await axios.get(`/movies`, {
      headers: {
        'x-access-token': token,
      },
      params,
    });
  },
  getMovieDetails: async function (token, movieId) {
    return await axios.get(`/movies/${movieId}`, {
      headers: {
        'x-access-token': token,
      },
    });
  },
  getMovieScores: async function (token, movieId) {
    return await axios.get(`/movies/${movieId}/scores`, {
      headers: {
        'x-access-token': token,
      },
    });
  },
  createMovieScore: async function (token, data, movieId) {
    console.log('CREATING COMMENT WITH DATA: ', data);
    return await axios.post(`/movies/${movieId}/scores`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
  },
  createReservation: async function (token, data) {
    console.log('CREATING RESERVATION WITH DATA: ', data);
    return await axios.post(`/reservations`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });
  },
  updateRestaurant: async function (token, restaurantId, data) {
    const result = await axios.patch(`/restaurants/${restaurantId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('update restaurant request result: ', result);
    return result;
  },
  deleteRestaurant: async function (token, restaurantId) {
    const result = await axios.delete(`/restaurants/${restaurantId}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('delete restaurant request result: ', result);
    return result;
  },
  createItem: async function (token, restaurantId, data) {
    const result = await axios.post(
      `/restaurants/${restaurantId}/menu/items`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('create item request result: ', result);
    return result;
  },
  updateItem: async function (token, restaurantId, itemId, data) {
    const result = await axios.patch(
      `/restaurants/${restaurantId}/menu/items/${itemId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('update item request result: ', result);
    return result;
  },
  deleteItem: async function (token, restaurantId, itemId) {
    const result = await axios.delete(
      `/restaurants/${restaurantId}/menu/items/${itemId}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    );
    delete result.config; // Es muy grande. Borrar esta línea cuando se borre el console.log de abajo
    console.log('delete item request result: ', result);
    return result;
  },
};
