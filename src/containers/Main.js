import React, {Component} from 'react'
import SearchForm from '../components/Form'
import ContentSearch from '../util/search'
import Results from '../components/Results'
import Detailed from '../components/Detailed'
import Tabs from '../components/Tabs'
import ExportForm from '../components/ExportForm'
import * as Convert from '../util/convertData';
import { saveAs } from 'file-saver';
import moment from 'moment';
import {CSVLink} from 'react-csv'

export default class Main extends Component {

  state = {
    data: [],
    display: 'basic',
    loading: false,
    error: false,
    errorText: '',
    credits: 0,
    tabDisplay: 1,
    exportDisplay: false
  }

  handleSearch = async (items) => {

    const urls = items.urls.split(/\s+/);
    this.setState({
      loading: true,
      data: []
    })
    for (let i = 0; i < urls.length; i++) {
      const entry = urls[i].replace(/.*?:\/\//g, '').trim();
      let search = await ContentSearch.webAim(entry, items.api, items.credits)
      if(search.categories) {
      this.setState({
          data: this.state.data.concat(search),
      })
    } else {
      this.setState({
        error: true,
        errorText: search.error
      })
    }
    }

    const data = this.state.data
    data.map((value, index) =>
      this.setState({
        credits: value.statistics.creditsremaining
      })
    )

    this.setState({loading: false})
  }

  handleDisplay = (value) => {
    this.setState({
      display: value
    })
  }

  removeError = () => {
    this.setState({
      error: false
    })
  }

  setDisplay = (value) => {
    this.setState({
      tabDisplay: value
    })
  }

  exportData = (data) => {
    switch(data.type){
      case 'CSV':
        saveAs(Convert.toCSV(this.state.data, this.state.tabDisplay), `${data.name}.csv`)
      break;
      case 'HTML':
        saveAs(Convert.toHTML(this.state.data, this.state.tabDisplay), `${data.name}.html`)
      break;
      case 'JSON':
        saveAs(Convert.toJSON(this.state.data), `${data.name}.json`)
      break;
      default:
        alert('Error: unknown file type');
    }

  }

  toggle = (e) => {
    this.setState({exportDisplay: !this.state.exportDisplay});

  }

  render() {
    const display = this.state.display
    const data = this.state.data
    const date = new Date()
    const headers = [
      'PageURL',
      'Errors',
      'Alerts',
      'Feature',
      'Structure',
      'Aria',
      'Contrast'
    ];
    const set = data.map((value, index) =>
      [
        value.statistics.pageurl,
        value.categories.error.count,
        value.categories.alert.count,
        value.categories.feature.count,
        value.categories.structure.count,
        value.categories.aria.count,
        value.categories.contrast.count
      ]
    )

    return (
      <div className="container-fluid">
      {this.state.loading
          ?
          <div className="loading">Loading&#8230;</div>
          : ''
      }
      {this.state.error
        ?
          <div className="alert alert-danger alert-dismissible fade show error-alert" role="alert">{this.state.errorText}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.removeError}>
            <span aria-hidden="true">&times;</span>
          </button>
          </div>
        : ''
      }
        <div className="row">
          <nav className="col-sm-4 col-md-3 d-none d-sm-block bg-dark sidebar">
            <SearchForm
              handleSearch={this.handleSearch}
              credits={this.state.credits}
              display={this.setDisplay}
            />
          </nav>
          <main className="col-sm-8 ml-sm-auto col-md-9 pt-3" role="main">
            <h1 className="main-summary">Summary Report</h1>
            <div className="alert alert-dark" role="alert">
              <span className="message">This tool leverages the <a href="http://wave.webaim.org/api/" target="_blank">WAVE API</a> developed by <a href="http://webaim.org/"  target="_blank">WebAIM</a>. Please visit their websites to learn more about web accessibility and to purchase API credits. <br/><a href='docs.html' target='_blank'>Read the User Documentation.</a></span>
            </div>
            {
              this.state.exportDisplay ?
                  <ExportForm
                    handleExport={this.exportData}
                  />
              : ''
            }
            <div className="float-right export-button">
              <button className="btn btn-primary" onClick={(e) => this.toggle(e)}>Export</button>
            </div>
            <Tabs
              display={this.handleDisplay}
              tabDisplay={this.state.tabDisplay}
            />
            {
              display === 'basic' ? <Results data={this.state.data} /> :
              display === 'detailed' ? <Detailed data={this.state.data} /> :
              <Results data={this.state.data} />
            }
          </main>
        </div>
      </div>
    )
  }
}
