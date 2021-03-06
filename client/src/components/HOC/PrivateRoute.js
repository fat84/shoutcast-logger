import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
   <Route
      {...rest}
      render={(props) => (
         window.localStorage.getItem('x-auth')
            ? <Component {...props}/>
            : <Redirect to='/login'/>
         )
      }
   />
)

export default PrivateRoute;