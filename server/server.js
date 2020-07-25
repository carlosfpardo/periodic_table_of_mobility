const express = require('express')

const app = express()

app.get('/api/test', (req, res) => {
  res.json('World')
})
app.listen(8080, () => console.log('Server listening on port 8080'))
