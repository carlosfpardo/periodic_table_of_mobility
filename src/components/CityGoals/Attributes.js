import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Header, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import UnitSelection from './UnitSelection'
import { fetchAttributeData /*, saveAttributeData */ } from '../../utils/city'
import { useTranslation } from 'react-i18next'

function Attribute ({ attributes, values = {}, onChange = () => {} }) {
  return attributes.map(attribute => (
    <UnitSelection
      key={attribute.attrib_id + attribute.city_id}
      attrib_id={attribute.attrib_id}
      city_id={attribute.city_id}
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
  setAttributes: PropTypes.func
}

function Attributes ({ city, attributes, setAttributes }) {
  const [isLoadingProfiles, setLoadingProfiles] = useState(true)
  const [isSettingAttributes, setAttributesSet] = useState(true)
  useEffect(() => {
    async function fetchAttributes () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchAttributeData(city)
        setAttributes(profiles)
      } catch (err) {
        console.error(err)
      }

      setLoadingProfiles(false)
    }

    fetchAttributes()
  }, [city, setAttributes])
  function handleAttributeset (event) {
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
          <Link to="/thresholds">
            <Button floated="right">{t('attributes.next')}</Button>
          </Link>
        ) : (
          ''
        )}
      </Segment>
    </div>
  )
}

export default Attributes
