import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Header, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import UnitSelection from './UnitSelection'
import api from '../../utils/api'
import { useTranslation } from 'react-i18next'

function Attribute ({ attributes, values = {}, onChange = () => {} }) {
  return attributes.map(attribute => (
    <UnitSelection
      key={attribute.attrib_id + attribute.city_id}
      attribId={attribute.attrib_id}
      cityId={attribute.city_id}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

Attributes.propTypes = {
  city: PropTypes.string,
  attributes: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.string
  }),
  setAttributes: PropTypes.func,
  cityId: PropTypes.any
}

function Attributes ({ city, attributes, setAttributes, cityId }) {
  const [isLoadingProfiles, setLoadingProfiles] = useState(true)
  const [isSettingAttributes, setAttributesSet] = useState(false)
  useEffect(() => {
    async function fetchAttributes () {
      setLoadingProfiles(true)

      try {
        api.readAll().then(city => {
          const profiles = []
          var i = 0
          city.forEach(element => {
            profiles[i] = element.data
            i++
          })
          setAttributes(profiles)
        })
      } catch (err) {
        console.error(err)
      }

      setLoadingProfiles(false)
    }

    fetchAttributes()
  }, [cityId, setAttributes])
  function handleAttributeset () {
    setAttributesSet(true)
  }
  const { t } = useTranslation()

  return (
    <div className="App1">
      <Header as="h3" dividing>
        {t('attributes.part1')}
      </Header>
      {city}
      <p>{t('attributes.part2')}</p>

      <div className="input-row" />
      {isLoadingProfiles ? '' : <Attribute attributes={attributes} />}

      <Segment basic>
        <Button icon labelPosition="right" onClick={handleAttributeset}>
          {t('attributes.setAttributes')}
        </Button>

        {!isSettingAttributes ? (
          ''
        ) : (
          <Link to="/thresholds">
            <Button floated="right">{t('attributes.next')}</Button>
          </Link>
        )}
      </Segment>
    </div>
  )
}

export default Attributes
