def event(events):

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
                
    return output

#TODO
def location(locations):
    return locations