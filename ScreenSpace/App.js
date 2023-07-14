import React, { useEffect, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-screens';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import LoginUser from './app/views/users/LoginUser';
import Login from './app/views/owners/Login';
import ForgotPassword from './app/views/owners/ForgotPassword';
import CreateAccount from './app/views/owners/CreateAccount';
import OnBoardingOne from './app/views/owners/onBoardingOne';
import CinemaRegistration01 from './app/views/owners/CinemaRegistration01';
import CinemaRegistration02 from './app/views/owners/CinemaRegistration02';

import HomePageOwner from './app/views/owners/HomePageOwner';
import CinemaMenu from './app/views/owners/CinemaMenu';
import OwnerProfile from './app/views/owners/OwnerProfile';
import ModifyPassword from './app/views/owners/ModifyPassword';
import HomePageUser from './app/views/users/HomePageUser';
import ModifyData from './app/views/owners/ModifyData';
import UserProfile from './app/views/users/UserProfile';
import MovieDetails from './app/views/users/MovieDetails';
import FlashMessage from 'react-native-flash-message';
import MovieComments from './app/views/users/MovieComments';
import MapScreen from './app/components/MapScreen';
import CinemaRegistration03 from './app/views/owners/CinemaRegistration03';
import OnBoardingTwo from './app/views/owners/onBoardingTwo';
import OnBoardingThree from './app/views/owners/onBoardingThree';
import OnBoardingFour from './app/views/owners/onBoardingFour';
import CinemaRegistration04 from './app/views/owners/CinemaRegistration04';
import SplashScreen from 'react-native-splash-screen';
import BuyTickets01 from './app/views/users/buyTickets01';
import BuyTickets02 from './app/views/users/buyTickets02';
import BuyTickets03 from './app/views/users/buyTickets03';
import BuyTickets04 from './app/views/users/buyTickets04';
import BuyTickets05 from './app/views/users/buyTickets05';


const store = configureStore;
const Stack = createStackNavigator();

const RootNavigation = () => {
  const storeData = store.getState();
  const userData = storeData.user;
  const cinemaData = storeData.cinemas?.cinemas;
  console.log('App: userData contains: ', userData);
  console.log('App: cinemaData contains: ', cinemaData);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userData.token ? (
          userData.user.isOwner ? (
            userData.user.hasFinishedOnboarding ? (
              <>
                <Stack.Screen name="HomePageOwner" component={HomePageOwner} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="OnBoardingOne" component={OnBoardingOne} />
                <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
                <Stack.Screen name="HomePageUser" component={HomePageUser} />
              </>
            ) : cinemaData && Object.values(cinemaData)?.length ? (
              <>
                <Stack.Screen
                  name="OnBoardingTwo"
                  component={OnBoardingTwo}
                  initialParams={{ cinemaId: Object.values(cinemaData)[0]._id }}
                />
                <Stack.Screen name="OnBoardingOne" component={OnBoardingOne} />
                <Stack.Screen name="HomePageOwner" component={HomePageOwner} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="HomePageUser" component={HomePageUser} />
              </>
            ) : (
              <>
                <Stack.Screen name="OnBoardingOne" component={OnBoardingOne} />
                <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
                <Stack.Screen name="HomePageOwner" component={HomePageOwner} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="HomePageUser" component={HomePageUser} />
              </>
            )
          ) : (
            <>
              <Stack.Screen name="HomePageUser" component={HomePageUser} />
              <Stack.Screen name="HomePageOwner" component={HomePageOwner} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="OnBoardingOne" component={OnBoardingOne} />
              <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="OnBoardingOne" component={OnBoardingOne} />
            <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
            <Stack.Screen name="HomePageOwner" component={HomePageOwner} />
            <Stack.Screen name="HomePageUser" component={HomePageUser} />
          </>
        )}
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="ModifyPassword" component={ModifyPassword} />
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="BuyTickets01" component={BuyTickets01} />
        <Stack.Screen name="BuyTickets02" component={BuyTickets02} />
        <Stack.Screen name="BuyTickets03" component={BuyTickets03} />
        <Stack.Screen name="BuyTickets04" component={BuyTickets04} />
        <Stack.Screen name="BuyTickets05" component={BuyTickets05} />
        <Stack.Screen
          name="CinemaRegistration01"
          component={CinemaRegistration01}
        />
        <Stack.Screen
          name="CinemaRegistration02"
          component={CinemaRegistration02}
        />
        <Stack.Screen name="OnBoardingThree" component={OnBoardingThree} />
        <Stack.Screen
          name="CinemaRegistration03"
          component={CinemaRegistration03}
        />
        <Stack.Screen name="OnBoardingFour" component={OnBoardingFour} />
        <Stack.Screen
          name="CinemaRegistration04"
          component={CinemaRegistration04}
        />
        <Stack.Screen name="OwnerProfile" component={OwnerProfile} />
        <Stack.Screen name="ModifyData" component={ModifyData} />
        <Stack.Screen name="MovieComments" component={MovieComments} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} />
        <Stack.Screen name="CinemaMenu" component={CinemaMenu} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
      <FlashMessage
        position="top"
        style={{
          borderRadius: 10,
          marginTop: '5%',
          marginHorizontal: '5%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '5%',
        }}
      />
    </NavigationContainer>
  );
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <RootNavigation />
        </PersistGate>
      </Provider>
    </Fragment>
  );
};

export default App;
