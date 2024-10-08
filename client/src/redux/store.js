import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice';

import { version } from "mongoose";
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore } from "redux-persist";


const rootReducer = combineReducers({user:userReducer});

const  persistConfig = {
    key:'root',
    version: 1,
    storage,
}

const persisterReducer = persistReducer(persistConfig, rootReducer)


export const  store = configureStore({
    reducer: persisterReducer,
    middleware: (getDefualtMiddleware) =>
        getDefualtMiddleware({
            serializableCheck: false,
    })
})


export const persistor = persistStore(store);