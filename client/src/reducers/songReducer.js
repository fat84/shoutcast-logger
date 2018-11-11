import { GET_SONGS_FROM_STATION } from '../actions/types';

export default function (state = null, action) {

	switch (action.type) {
		case GET_SONGS_FROM_STATION:
			return action.payload;

		default:
			return state
	}
}