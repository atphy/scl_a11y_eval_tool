import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

export default class DetailedDisplay extends Component {

  renderDisplay = (key) => {
    const data = this.props.data[key];
    const link = "details.html?attr="+data.id;
    return(
      <tr key={key}>
        <td><a href={link} target='_blank'>{data.id}</a></td>
        <td>{data.count}</td>
        <td>{data.description}</td>
      </tr>
    )
  }

  render() {
    const data = this.props.data
    if(data){
	    return(
	      <tbody>
	      {
	        Object
	         .keys(data)
	         .map(this.renderDisplay)
	       }
	      </tbody>
	    )
	} else {
		return(<p>No data here.</p>)
	}
  }
}
