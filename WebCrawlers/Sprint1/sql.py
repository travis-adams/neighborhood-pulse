import json
events = []
with open('events.json','r') as fp:
    events = json.load(fp)

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

def format(string):
    if string == None:
        return "NULL"
    return string

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
    # print(sql)
    # print('=======================================')
    cursor.execute(sql) #Execute insert
conn.commit() #Commit all inserts
conn.close()  #Close the connection