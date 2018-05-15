import {Component} from 'react'
import { webaim } from '../config/endpoint'

class ContentSearch extends Component {


  webAim = async (url, key, credit) => {
      var urlencoded = encodeURIComponent(url);
      let search = await this.search(webaim + `?key=${key}&url=${urlencoded}&reporttype=${credit}`)
      return search
  }


  search = async (searchType) => {
    try {
        let response = await fetch(searchType);
        return await response.json();
    } catch (e) {
        return {

        }
    }
  }

}

const contentSearch = new ContentSearch();

export default contentSearch;
