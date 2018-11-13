import React from 'react';
import { connect } from 'react-redux';
import { deleteStation } from '../../actions';
import StationForm from '../Forms/StationForm';

const Stations = props => {

	const handleClick = id => {
		props.deleteStation(id);
	}

	const renderStations = () => {
		if (props.stations){
			return (
				<ul>
					{props.stations.map(s => (
						<li key={s._id}>
							<button onClick={() => handleClick(s._id)} type="button">REMOVE</button>
							{s.name}
						</li>
					))}
				</ul>
			)
		}
		return null;
	}

	return(
		<div>
			<p>stations</p>
			{renderStations()}
			<StationForm />
		</div>
	)
}

function mapStateToProps({stations}){
	return { stations }
}

export default connect(mapStateToProps, { deleteStation })(Stations);
