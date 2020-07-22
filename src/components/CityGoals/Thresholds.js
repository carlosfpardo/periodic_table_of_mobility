import React, { useState, useEffect } from 'react'
import {
  Dropdown,
  Header,
  Form,
  Input,
  Grid,
  Button,
  Icon,
  Message
} from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import ATTRIBUTES from '../../data/attributes_numo.json'
import { fetchGoalData, saveData } from '../../utils/loadThresholds'
import { getNewGoalsId } from '../../utils/uniqueid'
import find from 'lodash/find'
import TInput from './TInput'

function Attributes ({ values = {}, onChange = () => {} }) {
  return ATTRIBUTES.map(attribute => (
    <TInput
      key={attribute.id}
      attribute={attribute}
      value={values[attribute.id]}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

function Thresholds () {
  const [goal, setGoal] = useState({})
  const [profiles, setProfiles] = useState([])
  const [isSavePending, setSavePending] = useState(false)
  const [isDefault, setDefault] = useState(false)
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const { t } = useTranslation()

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
      {
        // <Input label={t('thresholds.nameLabel')} placeholder={t('thresholds.name')} />
      }
      <Header textAlign="center">
        {t('thresholds.title')} PLACEHOLDER
        <Header.Subheader>{t('thresholds.subtitle')}</Header.Subheader>
      </Header>

      <Form>
        <Grid>
          <Grid.Row>
            <Form.Field
              label={t('thresholds.preload')}
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
                  key: item.id,
                  text: item.name,
                  value: item.id
                }))}
                onChange={handleDropdownChange}
              />
            ) : (
              <Dropdown disabled />
            )}
          </Grid.Row>
          <Grid.Row>
            <Form.Field
              label={t('thresholds.defname')}
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
                placeholder={t('thresholds.placeholder1')}
                onChange={handleNameChange}
              />
            )}
          </Grid.Row>
          <Attributes />
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
export default Thresholds
