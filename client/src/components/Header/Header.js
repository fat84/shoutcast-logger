import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from './Nav'


class Header extends Component {
   renderContent(){
      switch(this.props.user){
         case null:
            return <Nav isLogged={false} />
         case false:
            return <Nav isLogged={false} />
         default:
            return <Nav isLogged={true} />
      }
   }

   render(){
      return(
         <div>
            <h2>Header / Nav</h2>
            {this.renderContent()}
         </div>
      )
   }
   
}

function mapStateToProps({user}){
   return { user }
}

export default connect(mapStateToProps)(Header);
