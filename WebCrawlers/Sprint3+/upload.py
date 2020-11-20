#load in JSON file
#for each event in JSON file, write to SQL database

#MAKE SURE 2 digit months for dates

def events(events):

    def format(string):
        if string == None:
            return 'NULL'
        return '"{}"'.format(string)

    #Connection stuff-----------------------------------------------
    host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
    port = 3306
    db_name    = 'new_schema'
    table_name = 'events'
    username   = 'CafeAmbassador'
    password   = 'TravisHasABeardNow'

    #Enter info into DB----------------------------------------------
    import pymysql
    conn = pymysql.connect(host,user=username, port=port, passwd=password, db=db_name) #Connect
    cursor = conn.cursor() #Get a cursor to the data
    for event in events:
        #get attributes
        name = format(event['name'])
        date = format(event['date'])
        desc = format(event['desc'])
        loca = format(event['loca'])
        addr = format(event['addr'])
        catg = format(event['catg'])
        time = format(event['time'])
        link = format(event['link'])
        lati = format(event['lati'])
        logi = format(event['logi'])
        e_id = format(None)
        c_id = 0
        #enter into table
        sql = 'INSERT INTO %s VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)' % (table_name,name,date,desc,loca,addr,catg,time,link,lati,logi,e_id,c_id)#Define insert
        print(sql)
        print('=======================================')
        cursor.execute(sql) #Execute insert
    conn.commit() #Commit all inserts
    conn.close()  #Close the connection

    return True

#TODO
def locations(locations):

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

    for l in locations:
        a = l["name"].replace('"',"'")
        b = l["addr"].replace('"',"'")
        c = l["desc"].replace('"',"'")
        d = l["link"].replace('"',"'")
        e = l["lati"]
        f = l["logi"]

        sql = 'INSERT INTO %s VALUES("%s","%s","%s","%s",%s,%s)' % (table_name, a,b,c,d,e,f)
        cursor.execute(sql) #Execute insert

    conn.commit() #Commit all inserts
    conn.close()  #Close the connection

    return True