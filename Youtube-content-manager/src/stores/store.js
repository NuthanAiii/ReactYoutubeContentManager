import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage/session";
import { persistStore } from "redux-persist";

// Persist configuration, here storage is session storage, and whitelist referf to slice names and also we can have black list.
const persistConfig ={
    key:'root',
    storage,
    whitelist:['login']
}

// root reducer combining all slices

const rootReducer = combineReducers({
    login: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);
export default store;