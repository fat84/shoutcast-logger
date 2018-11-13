/***********************
 * TODO:
 * 1.) check html string and append 'http://' if missing
 * 2.) check if url is a valid stream
 * 3.) after passing obj to action creators - add statin and update user
 */

import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { deleteStation } from '../../actions';

class Stations extends Component {
	constructor(props){
		super(props);
		this.state= { name: '', url: '' }
      this.handleName = this.handleName.bind(this);
      this.handleUrl = this.handleUrl.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
	}

   handleName(event) {
		console.log(event.target.value)
      this.setState({name: event.target.value});
   }
   handleUrl(event) {
      this.setState({url: event.target.value});
   }

   handleSubmit(event) {
      event.preventDefault();
      let { url, name } = this.state;
      if (!url.includes('http://')){
         url = 'http://' + url;
      }
      const header = axios.head(url,{
         'headers': { 'User-Agent': 'Mozilla/5.0' }
         })
         .then(res => res.headers['content-type'])
         .catch(e => console.log(e))
      
      console.log(header)
   }

	render(){
		return(
         <form onSubmit={this.handleSubmit}>
            <label>
               name:
               <input type="text" value={this.state.name} onChange={this.handleName}/>
            </label>
            &emsp;
            <label>
               url:
               <input type="text" value={this.state.url} onChange={this.handleUrl}/>
            </label>
            <input type="submit" value="add"/>
         </form>
		)
	}
	
}


export default connect(null, { deleteStation })(Stations);
