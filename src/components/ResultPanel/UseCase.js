import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import api from '../../utils/api'
import {
  Form,
  Grid,
  Header,
  Dropdown,
  Input,
  Segment,
  Checkbox,
  Button
} from 'semantic-ui-react'
import find from 'lodash/find'

UseCase.propTypes = {
  useCase: PropTypes.shape({
    name: PropTypes.string,
    automation: PropTypes.number,
    fleetSize: PropTypes.number,
    rideshare: PropTypes.bool,
    charge: PropTypes.bool,
    app: PropTypes.bool,
    local: PropTypes.bool,
    pudoPassager: PropTypes.bool,
    elevationF: PropTypes.bool,
    elevationL: PropTypes.bool,
    elevationU: PropTypes.bool
  }),
  setUseCase: PropTypes.func,
  setCity: PropTypes.func,
  levels: PropTypes.objectOf(PropTypes.number),
  vehicleset: PropTypes.bool,
  setSetvehcile: PropTypes.func,
  city: PropTypes.any
}

function UseCase ({
  useCase,
  setUseCase,
  city,
  setCity,
  levels,
  vehicleset,
  setSetvehcile
}) {
  const [caseA, setCase] = useState([])
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [profiles, setProfiles] = useState([])
  const [isDefault, setDefault] = useState(false)
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    async function fetchUseCases () {
      setLoadingProfiles(true)

      try {
        api.readAll().then(city => {
          const profiles = []
          var i = 0
          city.forEach(element => {
            profiles[i] = element.data
            i++
          })
          setProfiles(profiles)
        })
        api.readAllCases().then(caseA => {
          const cases = []
          var i = 0
          caseA.forEach(element => {
            cases[i] = element.data
            i++
          })
          setCase(cases)
        })
      } catch (err) {
        console.error(err)
      }

      setLoadingProfiles(false)
    }

    fetchUseCases()
  }, [lastUpdate])
  if (!levels) return null
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }
  if ((city == null || city === '') && profiles.length > 0) {
    if (city.name == null) {
      const test = find(profiles, { name: 'NUMO' })
      setCity(test)
    }
  }
  function handleCaseDropdownChange (event, data) {
    const goals = find(caseA, { name: data.value })
    setUseCase(goals)
    setSetvehcile(true)
  }
  function handleNameChange (event, data) {
    const newVehicle = {
      ...useCase,
      name: event.target.value
    }
    setSetvehcile(false)
    setUseCase(newVehicle)
  }
  function handleRide (event, data) {
    const rideShare = !useCase.rideshare
    const newVehicle = {
      ...useCase,
      rideshare: rideShare
    }
    setUseCase(newVehicle)
  }
  function handleCharge (event, data) {
    const charge = !useCase.charge
    const newVehicle = {
      ...useCase,
      charge: charge
    }
    setUseCase(newVehicle)
  }
  function handleApp (event, data) {
    const app = !useCase.app
    const newVehicle = {
      ...useCase,
      app: app
    }
    setUseCase(newVehicle)
  }
  function handleLocal (event, data) {
    const local = !useCase.local
    const newVehicle = {
      ...useCase,
      local: local
    }
    setUseCase(newVehicle)
  }
  function handlePUDO (event, data) {
    const pudo = !useCase.pudoPassager
    const newVehicle = {
      ...useCase,
      pudoPassager: pudo
    }
    setUseCase(newVehicle)
  }
  function handleElef (event, data) {
    const pudo = !useCase.elevationF
    const newVehicle = {
      ...useCase,
      elevationF: pudo
    }
    setUseCase(newVehicle)
  }
  function handleElel (event, data) {
    const pudo = !useCase.elevationL
    const newVehicle = {
      ...useCase,
      elevationL: pudo
    }
    setUseCase(newVehicle)
  }
  function handleEleu (event, data) {
    const pudo = !useCase.elevationU
    const newVehicle = {
      ...useCase,
      elevationu: pudo
    }
    setUseCase(newVehicle)
  }
  function handleAutomationChange (event, data) {
    let value = Number.parseInt(event.target.value)
    if (!value) {
      value = 0
    }
    if (value > 5) {
      value = 5
    }
    const newVehicle = {
      ...useCase,
      automation: value
    }
    setUseCase(newVehicle)
  }
  function handleFleetChange (event, data) {
    let value = Number.parseInt(event.target.value)
    if (!value) {
      value = 1
    }
    const newVehicle = {
      ...useCase,
      fleetSize: value
    }
    setUseCase(newVehicle)
  }
  function handleSelection (event) {
    setDefault(true)
    const newUseCase = {
      ...useCase,
      name: '',
      automation: 0,
      fleetSize: 1,
      rideshare: false,
      charge: false,
      app: false,
      local: false,
      pudoPassager: false,
      elevationF: false,
      elevationL: false,
      elevationU: false
    }
    setUseCase(newUseCase)
  }
  function handleSelection1 (event) {
    setDefault(false)
  }
  function handleSetUse (event) {
    setLastUpdate(new Date().toISOString())
    const todoValue = useCase.name

    if (!todoValue) {
      alert('Please add City Name')
      return false
    }
    if (!(useCase.elevationF || useCase.elevationL || useCase.elevationU)) {
      alert('Set an elevation for the vehicle')
      return false
    }
    if (typeof find(profiles, { name: useCase.name }) === 'undefined') {
      setLastUpdate(new Date().toISOString())
      // Make API request to create new usecase
      api
        .createUseCase(useCase)
        .then(response => {
          console.log(response)
        })
        .catch(e => {
          console.log('An API error occurred', e)
        })
    } else {
      const cityref = find(caseA, { data: useCase })
      const id = getCaseId(cityref)
      api.updateUseCase(id, useCase)
    }

    setUseCase(useCase)
    setDefault(false)
    setSetvehcile(true)
  }
  return (
    <div className="App">
      {vehicleset ? (
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <p>{t('useCase.useCase')} </p>
              <Dropdown
                search
                selection
                text={useCase.name}
                options={caseA.map(item => ({
                  key: item.name,
                  text: item.name,
                  value: item.name
                }))}
                onChange={handleCaseDropdownChange}
              />
            </Grid.Column>
            <Grid.Column>
              <p>{t('useCase.framework')}</p>
              <Segment basic content={city.name} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <>
          <Header textAlign="center">{t('useCase.title')}</Header>
          <Form>
            <Grid>
              <Grid.Row>
                <Form.Field
                  label={t('useCase.pregoals')}
                  control="input"
                  type="radio"
                  name="htmlRadios"
                  value="pre"
                  onClick={handleSelection1}
                />
                {isDefault ? (
                  <Dropdown disabled />
                ) : (
                  <Dropdown
                    placeholder={!isLoadingProfiles ? 'Select Loadout' : ''}
                    fluid
                    search
                    selection
                    options={caseA.map(item => ({
                      key: item.name,
                      text: item.name,
                      value: item.name
                    }))}
                    onChange={handleCaseDropdownChange}
                  />
                )}
              </Grid.Row>
              <Grid.Row>
                <Form.Field
                  label={t('useCase.defgoals')}
                  control="input"
                  type="radio"
                  name="htmlRadios"
                  value="def"
                  onClick={handleSelection}
                />
                {isDefault ? (
                  <Input
                    id="input-name"
                    placeholder={t('useCase.placeholder1')}
                    onChange={handleNameChange}
                  />
                ) : (
                  <Input disabled />
                )}
              </Grid.Row>
              {isDefault ? (
                <>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Input
                        style={{ width: '45px' }}
                        label={t('useCase.automation')}
                        id="automation-value"
                        value={useCase.automation}
                        onChange={handleAutomationChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        style={{ width: '75px' }}
                        label={t('useCase.fleet')}
                        id="fleet-value"
                        value={useCase.fleetSize}
                        onChange={handleFleetChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Grid>
                        <Grid.Row>
                          <Checkbox
                            id="ride"
                            label={t('useCase.ride')}
                            checked={useCase.rideshare}
                            onChange={handleRide}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="charge"
                            label={t('useCase.charge')}
                            checked={useCase.charge}
                            onChange={handleCharge}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="app"
                            label={t('useCase.app')}
                            checked={useCase.app}
                            onChange={handleApp}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="local"
                            label={t('useCase.local')}
                            checked={useCase.local}
                            onChange={handleLocal}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="pudo"
                            label={t('useCase.pudo')}
                            checked={useCase.pudoPassager}
                            onChange={handlePUDO}
                          />
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                    <Grid.Column>
                      <Grid>
                        <Grid.Row>
                          <Segment basic>{t('useCase.enabled')}</Segment>
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="elef"
                            label={t('useCase.elef')}
                            checked={useCase.elevationF}
                            onChange={handleElef}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="elev"
                            label={t('useCase.elev')}
                            checked={useCase.elevationL}
                            onChange={handleElel}
                          />
                        </Grid.Row>
                        <Grid.Row>
                          <Checkbox
                            id="eleu"
                            label={t('useCase.eleu')}
                            checked={useCase.elevationU}
                            onChange={handleEleu}
                          />
                        </Grid.Row>
                        <Button onClick={handleSetUse}>Set Use</Button>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </>
              ) : (
                ''
              )}
            </Grid>
          </Form>
        </>
      )}
    </div>
  )
}
function getCaseId (todo) {
  if (!todo.ref) {
    return null
  }
  return todo.ref['@ref'].id
}
export default UseCase
