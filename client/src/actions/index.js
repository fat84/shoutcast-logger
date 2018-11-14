import axios from 'axios';
import * as types from './types';


export const logIn = user => async dispatch => {
   const res = await axios.post('/api/auth/login', user);
   const { data } = res;
   window.localStorage.setItem('x-auth', res.headers['x-auth']);
   dispatch({type: types.LOGIN_USER, payload: data})
}
export const logOut = () => async dispatch => {
   const token = window.localStorage.getItem('x-auth');
   await axios.delete('/api/auth/logout', { 'headers': { 'x-auth': token } });
   window.localStorage.removeItem('x-auth');
   dispatch({type: types.LOGIN_USER, payload: false})
}

export const fetchUser = () => async dispatch => {
   const token = window.localStorage.getItem('x-auth');
   if (token){
      const res = await axios.get('/api/auth/user', { 'headers': { 'x-auth': token } })
      dispatch({type: types.FETCH_USER, payload: res.data})
   } else {
      dispatch({type: types.FETCH_USER, payload: false});
   }
}

export const getStations = () => async dispatch => {
   const token = window.localStorage.getItem('x-auth');
   const res = await axios.get('/api/stations', { 'headers': { 'x-auth': token } });
   dispatch({ type: types.GET_STATIONS, payload: res.data})
}

export const getSongsFromStation = id => async dispatch => {
   const token = window.localStorage.getItem('x-auth');
   const res = await axios.get(`/api/songs/${id}`, { 'headers': { 'x-auth': token } });
   dispatch({ type: types.GET_SONGS_FROM_STATION, payload: res.data})
}

export const deleteStation = id => async dispatch => {
   const token = window.localStorage.getItem('x-auth');
   const res = await axios.delete(`/api/stations/${id}`, { 'headers': { 'x-auth': token } });
   dispatch({type: types.UPDATE_USER, payload: res.data});
}

export const addStation = station => async dispatch => {
   const token = window.localStorage.getItem('x-auth');
   const res = await axios.post('/api/stations/add', station, { 'headers': { 'x-auth': token } })
   console.log(res.data)
   dispatch({type: types.UPDATE_USER, payload: res.data})
}