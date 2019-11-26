import React, { useState, useEffect } from 'react'
import { Grid, Dropdown, Button, Icon, Input, Header } from 'semantic-ui-react'
import find from 'lodash/find'
import DataInput from './DataInput'
import RadarChart from './RadarChart'
import ATTRIBUTES from './data/attributes_numo.json'
import './App.css'

function Attributes ({ values, sendValues = () => {} }) {
  return ATTRIBUTES.map(attribute => (
    <DataInput
      key={attribute.id}
      attribute={attribute}
      value={values[attribute.id]}
      onChange={value => {
        sendValues({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

function getNewVehicleId () {
  return (
    'vehicle_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

function mapToVehicleProfile ({
  attributesweight,
  attributesspeed,
  attributesfootprint,
  attributesemissions,
  attributeshealth,
  metricsweight,
  metricsspeed,
  metricsfootprint,
  metricsemissions,
  metricshealth,
  ...others
}) {
  return {
    attributes: {
      weight: {
        value: attributesweight,
        units: metricsweight
      },
      speed: {
        value: attributesspeed,
        units: metricsspeed
      },
      footprint: {
        value: attributesfootprint,
        units: metricsfootprint
      },
      emissions: {
        value: attributesemissions,
        units: metricsemissions
      },
      health: {
        value: attributeshealth,
        units: metricshealth
      }
    },
    ...others
  }
}

function App () {
  const [values, setValues] = useState({})
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [pending, setPending] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState({})
  const url =
    'https://lwh6oxm5db.execute-api.us-east-1.amazonaws.com/dev/vehicles'

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(url).catch(err => {
        if (err) {
          console.error(err)
        }
        setError('Unable to fetch vehicle profiles')
      })

      if (!result) return
      const myJson = await result.json()

      const vehicles = myJson.map(mapToVehicleProfile)
      setVehicles(vehicles)
    }
    fetchData()
  }, [lastUpdate])

  async function createToApi () {
    const clone = {
      ...selectedVehicle,
      key: getNewVehicleId(),
      text: `${selectedVehicle.text}`,
      value: `${selectedVehicle.text}`
    }
    setSelectedVehicle(clone)
    saveToApi('POST', clone)
  }

  // async function updateToApi () {
  //   saveToApi('PUT', selectedVehicle)
  // }

  async function saveToApi (method, selected) {
    setPending(true)
    console.log('saving', { values, vehicles })

    if (!selected) {
      console.log('no vehicle selected?')
      return
    }
    const finalVehicle = {
      key: selected.key,
      text: selected.text,
      value: selected.value
    }
    const meta = ['id', 'app:edited', 'save', 'del', '_xml']
    Object.keys(values).forEach(vehicleAttribute => {
      if (meta.includes(vehicleAttribute)) return
      finalVehicle[`attributes${vehicleAttribute}`] =
        values[vehicleAttribute].value
      finalVehicle[`metrics${vehicleAttribute}`] =
        values[vehicleAttribute].units
    })

    const result = await fetch(url, {
      method,
      body: JSON.stringify({ vehicle: finalVehicle })
    }).catch(err => {
      if (err) {
        console.error(err)
      }
      setError('Unable to save vehicle profile')
      setPending(false)
    })

    if (!result) return

    setLastUpdate(new Date().toISOString())
    setSuccess('Saved vehicle to google sheets.')
    setPending(false)
  }

  function sendValues (values) {
    setValues(values)
  }

  function handleDropdownChange (event, data) {
    const vehicle = find(vehicles, { key: data.value })

    setValues(vehicle.attributes)
    setSelectedVehicle(vehicle)
  }

  function handleNameChange (event, data) {
    const newVehicle = {
      ...selectedVehicle,
      text: event.target.value,
      value: event.target.value
    }

    setSelectedVehicle(newVehicle)
  }

  return (
    <div className="App">
      <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
            <h1>Vehicle profile editor</h1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <div className="box">
              <Header as="h3" dividing style={{ marginBottom: '1.5em' }}>
                Vehicle attributes
              </Header>
              <div className="input-row">
                <label htmlFor="input-name">Vehicle name (optional)</label>
                <Input
                  id="input-name"
                  value={selectedVehicle && selectedVehicle.text}
                  placeholder="My vehicle"
                  onChange={handleNameChange}
                />
              </div>
              <Attributes values={values} sendValues={sendValues} />
              <Grid style={{ marginTop: '1em' }}>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Dropdown
                      className="icon"
                      id="presets"
                      placeholder="Load profile"
                      fluid
                      search
                      selection
                      value=""
                      options={vehicles.map(item => ({
                        text: item.text,
                        value: item.key
                      }))}
                      onChange={handleDropdownChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Button
                      fluid
                      color="teal"
                      icon
                      labelPosition="left"
                      onClick={createToApi}
                      disabled={
                        pending || (selectedVehicle && !selectedVehicle.text)
                      }
                    >
                      <Icon name="save" />
                      {pending ? 'Saving ...' : 'Save profile'}
                    </Button>
                    {/*
                      <Button
                        primary
                        basic
                        icon
                        labelPosition="left"
                        onClick={updateToApi}
                      >
                        <Icon name="download" />
                        Save as new vehicle
                      </Button>
                    */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Grid.Column>
          <Grid.Column width={7}>
            <div className="box">
              <RadarChart values={values} />
            </div>
          </Grid.Column>
        </Grid.Row>
        {error && (
          <Grid.Row columns={1}>
            <Grid.Column>
              <h2 className="error">{error}</h2>
            </Grid.Column>
          </Grid.Row>
        )}
        {success && (
          <Grid.Row columns={1}>
            <Grid.Column>
              <h2 className="success">{success}</h2>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </div>
  )
}

export default App
