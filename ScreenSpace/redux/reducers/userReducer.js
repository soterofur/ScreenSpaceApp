import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestSender } from '../../networking/endpoints';
import {showMessage} from "react-native-flash-message";
import configureStore from '../store';

const initialState = {
  error: null,
  loading: false,
  token: null,
  user: {},
};

export const register = createAsyncThunk(
  'register',
  async ({email, password, name}, {rejectWithValue}) => {
    try {
      const response = await requestSender.register({email, password, name});
      console.log(`register async thunk | ${response.data}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateUser = createAsyncThunk(
  'update',
  async (receivedUserData, {rejectWithValue}) => {
    try {
      const userDataToUse = {};
      if (receivedUserData.company) {
        userDataToUse.company = receivedUserData.company;
      }
      if (receivedUserData.hasFinishedOnboarding) {
        userDataToUse.hasFinishedOnboarding = receivedUserData.hasFinishedOnboarding;
      }
      if (receivedUserData.name) {
        userDataToUse.name = receivedUserData.name;
      }
      if (receivedUserData.photo) {
        userDataToUse.photo = receivedUserData.photo;
      }
      const storedUserData = configureStore.getState().user;
      const response = await requestSender.updateUser(
        storedUserData.token,
        storedUserData.user._id,
        userDataToUse,
      );
      console.log(`update user async thunk | ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (err) {
      console.log('User patch failed: ', JSON.stringify(err, null, 2))
      return rejectWithValue(err.response?.data);
    }
  },
);

export const login = createAsyncThunk(
  'login',
  async ({email, password}, {rejectWithValue}) => {
    try {
      return await requestSender.login({email, password});
    } catch (err) {
      console.log('Rejecting login with axios: ', err.response?.status)
      showMessage({
        message: err.response?.status === 401 ? 'Las credenciales ingresadas son incorrectas' : 'Hubo un error iniciando la sesión',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return rejectWithValue(err.response?.data);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'loginWithGoogle',
  async (data, {rejectWithValue}) => {
    try {
      return await requestSender.loginWithGoogle(data);
    } catch (err) {
      console.log('Rejecting login with axios: ', err.response?.status)
      showMessage({
        message: err.response?.status === 401 ? 'Las credenciales ingresadas son incorrectas' : 'Hubo un error iniciando la sesión',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
        backgroundColor: Assets.COLORS.RedColor,
        color: Assets.COLORS.WhiteColor,
      });
      return rejectWithValue(err.response?.data);
    }
  }
);

export const logout = createAsyncThunk('logout', async () => {});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [register.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [register.rejected]: (state, action) => {
      console.log(action.error);
      state.error = action.error.message;
      state.loading = false;
    },
    [register.fulfilled]: (state, action) => {
      console.log('register has been fulfilled:', JSON.stringify(action.payload, null, 2));
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    [updateUser.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [updateUser.rejected]: (state, action) => {
      console.log('Falló update de user', action);
      state.error = action.error.message;
      state.loading = false;
    },
    [updateUser.fulfilled]: (state, action) => {
      console.log('updateUser has been fulfilled:', JSON.stringify(action.payload, null, 2));
      state.loading = false;
      state.user = action.payload;
    },
    [login.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [login.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [login.fulfilled]: (state, action) => {
      console.log('login has been fulfilled:', JSON.stringify(action.payload.data, null, 2));
      state.loading = false;
      state.token = action.payload.data.token;
      console.log('action.payload = ',action.payload)
      state.user = action.payload.data.user;
    },

    [loginWithGoogle.pending]: state => {
      state.error = null;
      state.loading = true;
    },
    [loginWithGoogle.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [loginWithGoogle.fulfilled]: (state, action) => {
      console.log('login has been fulfilled:', JSON.stringify(action.payload.data, null, 2));
      state.loading = false;
      state.token = action.payload.data.token;
      console.log('action.payload = ',action.payload)
      state.user = action.payload.data.user;
    },

    [logout.fulfilled]: (state, action) => {
      Object.assign(state, initialState);
      // state = initialState;
      console.log('Logged out');
    },
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
