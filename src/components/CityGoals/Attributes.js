import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Header,
  Dropdown,
  Button,
  Input,
  Message,
  Segment,
  Form,
  Grid
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import find from 'lodash/find'
import UnitSelection from './UnitSelection'
import {
  fetchAttributeData /*, saveAttributeData */
} from '../../utils/attributes'
import ATTRIBUTES from '../../data/attributes_numo.json'
import { useTranslation } from 'react-i18next'

function Attribute ({ values = {}, onChange = () => {} }) {
  return ATTRIBUTES.map(attribute => (
    <UnitSelection
      key={attribute.id}
      attribute={attribute}
      value={values[attribute.id]}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

Attributes.propTypes = {
  attributes: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.string
  }),
  setAttributes: PropTypes.func
}

function Attributes ({ attributes, setAttributes }) {
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [isSettingAttributes, setSettingAttributes] = useState(true)
  const [isDefault, setDefault] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    async function fetchAttributes () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchAttributeData()
        setProfiles(profiles)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoadingProfiles(false)
    }

    fetchAttributes()
  }, [])

  function handleSelection (event) {
    setDefault(true)
  }
  function handleSelection1 (event) {
    setDefault(false)
  }

  function attributesSet () {
    setSettingAttributes(false)
  }

  function handleDropdownChange (event, data) {
    const attributes = find(profiles, { id: data.value })

    setAttributes(attributes)

    // Reset error state.
    setSuccess('')
    setError('')
  }

  function handleNameChange (event, data) {
    setSettingAttributes(false)
    const newAttribute = {
      ...attributes,
      name: event.target.value
    }
    setAttributes(newAttribute)
  }

  return (
    <div className="App1">
      <Header as="h3" dividing>
        {t('attributes.part1')}
      </Header>

      <p>{t('attributes.part2')}</p>

      <div className="input-row">
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
          </Grid>
        </Form>
      </div>
      <Attribute values={attributes} />
      <Segment basic>
        <Button icon labelPosition="right" onClick={attributesSet}>
          {t('attributes.setAttributes')}
        </Button>

        {!isSettingAttributes ? (
          <Link to="/thresholds">
            <Button floated="right">{t('attributes.next')}</Button>
          </Link>
        ) : (
          ''
        )}
      </Segment>
      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}
    </div>
  )
}

export default Attributes
