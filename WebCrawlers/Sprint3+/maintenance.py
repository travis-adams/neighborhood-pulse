def run():

    #Connection stuff-----------------------------------------------
    host = 'database-1.c8futoifja4g.us-east-2.rds.amazonaws.com'
    port = 3306
    db_name    = 'new_schema'
    username   = 'CafeAmbassador'
    password   = 'TravisHasABeardNow'

    #Run Stored Procedures------------------------------------------
    import pymysql
    conn = pymysql.connect(host,user=username, port=port, passwd=password, db=db_name) #Connect
    cursor = conn.cursor() #Get a cursor to the data

    #delete duplicates
    sql = 'CALL delete_duplicate_events();'
    cursor.execute(sql)

    #delete old events
    sql = 'CALL delete_old_events()'
    cursor.execute(sql)    

    conn.commit() #Commit all inserts
    conn.close()  #Close the connection