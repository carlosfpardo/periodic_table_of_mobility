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
import { fetchGoalData, saveData } from '../../utils/loadGoals'
import { getNewGoalsId } from '../../utils/uniqueid'
import find from 'lodash/find'

function CityGoals () {
  const [goal, setGoal] = useState({})
  const [profiles, setProfiles] = useState([])
  const [isSavePending, setSavePending] = useState(false)
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const { t } = useTranslation()
  const [value, setValue] = useState(5)
  const [value1, setValue1] = useState(3)
  const [value2, setValue2] = useState(7)
  const [value3, setValue3] = useState(2)
  const [value4, setValue4] = useState(8)
  const settings = {
    start: 2,
    min: 0,
    max: 10,
    step: 1,
    onChange: value => {
      setValue(value)
    }
  }
  const settings1 = {
    start: 2,
    min: 0,
    max: 10,
    step: 1,
    onChange: value1 => {
      setValue1(value1)
    }
  }
  const settings2 = {
    start: 2,
    min: 0,
    max: 10,
    step: 1,
    onChange: value2 => {
      setValue2(value2)
    }
  }
  const settings3 = {
    start: 2,
    min: 0,
    max: 10,
    step: 1,
    onChange: value3 => {
      setValue3(value3)
    }
  }
  const settings4 = {
    start: 2,
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
    async function fetchVehicleProfiles () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchGoalData()
        setProfiles(profiles)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoadingProfiles(false)
    }

    fetchVehicleProfiles()
  }, [lastUpdate])
  function handleSaveProfile (event) {
    const clone = {
      ...goal,
      id: getNewGoalsId(),
      name: `${goal.name}`
    }
    setGoal(clone)
    saveToApi('POST', clone)
  }

  // async function updateToApi () {
  //   saveToApi('PUT', goal)
  // }

  async function saveToApi (method, goal) {
    setSuccess('')
    setError('')
    setSavePending(true)

    try {
      const result = await saveData('POST', goal)
      if (!result) return
      setLastUpdate(new Date().toISOString())
      setSuccess(t('inputPanel.savedCorrect'))
    } catch (err) {
      console.error(err)
      setError(t('inputPanel.saveFail'))
    }

    setSavePending(false)
  }

  function handleDropdownChange (event, data) {
    const goals = find(profiles, { id: data.value })

    setGoal(goals)

    // Reset error state.
    setSuccess('')
    setError('')
  }

  function handleNameChange (event, data) {
    const newVehicle = {
      ...goal,
      name: event.target.value
    }

    // Delete the goal image on name change so that
    // edited vehicles don't end up with the wrong image
    if (Object.prototype.hasOwnProperty.call(newVehicle, 'image')) {
      delete newVehicle.image
    }

    setGoal(newVehicle)
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
            <Header>{t('city.part1')}</Header>
          </Grid.Row>
          <Grid.Row>
            <Form.Field
              label={t('city.pregoals')}
              control="input"
              type="radio"
              name="htmlRadios"
              value="pre"
            />
            <Dropdown
              placeholder={isLoadingProfiles ? 'Select Loadout' : ''}
              fluid
              search
              selection
              options={profiles.map(item => ({
                key: item.id,
                text: item.name,
                value: item.id
              }))}
              onChange={handleDropdownChange}
            />
          </Grid.Row>
          <Grid.Row>
            <Form.Field
              label={t('city.defgoals')}
              control="input"
              type="radio"
              name="htmlRadios"
              value="def"
            />
            <Input
              id="input-name"
              placeholder={t('city.placeholder1')}
              onChange={handleNameChange}
            />
          </Grid.Row>
          <Grid.Row>
            <TextArea id="input-name" placeholder={t('city.placeholder2')} />
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={2}>
              <Label>{t('city.environment')}</Label>
            </Grid.Column>
            <Grid.Column width={8}>
              <Slider discrete value={value} color="red" settings={settings} />
            </Grid.Column>
            <Grid.Column width={2}>
              <Input value={value} maxValue="10" onChange={handleValueChange} />
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
export default CityGoals
