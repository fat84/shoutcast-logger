import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import LogIn from '../views/LogIn';
import LogOut from '../views/LogOut';
import Dashboard from '../views/Dashboard';
import Stations from '../views/Stations';
import Songs from '../views/Songs';
import Header from '../Header/Header';
import PrivateRoute from '../HOC/PrivateRoute';
import { fetchUser, getStations } from '../../actions';

const Landing = () => <p>landing</p>

class App extends Component {
	componentDidMount(){
		this.props.fetchUser()
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.user){
			this.props.getStations()
		}
	}

	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<div>
						<Header />
						<Route exact path='/' component={Landing} />
						<Route exact path='/login' component={LogIn} />
						<PrivateRoute exact path='/dashboard' component={Dashboard} />
						<PrivateRoute exact path='/stations' component={Stations} />
						<PrivateRoute exact path='/songs' component={Songs} />
						<PrivateRoute exact path='/logout' component={LogOut} />
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

function mapStateToProps({user}){
	return { user }
}

export default connect(mapStateToProps, { fetchUser, getStations })(App);
