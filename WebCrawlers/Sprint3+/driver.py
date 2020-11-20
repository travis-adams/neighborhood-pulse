from miners import eventbrite_miner, location_miner, stubhub_miner, homeless_miner
from filter_data import filter_events
import json, upload, maintenance, time

while True:

    print("RUNNING DRIVER")

    #mining data---------------------------------------------------
    atl_e = filter_events(eventbrite_miner.main("https://www.eventbrite.com/d/ga--atlanta/all-events/"))
    atl_s = stubhub_miner.main("https://www.stubhub.com/atlanta-tickets/geography/670/")
    atl_l = location_miner.main("https://www.google.com/travel/things-to-do/see-all?dest_mid=%2Fm%2F013yq&hl=en&gl=US#ttdm=33.760042_-84.382466_13")
    #atl_h = homeless_miner.main("https://www.homelessshelterdirectory.org/cgi-bin/id/city.cgi?city=Marietta&state=GA")

    print("dumping data...")
    #dumping data-------------------------------------------------
    json.dump(atl_e, open("atl_eventbrite.json", "w"), indent=" ")
    json.dump(atl_s, open("atl_stubhub.json", "w"), indent=" ")
    json.dump(atl_l, open("atl_locations.json", "w"), indent=" ")
    #json.dump(atl_h, open("atl_homeless.json", "w"), indent=" ")

    print("uploading data...")
    #upload to sql database----------------------------------------
    upload.events(atl_e)
    upload.locations(atl_l)
    #upload.locations(atl_h)

    print("performing database maintenance...")
    #delete duplicates / old---------------------------------------
    maintenance.run()

    print("sleeping...")
    #block until next mining period-------------------------------
    time.sleep(1*60*60*24)