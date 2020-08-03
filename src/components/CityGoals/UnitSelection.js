import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Grid, Dropdown } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'react-i18next'
import UNITS from '../../data/units.json'
import '../InputPanel/DataInput.css'

UnitSelection.propTypes = {
  defaultUnit: PropTypes.string,
  definedUnits: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func
}

function UnitSelection (props) {
  const { defaultUnit, definedUnits, name, onChange = () => {} } = props

  const { t } = useTranslation()
  const units =
    typeof definedUnits !== 'undefined' ? UNITS[definedUnits] : defaultUnit
  const htmlId = uniqueId('data-input_')
  function handleUnitChange (event, data) {
    onChange({
      units: data.value
    })
  }
  let unitRep
  if (typeof units === 'string') {
    unitRep = <Segment content={units} />
  } else if (Array.isArray(units)) {
    unitRep = (
      <Dropdown
        value={defaultUnit}
        options={units}
        selection
        onChange={handleUnitChange}
      />
    )
  } else {
    unitRep = ''
  }
  return (
    <div className="box">
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment id={htmlId} content={t('attributes.' + name)} />
          </Grid.Column>
          <Grid.Column>{unitRep}</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default UnitSelection
