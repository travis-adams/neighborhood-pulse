import requests
from bs4 import BeautifulSoup
import re, json

#Iterate thru main page
def main(main_url):
    events = []
    i = 1
    end = -1
    url = main_url
    #iterate through each results page
    while i != end:
        body = requests.get(url, headers={'User-Agent':"Firefox/48.0"})
        body = BeautifulSoup(body.content, 'html.parser')
        seen = set()
        #if on 1st page, determine total # pages
        if i == 1:
            el = body.find("li", class_="eds-pagination__navigation-minimal eds-l-mar-hor-3")
            desc = el.text 
            end  = int(desc.split(" of ")[1])
        #iterate through each event
        for el in body.find_all("a", class_="eds-event-card-content__action-link"):
            link = el['href']
            if link not in seen:
                seen.add(link)
                events.append(page_parse(link)) #TODO add multithreading
        #output progress
        print("{} of {}".format(i,end))
        #detect if at end of pages, if so break
        if i == end: break
        #else set URL = url of next page of results
        else:
            i += 1
            url = main_url + "?page={}".format(i)

    return events

#look for values of given JSON keys
def JSONGet(key, page):

    try:
        i = page.index(key)
        j = i + len(key)
        page = page[j:j+1000].replace("\\\"","'")

        output = None
        x = 0
        y = page[x:].find('"') + x
        output = page[x:y]

        return output
    except:
        return None

def fixEncoding(string):
    if string == None:
        return None
    else:
        return string.encode('ascii','ignore').decode('unicode-escape', 'ignore').encode('ascii','ignore').decode('unicode-escape','ignore').replace('\n','').replace('\xa0','')

#Extract given page
def page_parse(url):
    body = requests.get(url, headers={'User-Agent':"Firefox/48.0"})
    soup = BeautifulSoup(body.content, "html.parser")
    body = str(body.content)
    event = {}
    event['link'] = url
    event['name'] = fixEncoding(JSONGet('","display_name":"', body))
    event['desc'] = fixEncoding(JSONGet('"plain_description":"', body))
    event['addr'] = JSONGet('"display_full_address":"', body)
    event['loca'] = fixEncoding(JSONGet('"display_venue_name":"', body))
    event['lati'] = JSONGet('"latitude":"', body)
    event['logi'] = JSONGet('"longitude":"', body)
    date_and_time = JSONGet('"start_date_with_tz":"', body)
    event['time'] = date_and_time.split(" ")[1] if date_and_time != None else None
    event['date'] = date_and_time.split(" ")[0] if date_and_time != None else None
    event['catg'] = None
    #get event format
    for el in soup.find_all("a", class_="js-d-track-link listing-tag badge badge--tag l-mar-top-2"):
        a_type = el["data-automation"]
        if a_type == "BreadcrumbFormat":
            link = el["href"]
            link = link[:-1]
            link = link[link.rfind('/')+1:]
            event['catg'] = link
            break
    print(event)
    print('-------')
    return event

if __name__ == "__main__":
    main("https://www.eventbrite.com/d/ga--atlanta/all-events/")