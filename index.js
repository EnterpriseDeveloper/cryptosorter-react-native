/** @format */
import React from 'react';
import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import basicStore from './store/storage';
import App from './App';
import {name as appName} from './app.json';


const rootRedcuer = combineReducers({
    basic: basicStore
})

const store = createStore(rootRedcuer);

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
