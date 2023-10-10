import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './reducers/index';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import Config from '../Config';
const persistConfig = {
    key: Config.PERSIST_SECRET_KEY,
    storage: AsyncStorage,
    whitelist: ['auth', 'journal', 'hunt', 'favoriteLocation', 'slug'],
    stateReconciler: autoMergeLevel2
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };