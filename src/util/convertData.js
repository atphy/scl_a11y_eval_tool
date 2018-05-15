/**
  Original file developed by Hampshire College and can be found here: https://github.com/hampshirecollege/a11y-eval-tool
*/

/**
 * External dependencies
 */
import { map } from 'lodash'
import moment from 'moment'

var toAddHTML = "";

const waitforDocs = (id) => {
	return new Promise((resolve) => {
		getDocs(id);
	});
}

function getDocs(id) {
	var request = new XMLHttpRequest();
    request.open('GET', `http://wave.webaim.org/api/docs?id=${id}`, true);
	request.onload = function () {
		var data = JSON.parse(this.response);
			if (request.status >= 200 && request.status < 400) {
				var gs = data.guidelines;
				console.log(gs);
				for (var i = 0, len = gs.length; i < len; i++){
					var t = gs[i];
					console.log(t);
					console.log(t.link);
					console.log(t.name);
					toAddHTML += `<a href="${t.link}" target="_blank">${t.name}</a>; `;
				}
			}
	}
	request.send();
	return("2");
}


/**
 * Converts summary report data to CSV format
 * @param  {array} data - summary report data
 * @return {blob} blob of converted CSV data
 */
function toCSVSummary(data) {
  let csvData = `"WAVE accessibility summary report: ${moment().format('MMMM Do YYYY, h:mma')}"\nSITE URL,ERRORS,ALERTS,FEATURES,STRUCTURE,HTML5 AND ARIA,CONTRAST\n`;
  map(data, (site) => {
    if (site.status.success === true) {
      csvData += `${site.statistics.pageurl},${site.categories.error.count},${site.categories.alert.count},${site.categories.feature.count},${site.categories.structure.count},${site.categories.html5.count},${site.categories.contrast.count}\n`;
    }
  });

  const blob = new Blob([csvData], { type: 'text/csv' });

  return blob;
}

/**
 * Converts detailed report data to CSV format
 * @param  {array} data - detailed report data
 * @return {blob} blob of converted CSV data
 */
function toCSVDetailed(data) {
  let csvData = `"WAVE accessibility summary report: ${moment().format('MMMM Do YYYY, h:mma')}"\nSITE URL,ERRORS,ALERTS,FEATURES,STRUCTURE,HTML5 AND ARIA,CONTRAST\n`;

  // TODO: refactor this...don't repeat the same snippet from up above
  map(data, (site) => {
    console.log(site)
    if (site.status.success === true) {
      csvData += `${site.statistics.pageurl},${site.categories.error.count},${site.categories.alert.count},${site.categories.feature.count},${site.categories.structure.count},${site.categories.html5.count},${site.categories.contrast.count}\n`;
    }
  });

  csvData += `\n"WAVE accessibility detailed report: ${moment().format('MMMM Do YYYY, h:mma')}"\n\n`;

  map(data, (site) => {
    if (site.status.success === true)  {
      csvData += `URL,ITEM TYPE,ITEM ID,COUNT,DESCRIPTION\n`;
      map(site.categories.error.items, (item) => {
        csvData += `${site.statistics.pageurl},Error,${item.id},${item.count},${item.description}\n`;
      });
      map(site.categories.alert.items, (item) => {
        csvData += `${site.statistics.pageurl},Alert,${item.id},${item.count},${item.description}\n`;
      });
      map(site.categories.feature.items, (item) => {
        csvData += `${site.statistics.pageurl},Feature,${item.id},${item.count},${item.description}\n`;
      });
      map(site.categories.structure.items, (item) => {
        csvData += `${site.statistics.pageurl},Structure,${item.id},${item.count},${item.description}\n`;
      });
      map(site.categories.html5.items, (item) => {
        csvData += `${site.statistics.pageurl},HTML5 and ARIA,${item.id},${item.count},${item.description}\n`;
      });
      map(site.categories.contrast.items, (item) => {
        csvData += `${site.statistics.pageurl},Contrast,${item.id},${item.count},${item.description}\n\n`;
      });
    }
  });

  const blob = new Blob([csvData], { type: 'text/csv' });

  return blob;
}

