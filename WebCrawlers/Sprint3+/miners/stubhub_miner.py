import requests
from bs4 import BeautifulSoup
from dateutil import parser as dt_parser
from itertools import chain
import re, json
from geopy.geocoders import GoogleV3
from pathlib import Path

path = Path(__file__).resolve().parent
key = open(path / "api_key.txt").read()
geolocator = GoogleV3(api_key=key, user_agent="cafe_analytics")
locations = {}

#Iterate thru main page
def main(url):

    print("stubhub mining...")

    events = []
    body = requests.get(url, headers={'User-Agent':"Chrome/86.0.4240.111"})
    body = BeautifulSoup(body.content, 'html.parser')

    #iterate through categories
    for block in chain(body.find_all("div", class_="EntityList"), body.find_all("div", class_="VenueList")):

        title = block.find("h2")
        if title == None: continue
        title = title.text
        i = title.find("in")
        category = title[0:i].strip()
        # print(category)

        #iterate through each event
        for link in block.find_all("a", class_="entity-card__link"):

            e = {}
            e['link'] = 'https://stubhub.com' + link['href']

            el = link.find("div", class_="entity-card__contents") #get contents

            e['name'] = el.find("div", class_="entity-card__name").text.replace(" Tickets", "")

            e['desc'] = None #stubhub has no desc

            e['loca'] = el.find("div", class_="entity-card__venue").text

            temp_addr = e['loca'] + ", " + el.find("div", class_="entity-card__location").text

            if temp_addr not in locations:
                location = geolocator.geocode(temp_addr)
                locations[temp_addr] = {"addr":location.address,"lati":location.latitude,"logi":location.longitude}
            
            e['addr'] = locations[temp_addr]["addr"]         
            e['lati'] = locations[temp_addr]["lati"]  
            e['logi'] = locations[temp_addr]["logi"]         

            date_time = el.find("div", class_="entity-card__time").text
            date, time = date_time.split("•")
            try:
                e['time'] = dt_parser.parse(time).strftime("%H:%M:%S")
            except:
                e['time'] = time
            try:
                e['date'] = dt_parser.parse(date).strftime("%Y-%m-%d")
            except:
                e['date'] = date

            e['catg'] = category

            # print(e)
            events.append(e)

    return events

if __name__ == "__main__":
    main("https://www.stubhub.com/atlanta-tickets/geography/670/")