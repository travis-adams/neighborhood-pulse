from miners import eventbrite_miner, location_miner, stubhub_miner

#drive mining
# atl_e = eventbrite_miner.main("https://www.eventbrite.com/d/ga--atlanta/all-events/")
atl_s = stubhub_miner.main("https://www.stubhub.com/atlanta-tickets/geography/670/")
# atl_l = location_miner.main("...")

import filter_data

#filter events
# atl_e = filter_data.event(atl_e)

import json
#save to json files
#... (TODO)

import upload

#upload to sql database
# upload.events(atl_e)
upload.events(atl_s)
# upload.locations(atl_l)