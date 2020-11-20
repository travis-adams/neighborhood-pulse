import requests
from bs4 import BeautifulSoup
from geopy.geocoders import GoogleV3
from pathlib import Path

path = Path(__file__).resolve().parent
key = open(path / "api_key.txt").read()
geolocator = GoogleV3(api_key=key, user_agent="cafe_analytics")

def main(url):
    
    locas = []
    body = requests.get(url, headers={'User-Agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"})
    body = BeautifulSoup(body.content, 'html.parser')

    location_name = body.find(class_="II2One")["value"]

    #navigate to list
    loc_list = body.find(class_="kQb6Eb")
    for loc in loc_list.find_all(class_="Ld2paf"):

        name = loc['data-title']
        link = "https://google.com" + loc['data-href']
        desc = loc.find(class_="nFoFM").text.strip()

        temp_addr = location_name + ", " + name
        location = geolocator.geocode(temp_addr)

        l = {}
        l["name"] = name
        l["addr"] = location.address
        l["desc"] = desc
        l["link"] = link
        l["lati"] = location.latitude
        l["logi"] = location.longitude
        
        locas.append(l)

    return locas

if __name__ == "__main__":
    main("https://www.google.com/travel/things-to-do/see-all?dest_mid=%2Fm%2F013yq&hl=en&gl=US#ttdm=33.760042_-84.382466_13")