/**
 * Converts summary report data to HTML format
 * @param  {array} data - summary report data
 * @return {blob} blob of converted HTML data
 */
function toHTMLSummary(data) {
  let htmlData = `<!doctype html>
    <html lang="en">
    <head>
    <meta http-equiv=Content-Type content="text/html">
    <meta charset="utf-8">
    <style>
      table {margin:64px auto;width: 90%}
      table, th, td {border: 1px solid #666;border-collapse: collapse}
      tr:nth-child(even) {background:#f9f9f9}
      tr:nth-child(odd) {background: white}
      tbody tr:hover {background-color:#f5f5f5}
      .th-site {}
      .th-errors {background-color:#f2dede;color:#a94442;}
      .th-alerts {background-color:#fcf8e3;color:#8a6d3b;}
      .th-features {background-color:#dff0d8;color:#3c763d;}
      .th-structure {background-color:#d9edf7;color:#31708f;}
      .th-html5 {background-color:#e8eaf8;color:#656789;}
      .th-contrast {background-color:#ffffff;color:#000000;}
    </style>
    <body>
      <table>
        <caption>WAVE accessibility summary report: ${moment().format('MMMM Do YYYY, h:mma')}</caption>
        <thead>
          <tr>
           <th class="th-site" scope="col" style="height:17.0pt;width:145pt">Page URL</th>
           <th class="th-errors" scope="col" style="width:79pt">Errors</th>
           <th class="th-alerts" scope="col" style="width:79pt">Alerts</th>
           <th class="th-features" scope="col" style="width:86pt">Features</th>
           <th class="th-structure" scope="col" style="width:93pt">Structure</th>
           <th class="th-html5" scope="col" style="width:123pt">HTML5 and ARIA</th>
           <th class="th-contrast" scope="col" style="width:87pt">Contrast</td>
          </tr>
        </thead>
        <tbody>`;

  map(data, (site) => {
    if (site.status.success === true) {
      htmlData += `<tr>
        <td scope="row"><a href="${site.statistics.pageurl}" target="_blank">${site.statistics.pageurl}</a></td>
        <td>${site.categories.error.count}</td>
        <td>${site.categories.alert.count}</td>
        <td>${site.categories.feature.count}</td>
        <td>${site.categories.structure.count}</td>
        <td>${site.categories.html5.count}</td>
        <td>${site.categories.contrast.count}</td>
      </tr>`;
    }
  });

  htmlData += '</tbody></table>';

  const blob = new Blob([htmlData], { type: 'text/html' });

  return blob;
}

/**
 * Converts detailed report data to HTML format
 * @param  {array} data - detailed report data
 * @return {blob} blob of converted HTML data
 */
