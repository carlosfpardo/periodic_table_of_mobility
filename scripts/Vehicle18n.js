const fs = require('fs')
const faunadb = require('faunadb')
const chalk = require('chalk')
const insideNetlify = insideNetlifyBuildContext()
const q = faunadb.query
// 1. Check for required enviroment variables
if (!process.env.FAUNADB_SERVER_SECRET) {
  console.log(
    chalk.yellow(
      'Required FAUNADB_SERVER_SECRET enviroment variable not found.'
    )
  )
  console.log(
    'Make sure you have created your Fauna databse with "netlify addons:create fauna"'
  )
  console.log('Then run "npm run bootstrap" to setup your database schema')
  if (insideNetlify) {
    process.exit(1)
  }
}

// Has var. Do the thing
if (process.env.FAUNADB_SERVER_SECRET) {
  writeJson(process.env.FAUNADB_SERVER_SECRET)
}
function writeJson () {
  getFaunaVehicles().then(faunavehicles => {
    const fvehicles = JSON.parse(faunavehicles.body)
    readJson('./public/locales/en/vehicles.json', (err, vehicles) => {
      if (err) {
        console.log('Error reading file:', err)
        return
      }
      // do the thing
      const vehicleArray = {}
      fvehicles.forEach(vehicle => {
        const vehicleId = vehicle.data.id
        const vehicleName = vehicle.data.name
        vehicleArray[vehicleId] = vehicleName
      })
      const newvehicles = {
        ...vehicles,
        vehicleNames: vehicleArray
      }
      fs.writeFile(
        './public/locales/en/vehicles.json',
        JSON.stringify(newvehicles, null, 2),
        err => {
          if (err) console.log('Error writing file:', err)
        }
      )
    })
  })
}
async function getFaunaVehicles () {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })
  return client
    .query(q.Paginate(q.Match('get_all_vehicle')))
    .then(response => {
      const todoRefs = response.data
      console.log('Todo refs', todoRefs)
      console.log(`${todoRefs.length} todos found`)
      // create new query out of todo refs. http://bit.ly/2LG3MLg
      const getAllTodoDataQuery = todoRefs.map(ref => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllTodoDataQuery).then(ret => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    })
    .catch(error => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
function readJson (filePath, cb) {
  fs.readFile(filePath, (err, jsonString) => {
    if (err) {
      return cb && cb(err)
    }
    try {
      const vehicle = JSON.parse(jsonString)
      return cb && cb(null, vehicle)
    } catch (err) {
      return cb && cb(err)
    }
  })
}
// Test if inside netlify build context
function insideNetlifyBuildContext () {
  if (process.env.DEPLOY_PRIME_URL) {
    return true
  }
  return false
}
