import requests
from bs4 import BeautifulSoup
from geopy.geocoders import GoogleV3

#KEY IS AIzaSyBpNi3-qyG9Vhc3zMKZH1ZYnuQLT0AMDzQ4 (remove dash)

geolocator = GoogleV3(api_key="api_key_here",user_agent="cafe_analytics")
i = 0
events = []
page = requests.get("https://www.atlanta.net/events", headers={'User-Agent':"Firefox/48.0"})
main = BeautifulSoup(page.content, 'html.parser')
for el in main.find_all("a", class_ = "learnMore"):
    if el.text == 'More Details':

        event = {}
        link = "https://www.atlanta.net" + el['href']
        event['link'] = link
        #recurse into link
        page = requests.get(link, headers={'User-Agent':"Firefox/48.0"})
        soup = BeautifulSoup(page.content, 'html.parser')
        #extract attributes
        #NAME
        event['name'] = soup.find(class_="eventName").text.strip()
        #DESCRIPTION
        event['desc'] = soup.find(class_="eventDescription").text.strip().replace('"',"'")
        #ADDRESS
        address = soup.find(itemprop="address")
        event['addr'] = address.text.strip() if address != None else "NULL"
        #1st try location...
        location = soup.find(itemprop="location")
        event['loc'] = location.find(itemprop="name").text.strip() if location != None else "NULL"
        #CATEGORY / LOCATION / TIME / DATE
        event['cat']  = "NULL"
        event['time'] = "NULL"
        event['date'] = "NULL"
        for el in soup.find_all(class_="row"):
            label = el.find("strong")
            if label != None:
                label = label.text.strip()
                if label == "Type:":
                    value = el.find(class_="eight").text.strip()
                    event['cat'] = value
                if label == "Location:":
                    value = el.find(class_="eight").text.strip()
                    event['loc'] = value
                if label == "Start Time:":
                    value = el.find(class_="eight").text.strip()
                    event['time'] = value
                if label == "Date:":
                    value = el.find(class_="eight").text.strip()
                    value = value.replace("/","-")
                    event['date'] = value

        #convert addr to lat/long
        if event['addr'] != "NULL" and event['loc'] != 'Online':
            location = geolocator.geocode(event['addr'].replace('\n',' '))
            event['latitude']  = str(location.latitude)
            event['longitude'] = str(location.longitude)
        else:
            event['latitude']  = "NULL"
            event['longitude'] = "NULL"
        
        events.append(event)
        i += 1
        print(i)
        
import json
with open('events.json','w') as fp:
    json.dump(events, fp, indent=" ")

#Connection stuff-----------------------------------------------
host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
port = 3306
db_name    = 'new_schema'
table_name = 'sprint_one'
username   = 'CafeAmbassador'
password   = 'TravisHasABeardNow'

#Enter info into DB----------------------------------------------
import pymysql
conn = pymysql.connect(host,user=username, port=port, passwd=password, db=db_name) #Connect
cursor = conn.cursor() #Get a cursor to the data
for event in events:
    #get attributes
    name = event['name']
    date = event['date']
    desc = event['desc']
    loc  = event['loc']
    addr = event['addr']
    cat  = event['cat']
    time = event['time']
    link = event['link']
    lat  = event['latitude']
    lng  = event['longitude']
    #enter into table
    sql = 'INSERT INTO %s VALUES("%s","%s","%s","%s","%s","%s","%s","%s",%s,%s)' % (table_name,name,date,desc,loc,addr,cat,time,link,lat,lng)#Define insert
    cursor.execute(sql) #Execute insert
conn.commit() #Commit all inserts
conn.close()  #Close the connection