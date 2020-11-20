from miners import eventbrite_miner, location_miner, stubhub_miner, homeless_miner
import filter_data
import json
import upload

atl_e = eventbrite_miner.main("https://www.eventbrite.com/d/ga--atlanta/all-events/")
atl_e = filter_data.event(atl_e)
json.dump(atl_e, open("atl_events.json", "w"))
upload.events(atl_e)