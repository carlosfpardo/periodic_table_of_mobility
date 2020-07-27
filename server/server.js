const express = require('express')
const mysql = require('mysql')
const app = express()
const cors = require('cors')

const SELECT_ALL_BOOKS_QUERY = 'SELECT * FROM citygoals'
const SELECT_ATTRIBUTES_QUERY = 'SELECT * FROM city_attributes WHERE city_id ='
const SELECT_ATTRIBUTE_QUERY = 'select * from attribs a where exists(select 1 from citygoals b inner join city_attributes ca on ca.city_id =b.name where ca.attrib_id =a.name && a.name='
const SELECT_UNITS_QUERY = 'SELECT * FROM definedunit WHERE id='

// use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'periodictable',
  password: 'carpar42'
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

connection.connect(err => {
  if (err) {
    return err
  }
})

app.get('/', (req, res) => {
  res.send('Server side for peridic table of mobility')
})

app.post('/api/citygoals/add', (req, res) => {
  const { name, text } = req.query
  const INSERT_BOOK_QUERY = `INSERT INTO citygoals (name, text) VALUES ('${name}','${text}')`
  connection.query(INSERT_BOOK_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.send('successfully added city')
    }
  })
})

app.get('/api/citygoals', (req, res) => {
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

app.get('/api/attributes/:id', (req, res) => {
  connection.query(
    SELECT_ATTRIBUTES_QUERY + "'" + req.params.id + "'",
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        return res.json({
          data: results
        })
      }
    }
  )
})
// TODO actualy check if the attribute is linked to the city
app.get('/api/attributes/:idCity/:idAttribute', (req, res) => {
  connection.query(
    SELECT_ATTRIBUTE_QUERY + "'" + req.params.idAttribute + "')",
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        return res.json({
          data: results
        })
      }
    }
  )
})
app.get('/api/units/:id', (req, res) => {
  connection.query(
    SELECT_UNITS_QUERY + "'" + req.params.id + "'",
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        return res.json({
          data: results
        })
      }
    }
  )
})

app.listen(8080, () => console.log('Server listening on port 8080'))
