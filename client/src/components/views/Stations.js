import React from 'react';
import { connect } from 'react-redux';
import { getStations } from '../../actions'

const Stations = props => {
   const handleClick = () => {
		props.getStations(props.user.stationIds)
	}
	const renderStations = () => {
		if (props.stations){
			return <ul>{props.stations.map(s => <li key={s.url}>{s.name}</li>)}</ul>
		}
		return null;
	}

	return(
		<div>
			<p>stations</p>
			<button onClick={handleClick} type="button">get stations</button>
			{renderStations()}
		</div>
	)
}

function mapStateToProps({user, stations}){
	return { user, stations }
}

export default connect(mapStateToProps, { getStations })(Stations);
