#https://www.google.com/search?q=events&ibp=htl;events#htivrt=events&htidocid=L2F1dGhvcml0eS9ob3Jpem9uL2NsdXN0ZXJlZF9ldmVudC8yMDIwLTEwLTMwfF8xNzcxNjAxMjAwOTI3Mjc3Nzc0Nw%3D%3D&fpstate=tldetail

import pandas as pd
pd.set_option("display.max_rows", None, "display.max_columns", None)

#load in xlxs file
df = pd.read_excel("manual/events.xlsx")

#add id (unique hash)
df["id"] = "x"
for i, row in df.iterrows():
    n = abs(hash(row["name"] + row["link"] + row["date"])) % (10 ** 8)
    df.at[i,"id"] = n

print(n)
exit()

from pathlib import Path
from geopy.geocoders import GoogleV3
path = Path(__file__).resolve().parent
key = open(path / "api_key.txt").read()
geolocator = GoogleV3(api_key=key, user_agent="cafe_analytics")

#add lat/long columns
df["latitude"] = "x"
df["longitude"] = "x"

#fill in lat/long
for i, row in df.iterrows():
    location = geolocator.geocode(row["address"])
    df.at[i,"latitude"]  = location.latitude
    df.at[i,"longitude"] = location.longitude

#Connection stuff-----------------------------------------------
host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
port = 3306
db_name    = 'new_schema'
table_name = 'locations'
username   = 'CafeAmbassador'
password   = 'TravisHasABeardNow'

#Enter info into DB----------------------------------------------
import pymysql
conn = pymysql.connect(host,user=username, port=port, passwd=password, db=db_name) #Connect
cursor = conn.cursor() #Get a cursor to the data

#upload file to database
for i, row in df.iterrows():
    #get attributes
    a = event['name']
    b = event['date']
    c = event['desc']
    d = event['loc']
    e = event['addr']
    f = event['cat']
    g = event['time']
    h = event['link']
    i = event['latitude']
    j = event['longitude']
    j = event['id']
    #enter into table
    sql = 'INSERT INTO %s VALUES("%s","%s","%s","%s",%s,%s)' % (table_name, a,b,c,d,e,f)
    # print(sql)
    # input()
    cursor.execute(sql)
conn.commit()
conn.close()
