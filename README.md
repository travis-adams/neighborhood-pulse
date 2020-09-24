# neighborhood-pulse
Junior Design - Capital One Neighborhood Pulse Application


## REST urls

/events?limit= Returns a number of records from the database, defaults to 10 if not specified

/events/filter?date=**date** defaults to current date, yyyy-mm-dd format  
               &category=**cat1**,**cat2**,...**catN** will match at least one category  
               &lat=**latitude** decimal value  
               &lng=**longitude** decimal value  
               &radius=**radius** defaults to 1, in units of...itude?
               &limit=**limit** defaults to 10  
/events/online?limit="" Returns online events  
/events/categories Returns all distinct categories  

## Front-end

To run the front-end locally:
* Navigate to the `client` folder
* In `components/MapComponent.tsx`, replace "API_KEY_HERE" with a valid Google Maps JavaScript API key
* Run `npm install` to install all necessary dependencies
* Run `npm run start` to build the code and start the dev server
* Lastly, go to `localhost:3000` in your browser to see the app
