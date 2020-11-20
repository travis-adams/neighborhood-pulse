def event(events):

    output = []
    for event in events:
        restrict_list = ["party","rave","club","dating","happy hour","damn","shit","fuck","sex","booze","weed","cannabis","420","$","earn","drink"]
        if event["catg"] == "parties" or event["name"] == None:
            continue
        for word in restrict_list:
            text = event["name"] + str(event["desc"])
            if word in text:
                continue
        #if event is good
        output.append(event)
                
    return output

#TODO
def location(locations):
    return locations