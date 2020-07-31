import React, { useState, useEffect } from 'react'
import {
  Dropdown,
  Header,
  Form,
  Input,
  TextArea,
  Label,
  Grid,
  Button,
  Icon,
  Message
} from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Slider } from 'react-semantic-ui-range'
import find from 'lodash/find'
import PropTypes from 'prop-types'
import api from '../../utils/api'

CityGoals.propTypes = {
  city: PropTypes.shape({
    name: PropTypes.string,
    editdate: PropTypes.string,
    text: PropTypes.string,
    environment: PropTypes.number,
    publicHealth: PropTypes.number,
    equity: PropTypes.number,
    joyfulness: PropTypes.number,
    personalSafety: PropTypes.number
  }),
  setCity: PropTypes.func
}

function CityGoals ({ setCity }) {
  const [goal, setGoal] = useState({})
  const [city, setCities] = useState({})
  const [profiles, setProfiles] = useState([])
  const [isSavePending, setSavePending] = useState(false)
  const [isDefault, setDefault] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { t } = useTranslation()
  const [description, setDescription] = useState([])
  const [value, setValue] = useState(0)
  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const [value3, setValue3] = useState(0)
  const [value4, setValue4] = useState(0)
  const settings = {
    start: value,
    min: 0,
    max: 10,
    step: 1,
    onChange: value => {
      setValue(value)
    }
  }
  const settings1 = {
    start: value1,
    min: 0,
    max: 10,
    step: 1,
    onChange: value1 => {
      setValue1(value1)
    }
  }
  const settings2 = {
    start: value2,
    min: 0,
    max: 10,
    step: 1,
    onChange: value2 => {
      setValue2(value2)
    }
  }
  const settings3 = {
    start: value3,
    min: 0,
    max: 10,
    step: 1,
    onChange: value3 => {
      setValue3(value3)
    }
  }
  const settings4 = {
    start: value4,
    min: 0,
    max: 10,
    step: 1,
    onChange: value4 => {
      setValue4(value4)
    }
  }
  const handleValueChange = e => {
    let value = Number.parseInt(e.target.value)
    if (!value) {
      value = 0
    }
    if (value > 10) {
      value = 10
    }
    setValue(value)
  }
  useEffect(() => {
    async function fetchGoals () {
      setLoadingProfiles(true)

      try {
        api.readAll().then(city => {
          const profiles = []
          var i = 0
          city.forEach(element => {
            profiles[i] = element.data
            i++
          })

          setCities(city)
          setProfiles(profiles)
        })
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoadingProfiles(false)
    }

    fetchGoals()
  }, [lastUpdate])
  function handleSaveProfile (event) {
    setSavePending(true)
    setLastUpdate(new Date().toISOString())
    const todoValue = goal.name
    const cityref = find(city, { data: goal })
    const id = getCityId(cityref)
    if (!todoValue) {
      alert('Please add City Name')
      return false
    }

    const todoInfo = {
      name: todoValue,
      description: description,
      environment: value,
      publicHealth: value1,
      equity: value2,
      joyfulness: value3,
      personalSafety: value4
    }
    if (typeof find(profiles, { name: todoInfo.name }) === 'undefined') {
      // Make API request to create new todo
      api
        .create(todoInfo)
        .then(response => {
          console.log(response)
        })
        .catch(e => {
          console.log('An API error occurred', e)
        })
    } else {
      api.update(id, todoInfo)
    }

    setSavePending(false)
  }

  function handleDropdownChange (event, data) {
    const goals = find(profiles, { name: data.value })
    setGoal(goals)
    setCity(goals.name)
    setDescription(goals.description)
    setValue(goals.environment)
    setValue1(goals.publicHealth)
    setValue2(goals.equity)
    setValue3(goals.joyfulness)
    setValue4(goals.personalSafety)
    // Reset error state.
    setSuccess('')
    setError('')
  }

  function handleNameChange (event, data) {
    const newVehicle = {
      ...goal,
      name: event.target.value
    }

    setGoal(newVehicle)
  }
  function handleDescriptionChange (event, data) {
    setDescription(event.target.value)
    const newVehicle = {
      ...goal,
      description: event.target.value
    }

    setGoal(newVehicle)
  }
  function handleSelection (event) {
    setDefault(true)
  }
  function handleSelection1 (event) {
    setDefault(false)
  }
  return (
    <div className="App">
      <Header textAlign="center">
        {t('city.title')}
        <Header.Subheader>{t('city.subtitle')}</Header.Subheader>
      </Header>

      <Form>
        <Grid>
          <Grid.Row>
            <Form.Field
              label={t('city.pregoals')}
              control="input"
              type="radio"
              name="htmlRadios"
              value="pre"
              onClick={handleSelection}
            />
            {isDefault ? (
              <Dropdown
                placeholder={isLoadingProfiles ? 'Select Loadout' : ''}
                fluid
                search
                selection
                options={profiles.map(item => ({
                  key: item.name,
                  text: item.name,
                  value: item.name
                }))}
                onChange={handleDropdownChange}
              />
            ) : (
              <Dropdown disabled />
            )}
          </Grid.Row>
          <Grid.Row>
            <Form.Field
              label={t('city.defgoals')}
              control="input"
              type="radio"
              name="htmlRadios"
              value="def"
              onClick={handleSelection1}
            />
            {isDefault ? (
              <Input disabled />
            ) : (
              <Input
                id="input-name"
                placeholder={t('city.placeholder1')}
                onChange={handleNameChange}
              />
            )}
          </Grid.Row>
          <Grid.Row>
            <TextArea
              id="input-name"
              value={description}
              placeholder={t('city.placeholder2')}
              onChange={handleDescriptionChange}
            />
          </Grid.Row>
          <Grid.Row>
            <Header>{t('city.part1')}</Header>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Label>{t('city.environment')}</Label>
            </Grid.Column>
            <Grid.Column width={8}>
              <Slider discrete value={value} color="red" settings={settings} />
            </Grid.Column>
            <Grid.Column width={2}>
              <Input value={value} max="10" onChange={handleValueChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Label>{t('city.publicHealth')}</Label>
            </Grid.Column>
            <Grid.Column width={8}>
              <Slider
                discrete
                value={value1}
                color="red"
                settings={settings1}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <Input value={value1} max="10" onChange={handleValueChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Label>{t('city.equity')}</Label>
            </Grid.Column>
            <Grid.Column width={8}>
              <Slider
                discrete
                value={value2}
                color="red"
                settings={settings2}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <Input value={value2} max="10" onChange={handleValueChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Label>{t('city.joyfulness')}</Label>
            </Grid.Column>
            <Grid.Column width={8}>
              <Slider
                discrete
                value={value3}
                color="red"
                settings={settings3}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <Input value={value3} max="10" onChange={handleValueChange} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Label>{t('city.personalSafety')}</Label>
            </Grid.Column>
            <Grid.Column width={8}>
              <Slider
                discrete
                value={value4}
                color="red"
                settings={settings4}
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <Input value={value4} max="10" onChange={handleValueChange} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      <Button
        fluid
        color="green"
        icon
        labelPosition="left"
        onClick={handleSaveProfile}
        disabled={isSavePending || (goal && !goal.name)}
      >
        {isSavePending ? (
          <>
            <Icon loading name="spinner" />
            {t('inputPanel.savePlaceholder')}
          </>
        ) : (
          <>
            <Icon name="save" />
            {t('inputPanel.save')}
          </>
        )}
      </Button>
      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}
    </div>
  )
}
function getCityId (todo) {
  if (!todo.ref) {
    return null
  }
  return todo.ref['@ref'].id
}
export default CityGoals
