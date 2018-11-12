import React from 'react';
import { connect } from 'react-redux';

const Stations = props => {
	const renderStations = () => {
		if (props.stations){
			return <ul>{props.stations.map(s => <li key={s.url}>{s.name}</li>)}</ul>
		}
		return null;
	}

	return(
		<div>
			<p>stations</p>
			{renderStations()}
		</div>
	)
}

function mapStateToProps({stations}){
	return { stations }
}

export default connect(mapStateToProps)(Stations);
