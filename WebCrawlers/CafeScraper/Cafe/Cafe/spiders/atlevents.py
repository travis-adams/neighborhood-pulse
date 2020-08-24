import scrapy
import pandas as pd
import pymysql


class atleventsSpider(scrapy.Spider):
    name = "events"
    start_urls = [
        'https://www.atlanta.net/events/#event'#The site to go to
    ]

    def parse(self, response):
        titles = []
        names = []
        dates = []
        locs = []
        descs = []
        types = []
        urls = []
        event_list = response.css('div.event-list') #Grabs the event list module
        for section in event_list.xpath('.//section'): #For every section in the Event list (Editors pick, etc.)
            for event in section.css('div.secondaryTile'):#For each event tile
                e = event.css('div.secondaryTileCopy')# The Event tile itself
                name = e.css('.floatRight').xpath('.//h2/a/text()').get().strip()#Name
                names.append(name)
                dateAndTime = e.css('.floatRight').css('p.eventDate::text').get().strip()#Date
                dates.append(date)
                desc = e.css('.floatRight').css('p.eventDescription::text').get().strip()#Description
                descs.append(desc)
                loc = e.css('.floatRight').css('p.noMargin::text').get().strip()#Location Name
                locs.append(loc)
                eventType =
                types.append(eventType)
                url = e.css('.floatRight').xpath('.//h2/a/@href')
                urls.append(url)

        #Cool Connection Stuff
        host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
        port = 3306
        dbname = 'new_schema'
        username = 'CafeAmbassador'
        password = 'TravisHasABeardNow'

        conn = pymysql.connect(host,user=username, port=port, passwd=password, db=dbname) #Connect
        cursor = conn.cursor()#Get a cursor to the data
        for (name, dateAndTime, desc, loc, eventType, url) in zip(names,dates,descs,locs,types,urls): #Iterate through all the lists
            sql = "INSERT INTO DirtyEvents VALUES(%s, %s, %s, %s, %s, %s)"#Insert
            cursor.execute(sql,(name,date,desc,loc,))#Executre the insert
        conn.commit()#Commit all inserts
        conn.close()#Close the connection