import React from 'react';
import { connect } from 'react-redux';
import { getSongsFromStation } from '../../actions'

const Songs = props => {
   const handleClick = _id => {
		props.getSongsFromStation(_id)
	}
	const renderButtons = () => {
		if (props.stations){
			return props.stations.map(s => <button type="button" key={s.url} onClick={() => handleClick(s._id)}>{s.name}</button>)
		}
		return 'get stations first';
	}

	const renderSongs = () => {
		if(props.songs){
			return(
				<div>
					<ul>
						{props.songs.map(s => <li key={s._id}>{s.time} | {s.artist} - {s.title} | {s.active_listeners} | </li>)}
					</ul>
				</div>
			)
		}
		return null;
	}
	return(
		<div>
			<p>stations</p>
			{renderButtons()}
			{renderSongs()}
		</div>
	)
}

function mapStateToProps({user, stations, songs}){
	return { user, stations, songs }
}

export default connect(mapStateToProps, { getSongsFromStation })(Songs);
