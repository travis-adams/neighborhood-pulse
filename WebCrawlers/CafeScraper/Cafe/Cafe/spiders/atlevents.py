import scrapy
import pandas as pd
import pymysql


class atleventsSpider(scrapy.Spider):
    name = "events"
    start_urls = [
        'https://www.atlanta.net/events/#event'#The site to go to
    ]

    def parse(self, response):
        names = []
        dates = []
        descs = []
        event_list = response.css('div.event-list') #Grabs the event list module
        for section in event_list.xpath('.//section'): #For every section in the Event list (Editors pick, etc.)
            for event in section.css('div.secondaryTile'):#For each event tile
                e = event.css('div.secondaryTileCopy')# The Event tile itself
                name = e.css('.floatRight').xpath('.//h2/a/text()').get().strip()
                names.append(name)
                date = e.css('.floatRight').css('p.eventDate::text').get().strip()
                dates.append(date)
                desc = e.css('.floatRight').css('p.eventDescription::text').get().strip()
                descs.append(desc)
        #Cool Connection Stuff
        host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
        port = 3306
        dbname = 'new_schema'
        username = 'CafeAmbassador'
        password = 'TravisHasABeardNow'

        conn = pymysql.connect(host,user=username, port=port, passwd=password, db=dbname) #Connect
        cursor = conn.cursor()#Get a cursor to the data
        for (name, date, desc) in zip(names,dates,descs): #Iterate through all the lists
            sql = "INSERT INTO DirtyEvents VALUES(%s, %s, %s)"#Insert
            cursor.execute(sql,(name,date,desc,))#Executre the insert
        conn.commit()#Commit all inserts
        conn.close()#Close the connection