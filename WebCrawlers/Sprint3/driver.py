#TODO add homeless shelters
#https://www.homelessshelterdirectory.org/cgi-bin/id/city.cgi?city=Marietta&state=GA

from miners import eventbrite_miner, location_miner, stubhub_miner

#mining data
atl_e = eventbrite_miner.main("https://www.eventbrite.com/d/ga--atlanta/all-events/")
atl_s = stubhub_miner.main("https://www.stubhub.com/atlanta-tickets/geography/670/")
atl_l = location_miner.main("https://www.google.com/travel/things-to-do/see-all?dest_mid=%2Fm%2F013yq&hl=en&gl=US#ttdm=33.760042_-84.382466_13")

import filter_data

#filter events
atl_e = filter_data.event(atl_e)
#combine event sources
atl_e += atl_s

import json

json.dump(atl_e, open("atl_e.json", "w"))
json.dump(atl_l, open("atl_l.json", "w"))

import upload

#upload to sql database
upload.events(atl_e)
upload.events(atl_s)
upload.locations(atl_l)