import fs from 'fs'
import util from 'util'
import sqlite3 from 'sqlite3'

// initialize/open database
sqlite3.verbose()  // set verbose db messages?

export default class ChatStore {
  constructor(dbFile) {
    this.db = new sqlite3.Database(dbFile)
    
    const db = this.db
    
    db.serialize(() => {
      if (!fs.existsSync(dbFile)) {
        db.run('CREATE TABLE hyperasem (username TEXT, message TEXT, datetime TEXT)')
      }
    })
    
  } // end constructor
  
  getMessages(time = 'now', callback) {
    const db = this.db
    const sql = `SELECT * from hyperasem 
                 ORDER BY datetime(datetime) DESC
                 LIMIT 100`
    
    db.all(sql, [], callback)    
  }
  
  saveMessage({username, message, datetime}) {
    const db = this.db
    const sql = `INSERT INTO hyperasem (username, message, datetime)
                 VALUES ('${username}', '${message}', '${datetime}');`
    db.run(sql)
  }  
}