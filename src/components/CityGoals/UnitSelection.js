import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Segment, Label, Grid } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import UNITS from '../../data/units.json'
import { useTranslation } from 'react-i18next'
import '../InputPanel/DataInput.css'

UnitSelection.propTypes = {
  attribute: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    definedUnits: PropTypes.string,
    defaultUnit: PropTypes.string,
    exampleValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    thresholds: PropTypes.arrayOf(PropTypes.array)
  }),
  value: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.string
  }),
  onChange: PropTypes.func
}

function UnitSelection (props) {
  function Units () {
    if (typeof units === 'string') {
      return <Label basic content={units} />
    } else if (Array.isArray(units)) {
      return (
        <Dropdown
          value={unitsValue}
          options={units}
          selection
          onChange={handleUnitChange}
        />
      )
    } else {
      return null
    }
  }
  const { attribute, value, onChange = () => {} } = props
  const { name, definedUnits, defaultUnit } = attribute
  const { t } = useTranslation(['translation', 'attributes'])
  const units =
    typeof definedUnits !== 'undefined' ? UNITS[definedUnits] : defaultUnit

  const inputValue = typeof value === 'object' ? value.value : value
  const unitsValue =
    (typeof value === 'object' && value.units) ||
    (Array.isArray(units) && units[0].value) ||
    null
  const htmlId = uniqueId('data-input_')

  function handleUnitChange (event, data) {
    onChange({
      value: inputValue,
      units: data.value
    })
  }

  return (
    <div className="box">
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment id={htmlId} content={t('attributes:' + name + '.name')} />
          </Grid.Column>
          <Grid.Column>
            <Units />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default UnitSelection
