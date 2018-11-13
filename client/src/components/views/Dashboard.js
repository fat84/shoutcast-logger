import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = props => {
	return(
		<div>
			<p>dashboard</p>
			<Link to="/stations">stations</Link>
			<Link to="/logout">log out</Link>
		</div>
	)
}

export default Dashboard;
