import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStations } from '../../actions';

class Dashboard extends Component {
	componentDidMount(){
		this.props.getStations()
	}

	render(){
		return(
			<div>
				<p>dashboard</p>
				<Link to="/stations">stations</Link>
				<Link to="/logout">log out</Link>
			</div>
		)
	}
}

function mapStateToProps({user}){
	return { user }
}

export default connect(mapStateToProps, { getStations })(Dashboard);
