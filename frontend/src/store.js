import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import allReducer from './store/reducers';
import wsMiddleware from './middleware/middleware'

const initialState = {};

const middleware = [thunk, wsMiddleware];

const store = createStore(allReducer, initialState, 
    composeWithDevTools(applyMiddleware(...middleware))
    );


export default store;