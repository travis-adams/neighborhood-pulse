while True:

    from miners import eventbrite_miner, location_miner, stubhub_miner, homeless_miner

    #mining data
    atl_e = eventbrite_miner.main("https://www.eventbrite.com/d/ga--atlanta/all-events/")
    atl_s = stubhub_miner.main("https://www.stubhub.com/atlanta-tickets/geography/670/")
    atl_l = location_miner.main("https://www.google.com/travel/things-to-do/see-all?dest_mid=%2Fm%2F013yq&hl=en&gl=US#ttdm=33.760042_-84.382466_13")
    atl_h = homeless_miner.main("https://www.homelessshelterdirectory.org/cgi-bin/id/city.cgi?city=Marietta&state=GA")

    import filter_data

    #filter events
    atl_e = filter_data.event(atl_e)
    atl_e += atl_s #combine eventbrite & stubhub

    import json

    json.dump(atl_e, open("atl_events.json", "w"))
    json.dump(atl_l, open("atl_locations.json", "w"))
    json.dump(atl_h, open("atl_homeless.json", "w"))

    import upload

    #upload to sql database
    upload.events(atl_e)
    upload.locations(atl_l)
    upload.locations(atl_h)

    #delete duplicates
    #TODO
    #delete old events
    #TODO

    import time
    time.sleep(1*60*60*24)