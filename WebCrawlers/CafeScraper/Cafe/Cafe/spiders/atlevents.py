import scrapy
import pandas as pd
import pymysql


class atleventsSpider(scrapy.Spider):
    name = "events"
    start_urls = [
        'https://www.atlanta.net/events/#event'
    ]

    def parse(self, response):
        names = []
        dates = []
        descs = []
        event_list = response.css('div.event-list')
        for section in event_list.xpath('.//section'):
            for event in section.css('div.secondaryTile'):
                e = event.css('div.secondaryTileCopy')
                name = e.css('.floatRight').xpath('.//h2/a/text()').get().strip()
                names.append(name)
                date = e.css('.floatRight').css('p.eventDate::text').get().strip()
                dates.append(date)
                desc = e.css('.floatRight').css('p.eventDescription::text').get().strip()
                descs.append(desc)

        host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
        port = 3306
        dbname = 'new_schema'
        username = 'CafeAmbassador'
        password = 'TravisHasABeardNow'

        conn = pymysql.connect(host,user=username, port=port, passwd=password, db=dbname)
        cursor = conn.cursor()
        for (name, date, desc) in zip(names,dates,descs):
            sql = "INSERT INTO new_table VALUES(%s, %s, %s)"
            cursor.execute(sql,(name,date,desc,))
        conn.commit()
        conn.close()