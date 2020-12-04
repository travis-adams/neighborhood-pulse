# Neighorhood Pulse Application
## Release Notes
## Version 1.0 Released November 22, 2020
### Features Added Since Alpha 4.0 (Sprint 4)
* Automatic web-scraping and database management
* AWS process that scrapes new events and deletes redundant or expired events
* Added more volunteering-related locations
* User account information now includes a user’s first and last name, as well as the user group of which they are a member.
* Users can now modify their account information
* Users can now save events to their user group. These events are visible by all other members of their group.
* A tab-based navigation system has been added. The tabs allow the user to view certain subsets of events: all nearby events, only their saved events, only their group’s saved events, or only their created events.
* An “Online” filter has been added to the filter menu, allowing users to view only events that are hosted online.
* A location search bar has been implemented in the top navigation bar. Upon user input, suggested locations in the user’s proximity are displayed. Clicking a suggestion moves the map to that location and shows nearby events.
* Please Note: Sprint goals have changes since the beginning of the semester. Please reference the updated client charter: https://docs.google.com/document/d/1tpBNIKFgAYGjHi9PayDP1-Kk5dG7vl_p2LZwWCjRjyg
### Bug Fixes
* Validation alert boxes have been corrected to be a red color; they were erroneously turned all-black due to a package update.
* Sign-in validation messages are now correctly reset when the sign-in window is closed.
* Fixed an issue preventing users from creating events, introduced by the conversion of google.maps.LatLngLiteral objects to google.maps.LatLng objects.
* Fixed an issue where event comments were not immediately updating when the expanded event changed. Comments are now fetched collectively with all events, instead of individually whenever an event is expanded.
* All Material-UI packages are now frozen at known functional versions. An unexpected update to a Material-UI package previously broke the application.
### Missing Functionality
* Hovering the mouse over an event in the event list does not result in that event’s map pin changing color. This was a goal from earlier in the semester.
* The frontend scaling isn't optimized for mobile due to differences in CSS requirements.
* Most of the software packages used by the frontend are not set to a fixed version, so there is a risk that one or more package(s) may update and inadvertently break the application.
### Installation Instructions
#### Downloading the repository
The repository can be downloaded using the following git command:
git clone https://github.com/travis-adams/neighborhood-pulse.git
For other downloading options, visit https://github.com/travis-adams/neighborhood-pulse, navigate to the “Code” tab, and click the green “Code” button.
### Setting up the Backend Service
* Using the DatabaseStructure.sql file, create a MySQL Database under this schema
* Update the Connection Properties in the application.properties file
* Update with Security Constants file to include the Secret Key you will be using for encryption
* Build the Jar file of the Server directory using Maven (You will need the latest version of Maven and the JDK)
* Start this Jar running on a server (We recommend AWS Elastic Beanstalk for easy setup)
* Ensure the CORS policy of the serer is set to allow all methods neccessary (GET,POST,PUT,DELETE) as well as allow headers for the authentication
### Setting up the Web Scraper
* Create a file called api_key.txt under the WebCrawlers/Sprint3+/miners/ directory
* Paste a valid Google Maps API key into this file
* Ensure Python 3 is installed on the target environment
* Navigate to the WebCrawlers/Sprint3+/ directory
* In command prompt, run
* `pip3 install -r requirements.txt`
* Wait for installation to complete 
### Run the web scraper
* Navigate to the WebCrawlers/Sprint3+/ directory
* In command prompt, run
* `python driver.py`
* By default, the webscraper runs once every 24 hours
* To modify this, change the `time.sleep()` function within driver.py
### Bringing Up an Instance of the Frontend
* Navigate to the client folder in the repository.
* In the file `public/index.html`, replace API_KEY_HERE with a valid Google Maps API key.
* Set the baseUrl variable in `components/EventService.ts` to the URL of the backend.
* Run the command npm install to install all of the required frontend packages (NOTE: NodeJS version 10+ is required for all packages to successfully compile).
* Run the command  npm run start to start the application.
* Visit localhost:3000 in a web browser to see the application.


## Troubleshooting
* Ensure you installed Python 3, not Python 2.7
* Ensure you ran pip3 not pip  
* Ensure you paste only the API key into api_key.txt and nothing else
