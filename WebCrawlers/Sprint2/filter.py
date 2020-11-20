#open JSON file
#try to detect if bad event
#if not, write to new file

import json
events = []
with open('events.json','r',encoding="utf-8") as fp:
    events = json.load(fp)

output = []
for event in events:
    good = True
    restrict_list = ["party","rave","club","dating","happy hour","damn","shit","fuck","sex","booze","weed","cannabis"]
    if event["catg"] == "parties" or event["name"] == None:
        good = False
    for word in restrict_list:
        if (event['name'] != None and word in event["name"].lower()) or \
           (event['desc'] != None and word in event["desc"].lower()):
            good = False
    if good == True:
        output.append(event)
            
with open('filtered.json','w', encoding="utf-8") as fp:
    json.dump(output, fp, indent=" ", ensure_ascii=False)