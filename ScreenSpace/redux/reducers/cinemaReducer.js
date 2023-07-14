import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestSender } from '../../networking/endpoints';
import configureStore from '../store';

const initialState = {
  error: null,
  cinemas: {},
};

export const createCinema = createAsyncThunk(
  'createCinema',
  async (cinemaData, { rejectWithValue }) => {
    try {
      const token = configureStore.getState().user.token;
      const response = await requestSender.createCinema(token, cinemaData);
      console.log(`createCinema async thunk | ${response.data}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateCinema = createAsyncThunk(
  'updateCinema',
  async ({ id, cinemaData }, { rejectWithValue }) => {
    try {
      console.log('updateCinema: ', cinemaData)
      const token = configureStore.getState().user.token;
      const response = await requestSender.updateCinema(token, id, cinemaData);
      console.log(`updateCinema async thunk | ${response.data}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteCinema = createAsyncThunk(
  'deleteCinema',
  async (id, { rejectWithValue }) => {
    try {
      const token = configureStore.getState().user.token;
      const response = await requestSender.deleteCinema(token, id);
      console.log(`deleteCinema async thunk | ${response.data}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const getMyCinemas = createAsyncThunk(
  'getMyCinemas',
  async ({ rejectWithValue }) => {
    try {
      console.log('getting cinemas');
      const token = configureStore.getState().user.token;
      const response = await requestSender.getMyCinemas(token);
      return response.data;
    } catch (err) {
      console.log('Se rompió get cinemas: ', err);
      return rejectWithValue(err.response?.data);
    }
  },
);

const cinemaSlice = createSlice({
  name: 'cinema',
  initialState,
  reducers: {},
  extraReducers: {
    [createCinema.pending]: state => {
      state.error = null;
    },
    [createCinema.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [createCinema.fulfilled]: (state, action) => {
      console.log(
        'createCinema has been fulfilled:',
        JSON.stringify(action.payload, null, 2),
      );
      console.log(
        `Storing cinema with id ${action.payload._id} in store: `,
        action.payload,
      );
      state.cinemas[action.payload._id] = action.payload;
    },
    [updateCinema.pending]: state => {
      state.error = null;
    },
    [updateCinema.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [updateCinema.fulfilled]: (state, action) => {
      console.log(
        'updateCinema has been fulfilled:',
        JSON.stringify(action.payload, null, 2),
      );
      console.log(
        `Storing cinema with id ${action.payload._id} in store: `,
        action.payload,
      );
      state.cinemas[action.payload._id] = action.payload;
    },
    [deleteCinema.pending]: state => {
      state.error = null;
    },
    [deleteCinema.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [deleteCinema.fulfilled]: (state, action) => {
      console.log(
        'deleteCinema has been fulfilled:',
        JSON.stringify(action.payload, null, 2),
      );
      console.log(
        `Storing cinema with id ${action.payload._id} in store: `,
        action.payload,
      );
      console.log('ACTIONNNNNNNNNNNNN', action);
      delete state.cinemas[action.meta.arg];
      console.log('termine de borrar= ', state.cinemas);
    },
    [getMyCinemas.pending]: state => {
      state.error = null;
    },
    [getMyCinemas.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    [getMyCinemas.fulfilled]: (state, action) => {
      console.log(
        'getMyCinemas has been fulfilled:',
        JSON.stringify(action.payload, null, 2),
      );
      state.cinemas = {};
      for (const cinema of action.payload) {
        console.log(`Storing cinema with id ${cinema._id} in store.`);
        state.cinemas[cinema._id] = cinema;
      }
    },
  },
});

const cinemaReducer = cinemaSlice.reducer;
export default cinemaReducer;
