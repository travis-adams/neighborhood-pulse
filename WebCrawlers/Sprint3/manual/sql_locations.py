#https://www.google.com/travel/things-to-do/see-all?dest_src=ut&dest_mid=%2Fm%2F013yq&tcfs=EhMKCC9tLzAxM3lxEgdBdGxhbnRh&hl=en&gl=US&dest_state_type=sattd#ttdm=33.763980_-84.389956_13&ttdmf=%252Fm%252F04jny9

import pandas as pd
pd.set_option("display.max_rows", None, "display.max_columns", None)

#load in xlxs file
df = pd.read_excel("manual/locations.xlsx")

from geopy.geocoders import GoogleV3
geolocator = GoogleV3(api_key="AIzaSyBpNi3qyG9Vhc3zMKZH1ZYnuQLT0AMDzQ4",user_agent="cafe_analytics")

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
    a = row["name"].replace('"',"'")
    b = row["address"].replace('"',"'")
    c = row["description"].replace('"',"'")
    d = row["link"].replace('"',"'")
    e = row["latitude"]
    f = row["longitude"]
    #enter into table
    sql = 'INSERT INTO %s VALUES("%s","%s","%s","%s",%s,%s)' % (table_name, a,b,c,d,e,f)
    # print(sql)
    # input()
    cursor.execute(sql)
conn.commit()
conn.close()
