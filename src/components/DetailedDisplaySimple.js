import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import DetailedDisplay from './DetailedDisplay'

export default class DetailedDisplaySimple extends Component {


  renderDisplay = (key) => {
    const data = this.props.data[key]
    return(
      <Table striped bordered condensed hover key={key}>
       <thead>
         <tr className={
           data.description === 'Errors' ? 'table-danger' :
           data.description === 'Alerts' ? 'table-warning' :
           data.description === 'Features' ? 'table-success' :
           data.description === 'Structural Elements' ? 'table-primary' :
           data.description === 'ARIA and HTML5' ? 'table-info' :
           data.description === 'Contrast Errors' ? 'table-secondary' : ''
         }>
            <th scope="row">{data.description}</th>
            <th>Count</th>
            <th>Description</th>
         </tr>
       </thead>
          <DetailedDisplay data={data.items} />
     </Table>
    )
  }

  render() {
    const data = this.props.data
    return(
      <div>
      {
        Object
         .keys(this.props.data)
         .map(this.renderDisplay)
      }
      </div>
    )
  }
}
