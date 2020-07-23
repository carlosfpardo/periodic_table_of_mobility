import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Header, Form, Grid, Button, Icon, Message } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import ATTRIBUTES from '../../data/attributes_numo.json'
import { saveData } from '../../utils/loadThresholds'
import { getNewGoalsId } from '../../utils/uniqueid'
import TInput from './TInput'

Thresholds.propTypes = {
  attributes: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.string
  })
}
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

function Thresholds ({ attributes }) {
  const [goal, setGoal] = useState({})
  const [isSavePending, setSavePending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { t } = useTranslation()

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
      setSuccess(t('inputPanel.savedCorrect'))
    } catch (err) {
      console.error(err)
      setError(t('inputPanel.saveFail'))
    }

    setSavePending(false)
  }

  return (
    <div className="App">
      <Header textAlign="center">
        {t('thresholds.title')} PLACEHOLDER
        <Header.Subheader>{t('thresholds.subtitle')}</Header.Subheader>
      </Header>

      <Form>
        <Grid>
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
