import React, {Component} from 'react'
import { Table } from 'react-bootstrap'

export default class Results extends Component {

  renderDisplay = (key) => {
    const data = this.props.data[key]
    var waveurlencoded = "http://wave.webaim.org/report#/" + encodeURIComponent(data.statistics.pageurl);
    return(
    <tr key={key}>
      <td className="col-md-3 page-url-column">
        <a href={waveurlencoded} target="_blank">{data.statistics.pageurl}</a>
      </td>
      <td>{data.categories.error.count}</td>
      <td>{data.categories.alert.count}</td>
      <td>{data.categories.feature.count}</td>
      <td>{data.categories.structure.count}</td>
      <td>{data.categories.aria.count}</td>
      <td>{data.categories.contrast.count}</td>
    </tr>
  )
  }

  render() {
    return(
      <div className="table-responsive">
      <Table striped bordered condensed hover>
		    <thead>
			     <tr>
				      <th>Website (linked to WAVE report)</th>
				      <th scope="row" className="table-danger">Errors</th>
				      <th scope="row" className="table-warning">Alert</th>
				      <th scope="row" className="table-success">Feature</th>
              <th scope="row" className="table-primary">Structure</th>
              <th scope="row" className="table-info">HTML 5</th>
              <th scope="row" className="table-secondary">Contrast</th>
			     </tr>
		     </thead>
         <tbody>
         {
           Object
            .keys(this.props.data)
            .map(this.renderDisplay)
          }
        </tbody>
	      </Table>
      </div>
    )
  }
}