async function toHTMLDetailed(data) {
  // TODO: refactor this...don't repeat the same snippet from up above
  let htmlData = `<!doctype html>
    <html lang="en">
    <head>
    <meta http-equiv=Content-Type content="text/html">
    <meta charset="utf-8">
    <style>
      table {margin:64px auto;width: 90%}
      table, th, td {border: 1px solid #666;border-collapse: collapse}
      tr.sum:nth-child(even) {background:#f9f9f9}
      tr.sum:nth-child(odd) {background: white}
      tbody tr.sum:hover, tbody tr:hover {background-color:#f5f5f5}
      .th-errors {background-color:#f2dede;color:#a94442;}
      .th-alerts {background-color:#fcf8e3;color:#8a6d3b;}
      .th-features {background-color:#dff0d8;color:#3c763d;}
      .th-structure {background-color:#d9edf7;color:#31708f;}
      .th-html5 {background-color:#e8eaf8;color:#656789;}
      .th-contrast {background-color:#ffffff;color:#000000;}
      .errors {background-color:#f2dede;color:#a94442;}
      .alerts {background-color:#fcf8e3;color:#8a6d3b;}
      .features {background-color:#dff0d8;color:#3c763d;}
      .structure {background-color:#d9edf7;color:#31708f;}
      .html5 {background-color:#e8eaf8;color:#656789;}
      .contrast {background-color:#ffffff;color:#000000;}
    </style>
    <body>
      <table>
        <caption>WAVE accessibility summary report: ${moment().format('MMMM Do YYYY, h:mma')}</caption>
        <thead>
          <tr>
           <th scope="col" style="height:17.0pt;width:145pt">Page URL</th>
           <th class="th-errors" scope="col" style="width:79pt">Errors</th>
           <th class="th-alerts" scope="col" style="width:79pt">Alerts</th>
           <th class="th-features" scope="col" style="width:86pt">Features</th>
           <th class="th-structure" scope="col" style="width:93pt">Structure</th>
           <th class="th-html5" scope="col" style="width:123pt">HTML5 and ARIA</th>
           <th class="th-contrast" scope="col" style="width:87pt">Contrast</td>
          </tr>
        </thead>
        <tbody>`;

  map(data, (site) => {
    if (site.status.success === true) {
      htmlData += `<tr class="sum">
        <td scope="row"><a href="${site.statistics.pageurl}" target="_blank">${site.statistics.pageurl}</a></td>
        <td>${site.categories.error.count}</td>
        <td>${site.categories.alert.count}</td>
        <td>${site.categories.feature.count}</td>
        <td>${site.categories.structure.count}</td>
        <td>${site.categories.html5.count}</td>
        <td>${site.categories.contrast.count}</td>
      </tr>`;
    }
  });

  htmlData += '</tbody></table>\n';

  map(data, (site) => {
    if (site.status.success === true) {
      htmlData += `<table>
        <caption>WAVE accessibility detailed report for <a href="${site.statistics.waveurl}" target="_blank">${site.statistics.pageurl}</a>: ${moment().format('MMMM Do YYYY, h:mma')}</caption>
        <thead>
          <tr>
           <th scope="col" style="width:79pt">Item Type</th>
           <th scope="col" style="width:79pt">Item ID</th>
           <th scope="col" style="width:30pt">Count</th>
           <th scope="col" style="width:93pt">Description</th>
           <th scope="col" style="width:93pt">Guidelines</th>
          </tr>
        </thead>
        <tbody>`;

      map(site.categories.error.items, async (item) => {
        htmlData += `<tr class="errors">
          <td>Error</td>
          <td>${item.id}</td>
          <td>${item.count}</td>
          <td>${item.description}</td><td>errors`;
        await waitforDocs(item.id);
		// const myPromise = getDocs(item.id);
		// myPromise.then(function addHTMLhere(){console.log("MADE IT BITCH"); toAddHTML = getDocs(item.id);});
		htmlData += toAddHTML;
        htmlData += `</td></tr>`;
      });
      map(site.categories.alert.items, (item) => {
        htmlData += `<tr class="alerts">
          <td>Alert</td>
          <td>${item.id}</td>
          <td>${item.count}</td>
          <td>${item.description}</td><td>`;
        var request = new XMLHttpRequest();
        request.open('GET', `http://wave.webaim.org/api/docs?id=${item.id}`, true);
		request.onload = function () {
			var data = JSON.parse(this.response);
  			if (request.status >= 200 && request.status < 400) {
  				var gs = data.guidelines;
  				for (var i = 0, len = gs.length; i < len; i++){
  					var t = gs[i];
  					htmlData += `<a href=${t.link} target="_blank">${t.name}</a>;`;
  				}
  			}
		}
		request.send();
        htmlData += `</td></tr>`;
      });
      map(site.categories.feature.items, (item) => {
        htmlData += `<tr class="features">
          <td>Feature</td>
          <td>${item.id}</td>
          <td>${item.count}</td>
          <td>${item.description}</td><td>`;
        var request = new XMLHttpRequest();
        request.open('GET', `http://wave.webaim.org/api/docs?id=${item.id}`, true);
		request.onload = function () {
			var data = JSON.parse(this.response);
  			if (request.status >= 200 && request.status < 400) {
  				var gs = data.guidelines;
  				for (var i = 0, len = gs.length; i < len; i++){
  					var t = gs[i];
  					htmlData += `<a href=${t.link} target="_blank">${t.name}</a>;`;
  				}
  			}
		}
		request.send();
        htmlData += `</td></tr>`;
      });
      map(site.categories.structure.items, (item) => {
        htmlData += `<tr class="structure">
          <td>Structure</td>
          <td>${item.id}</td>
          <td>${item.count}</td>
          <td>${item.description}</td><td>`;
        var request = new XMLHttpRequest();
        request.open('GET', `http://wave.webaim.org/api/docs?id=${item.id}`, true);
		request.onload = function () {
			var data = JSON.parse(this.response);
  			if (request.status >= 200 && request.status < 400) {
  				var gs = data.guidelines;
  				for (var i = 0, len = gs.length; i < len; i++){
  					var t = gs[i];
  					htmlData += `<a href=${t.link} target="_blank">${t.name}</a>;`;
  				}
  			}
		}
		request.send();
        htmlData += `</td></tr>`;
      });
      map(site.categories.html5.items, (item) => {
        htmlData += `<tr class="html5">
          <td>HTML5 and ARIA</td>
          <td>${item.id}</td>
          <td>${item.count}</td>
          <td>${item.description}</td><td>`;
        var request = new XMLHttpRequest();
        request.open('GET', `http://wave.webaim.org/api/docs?id=${item.id}`, true);
		request.onload = function () {
			var data = JSON.parse(this.response);
  			if (request.status >= 200 && request.status < 400) {
  				var gs = data.guidelines;
  				for (var i = 0, len = gs.length; i < len; i++){
  					var t = gs[i];
  					htmlData += `<a href=${t.link} target="_blank">${t.name}</a>;`;
  				}
  			}
		}
		request.send();
        htmlData += `</td></tr>`;
      });
      map(site.categories.contrast.items, (item) => {
        htmlData += `<tr class="contrast">
          <td>Contrast</td>
          <td>${item.id}</td>
          <td>${item.count}</td>
          <td>${item.description}</td><td>`;
        var request = new XMLHttpRequest();
        request.open('GET', `http://wave.webaim.org/api/docs?id=${item.id}`, true);
		request.onload = function () {
			var data = JSON.parse(this.response);
  			if (request.status >= 200 && request.status < 400) {
  				var gs = data.guidelines;
  				for (var i = 0, len = gs.length; i < len; i++){
  					var t = gs[i];
  					htmlData += `<a href=${t.link} target="_blank">${t.name}</a>;`;
  				}
  			}
		}
		request.send();
        htmlData += `</td></tr>`;
      });
    }
  });

  htmlData += '</tbody></table>';

  const blob = new Blob([htmlData], { type: 'text/html' });

  return blob;
}

/**
 * Converts summary or detailed report data to JSON format
 * @param  {array} data - summary or detailed report data
 * @return {blob} blob of converted JSON data
 */
export function toJSON(data) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  return blob;
}

/**
 * Converts data to CSV format
 * @param  {array} data - report data
 * @param  {number} scanType - Scan type: 1 for summary or 2 for detailed
 * @return {blob} blob of converted CSV data
 */
export function toCSV(data, scanType) {
  if (scanType === '1') {
    return toCSVSummary(data);
  } else if (scanType === '2') {
    return toCSVDetailed(data);
  }

  return false;
}

/**
 * Converts data to HTML format
 * @param  {array} data - report data
 * @param  {number} scanType - Scan type: 1 for summary or 2 for detailed
 * @return {blob} blob of converted HTML data
 */
export async function toHTML(data, scanType) {
  if (scanType === '1') {
    return toHTMLSummary(data);
  } else if (scanType === '2') {
  	await toHTMLDetailed(data);
    return toHTMLDetailed(data);
  }

  return false;
}
