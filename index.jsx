import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import {nodeReducer} from './nodeReducer.jsx';
import {createSocketMiddleware} from './socketMiddleware.jsx';

/* eslint-disable */
import OlMap from './olMap.jsx';
/* eslint-enable */

const middlewares = [
    createSocketMiddleware
];

const combinedReducers = combineReducers({
    nodeReducer
});

const enhancers = [
    applyMiddleware(...middlewares)
];

export const RenderNodeUpdater = () => {
    const store = createStore(
        combinedReducers,
        composeWithDevTools(
            ...enhancers
        )
    );
    ReactDOM.render(
        <Provider store={store}>
            <OlMap />
        </Provider>,
        document.getElementById('main')
    );
};
