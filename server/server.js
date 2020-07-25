const express = require('express')
const mysql = require('mysql')
const app = express()

const SELECT_ALL_BOOKS_QUERY = 'SELECT * FROM citygoals'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'periodictable',
  password: 'carpar42'
})

connection.connect(err => {
  if (err) {
    return err
  }
})

app.get('/', (req, res) => {
  res.send('Server side for peridic table of mobility')
})

app.post('/citygoals/add', (req, res) => {
  const { title } = req.query
  const INSERT_BOOK_QUERY = `INSERT INTO books (Title) VALUES ('${title}')`
  connection.query(INSERT_BOOK_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.send('successfully added product')
    }
  })
})

app.get('/citygoals', (req, res) => {
  connection.query(SELECT_ALL_BOOKS_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results
      })
    }
  })
})

app.listen(8080, () => console.log('Server listening on port 8080'))
