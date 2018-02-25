import {createStore} from 'redux';
import {AuthReducer} from './Reducers/reducers'
import { combineReducers } from 'redux';
import {applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
let allReducers=combineReducers({AuthReducer})
let  store=createStore(allReducers,applyMiddleware(thunk))

export default store