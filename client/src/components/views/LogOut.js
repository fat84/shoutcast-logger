import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logOut } from '../../actions'

const LogOut = props => {
   const handleLogOut = () => {
      props.logOut().then(() => props.history.push('/'))
   }
   return  <button onClick={handleLogOut} type="button">Log Out</button>
}

export default connect(null, { logOut })(withRouter(LogOut));