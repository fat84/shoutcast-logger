import { combineReducers } from 'redux'
import userReducer from './userReducer';
import stationReducer from './stationReducer';
import songReducer from './songReducer';

export default combineReducers({
	user: userReducer,
	stations: stationReducer,
	songs: songReducer
});