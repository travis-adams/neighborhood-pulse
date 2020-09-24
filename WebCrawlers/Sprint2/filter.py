#open JSON file
#try to detect if bad event
#if not, write to new file

import json
events = []
with open('events.json','r') as fp:
    events = json.load(fp)

output = []
for event in events:
    good = True
    #if event if bad, set good = False
    #at end, if good = True, add event to output