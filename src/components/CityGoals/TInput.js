import React from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown, Grid } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import UNITS from '../../data/units.json'
import { useTranslation } from 'react-i18next'
import './TInput.css'
import InputHelp from '../InputPanel/InputHelp'

TInput.propTypes = {
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

function TInput (props) {
  const { attribute, value, onChange = () => {} } = props
  const { name, definedUnits, defaultUnit, thresholds } = attribute
  const { t } = useTranslation(['translation', 'attributes'])
  const units =
    typeof definedUnits !== 'undefined' ? UNITS[definedUnits] : defaultUnit

  const inputValue = typeof value === 'object' ? value.value : value
  const unitsValue =
    (typeof value === 'object' && value.units) ||
    (Array.isArray(units) && units[0].value) ||
    null
  const htmlId = uniqueId('data-input_')

  function handleInputChange (event) {
    onChange({
      value: event.target.value,
      units: unitsValue
    })
  }

  function handleUnitChange (event, data) {
    onChange({
      value: inputValue,
      units: data.value
    })
  }

  const unitLabel =
    (typeof units === 'string' && { basic: true, content: units }) ||
    (Array.isArray(units) && (
      <Dropdown
        value={unitsValue}
        options={units}
        selection
        onChange={handleUnitChange}
      />
      // There is a conflicting rule below here
      // eslint-disable-next-line
    )) ||
    null

  return (
    <Grid.Row>
      <div className="input-row">
        {unitLabel === null ? (
          ''
        ) : (
          <>
            <label htmlFor={htmlId}>{t('attributes:' + name + '.name')} </label>
            <InputHelp attribute={attribute} />
            <Grid>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Input
                    label={t('thresholds.minvalue')}
                    value={thresholds[0][0]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th1')}
                    value={thresholds[1][0]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th2')}
                    value={thresholds[2][0]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th3')}
                    value={thresholds[3][0]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        )}
      </div>
    </Grid.Row>
  )
}

export default TInput
