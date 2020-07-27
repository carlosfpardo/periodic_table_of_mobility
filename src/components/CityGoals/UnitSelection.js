import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Segment, Label, Grid } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'react-i18next'
import { fetchSingleAttribute, fetchUnits } from '../../utils/city'
import '../InputPanel/DataInput.css'

UnitSelection.propTypes = {
  attribId: PropTypes.number,
  cityId: PropTypes.number,
  onChange: PropTypes.func
}

function UnitSelection (props) {
  const [isLoadingProfiles, setLoadingProfiles] = useState(true)
  const [attribute, setAttribute] = useState({})
  const [units, setUnits] = useState('')
  const { attribId, cityId, onChange = () => {} } = props
  useEffect(() => {
    async function fetchAttributes () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchSingleAttribute(attribId, cityId)
        setAttribute(profiles)
      } catch (err) {
        console.error(err)
      }

      setLoadingProfiles(false)
    }
    async function fetchUnit (attribute) {
      setLoadingProfiles(true)
      try {
        const profiles = await fetchUnits(attribute)
        setUnits(profiles)
      } catch (err) {
        console.error(err)
      }
      setLoadingProfiles(false)
    }
    fetchUnit()
    fetchAttributes()
  }, [attribId, cityId])

  function Units () {
    if (typeof units === 'string') {
      return <Label basic content={units.name} />
    } else if (Array.isArray(units)) {
      return (
        <Dropdown
          value={units.name}
          options={units}
          selection
          onChange={handleUnitChange}
        />
      )
    } else {
      return null
    }
  }

  const { t } = useTranslation(['translation', 'attributes'])

  const htmlId = uniqueId('data-input_')

  function handleUnitChange (event, data) {
    onChange({
      value: units.name,
      units: data.value
    })
  }

  return (
    <div className="box">
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment
              id={htmlId}
              content={t('attributes:' + attribute.name + '.name')}
            />
          </Grid.Column>
          <Grid.Column>{isLoadingProfiles ? '' : <Units />}</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default UnitSelection
