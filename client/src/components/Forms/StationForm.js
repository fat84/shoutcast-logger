/***********************
 * TODO:
 * 1.) check html string and append 'http://' if missing
 * 2.) check if url is a valid stream
 * 3.) after passing obj to action creators - add statin and update user
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addStation } from '../../actions';

class Stations extends Component {
	constructor(props){
		super(props);
		this.state= { name: '', url: '' }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
	}

   handleChange(event, key) {
      this.setState({[key]: event.target.value});
   }

   handleSubmit(event) {
      event.preventDefault();
      let { url, name } = this.state;
      if (!url.includes('http://')){
         url = 'http://' + url;
      }
      this.props.addStation({name, url})
   }

	render(){
		return(
         <form onSubmit={this.handleSubmit}>
            <label>
               name:
               <input type="text" value={this.state.name} onChange={e => this.handleChange(e, 'name')}/>
            </label>
            &emsp;
            <label>
               url:
               <input type="text" value={this.state.url} onChange={e => this.handleChange(e, 'url')}/>
            </label>
            <input type="submit" value="add"/>
         </form>
		)
	}
	
}


export default connect(null, { addStation })(Stations);
