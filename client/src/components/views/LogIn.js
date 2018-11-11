import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logIn } from '../../actions'

class LogIn extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: '',
         password: ''
      };

      this.handleEmail = this.handleEmail.bind(this);
      this.handlePassword = this.handlePassword.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }
   componentWillReceiveProps(newProps){
         if (newProps.user.email){
            this.props.history.push('/dashboard')
         }
   }

   handleEmail(event) {
      this.setState({email: event.target.value});
   }
   handlePassword(event) {
      this.setState({password: event.target.value});
   }

   handleSubmit(event) {
      event.preventDefault();
      const { email, password } = this.state;
      this.props.logIn({email, password})
   }

   render() {
      return (
         <form onSubmit={this.handleSubmit}>
         <p>test1@test.com</p>
         <p>userOnePass</p>
            <label>
               email:
               <input type="text" value={this.state.email} onChange={this.handleEmail}/>
            </label>
            &emsp;
            <label>
               password:
               <input type="password" value={this.state.password} onChange={this.handlePassword}/>
            </label>
            <input type="submit" value="Submit"/>
         </form>
      );
   }
}

function mapStateToProps({user}){
      return { user }
}
export default connect(mapStateToProps, { logIn })(withRouter(LogIn));