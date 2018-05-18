# Changelog
Between v1.0 and v2.0

## Bugfixes
- If you changed the option from "summary" to "summary and detail" after you've run a page that was only on "summary" and click on the new "detailed" tab that has popped up, it broke and showed a white screen of death. Then, if you try to use the back button, it goes back to the previous page that you were on before the app, which means the white screen completely took over the app and the only way to fix that is to refresh.
	- Fixed: added if/else with `No data here. Only a basic report was run.` to [DetailedDisplay.js](src/components/DetailedDisplay.js)
- After you put in your API key, it still shows “0 credits remaining” until you run one report and then the number updates to your actual credits remaining, which is confusing. Can’t just add a button underneath the entry for API key that would validate it and then show your credits because getting credit amount requires an API call so it would be silly to waste a credit on getting the number of credits.
	- Patch/fix: added a brief explanation about the behavior to [Form.js](src/components/Form.js) to remove confusion.
- Teensy bug: said “Ender API Key” instead of “Enter” in [Form.js](src/components/Form.js).
	- Fix:  Edited to `placeholder="Enter API Key"`
- When you generated a report and exported it to html, the links out of it were broken. It added another `http://` in front of each url which then in the address bar turned to `http://http//example.com`, which doesn’t exist.
	- Fix: The WAVE API already added an `http://` so it was easy to remove the extra one in [convertData.js](src/util/convertData.js).
- Broke when there were different characters in a URL, like `&`. URLs weren't being encoded before being sent to the API.
	- Fix: Added `encodeURIComponent()` to [search.js](src/util/search.js) as well as some of the output files.

## Added functionality
- Updated [Readme file](README.md) to give better info.
- Added [User documentation](public/USER-README.md) and [page to display user docs](public/docs.html).
- Added new [details.html](public/details.html) file that takes in item ids from each item WAVE identifies and gives further information about them from the WAVE documentation API. This is accessed from the main Detailed Results page and from an HTML report if the user also downloads details.html.
- Added [example files](public/examples).
- Generally improved UX