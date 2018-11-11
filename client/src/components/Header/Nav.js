import React from 'react';
import { Link } from 'react-router-dom';

const Nav = (props) => {
   const renderNav = () => {
      if(props.isLogged){
         return (
            <ul>
               <li><Link to="/dashboard">dashboard</Link></li>
               <li><Link to="/stations">stations</Link></li>
               <li><Link to="/songs">songs</Link></li>
               <li><Link to="/logout">log out</Link></li>
            </ul>
         )
      } else {
         return <Link to="/login">log in</Link>
      }
   }

	return(
		<div>
         <p>NAV</p>
         {renderNav()}
         <hr/>
		</div>
	)
}

export default Nav;
