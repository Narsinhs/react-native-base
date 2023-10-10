
import React, { useEffect, useState } from 'react';
import { Provider } from "react-redux";
import MainRoute from './src/components/routes/MainRoute';
import ToastComponent from "./src/components/sharedComponents/ToastComponent";
import { PersistGate } from 'redux-persist/integration/react';
import StatusBarComponent from './src/components/sharedComponents/StatusBarComponent';
import { LogBox } from 'react-native';
import SplashScreen from "react-native-lottie-splash-screen";
import { persistor, store } from './src/redux/Store';
import useBackPressClose from './src/hooks/useBackPressClose';
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  useBackPressClose()
  LogBox.ignoreAllLogs();
  console.disableYellowBox = true;

  return (
    <Provider store={store} >
      <PersistGate persistor={persistor}>
        <StatusBarComponent barStyle="light-content" />
        <MainRoute />
        <ToastComponent />
      </PersistGate>
    </Provider>
  );
};

export default App;
