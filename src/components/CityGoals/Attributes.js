import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Header, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import UnitSelection from './UnitSelection'
import { useTranslation } from 'react-i18next'

function Attribute ({ attributes, values = {}, onChange = () => {} }) {
  return attributes.map(attribute => (
    <UnitSelection
      key={attribute.id}
      defaultUnit={attribute.defaultUnit}
      definedUnits={attribute.definedUnits}
      name={attribute.id}
      description={attribute.description}
      value={values[attribute.id]}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

Attributes.propTypes = {
  attributes: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    definedUnit: PropTypes.string,
    description: PropTypes.string,
    exampleValue: PropTypes.any,
    thresholds: PropTypes.array
  }),
  setAttributes: PropTypes.func,
  city: PropTypes.shape({
    attributes: PropTypes.shape({})
  })
}

function Attributes ({ city, attributes, setAttributes }) {
  const [isLoadingProfiles, setLoadingProfiles] = useState(true)
  const [isSettingAttributes, setAttributesSet] = useState(false)
  useEffect(() => {
    async function fetchAttributes () {
      setLoadingProfiles(true)

      if (typeof city.attributes !== 'undefined') {
        try {
          const attributesList = city.attributes
          setAttributes(attributesList)
        } catch (e) {
          console.error(e)
        }
      }

      setLoadingProfiles(false)
    }

    fetchAttributes()
  }, [city, setAttributes])
  function handleAttributeset () {
    setAttributesSet(true)
  }
  function handleAttributesChange (attributes) {
    setAttributes(attributes)
  }
  const { t } = useTranslation()

  return (
    <div className="App1">
      <Header as="h3" dividing>
        {t('attributes.part1')}
      </Header>
      <p>{t('attributes.part2')}</p>

      <div className="input-row" />
      {isLoadingProfiles ? (
        ''
      ) : (
        <Attribute
          attributes={attributes}
          values={attributes}
          onChange={handleAttributesChange}
        />
      )}

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
