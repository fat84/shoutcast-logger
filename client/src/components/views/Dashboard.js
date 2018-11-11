import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {
	return(
		<div>
			<p>dashboard</p>
			<Link to="/stations">stations</Link>
			<Link to="/logout">log out</Link>
		</div>
	)
}

function mapStateToProps({user}){
	return { user }
}

export default connect(mapStateToProps)(Dashboard);
