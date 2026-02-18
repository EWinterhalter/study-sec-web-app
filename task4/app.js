const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, is_admin INTEGER)");
  db.run("INSERT INTO users (username, password, is_admin) VALUES ('admin', 'secret123', 1)");
  db.run("INSERT INTO users (username, password, is_admin) VALUES ('user1', 'qwerty', 0)");
});

app.get('/search', (req, res) => {
    const username = req.query.username || '';
  
    const suspicious = /('|--|;|\/\*|\*\/|union|select|or\s+1=1)/i;
  
    if (suspicious.test(username)) {
      console.warn('[SQLi ATTEMPT]', {
        ip: req.ip,
        input: username,
        time: new Date().toISOString()
      });
    }
  
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).send('Incorrect');
    }
  
    db.all("SELECT * FROM users WHERE username = ?", [username], (err, rows) => {
      if (err) return res.status(500).send('Error DB');
      res.json(rows);
    });
  });
  
  
  
app.listen(3000, () => console.log('Server started on port 3000'));
