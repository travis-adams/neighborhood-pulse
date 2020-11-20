def filter_events(events):

    output = []
    for event in events:
        
        #exclude bad formatting / bad categories
        if event["catg"] == "parties" or event["name"] == None:
            continue #skip this event

        #iterate thru restricted words
        restrict_list = ["party","rave","club","dating","happy hour","damn","shit","fuck","sex","booze","weed","cannabis","420","$","earn","drink","hot"]
        accept = True
        for word in restrict_list:
            text = event["name"] + str(event["desc"])
            #if restricted word found
            if word in text:
                accept = False
                break #break out of word checking

        #if event is good..
        if accept:
            output.append(event)
                
    return output

#TODO - not needed yet
def filter_locations(locations):
    return locations