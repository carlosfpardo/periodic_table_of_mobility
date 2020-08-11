import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Grid } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'react-i18next'
import './TInput.css'

TInput.propTypes = {
  attribute: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    definedUnit: PropTypes.string,
    description: PropTypes.string,
    exampleValue: PropTypes.any,
    thresholds: PropTypes.array
  }),
  setThreshold: PropTypes.func
}

function TInput (props) {
  const { attribute, setThreshold } = props
  const thresholds = attribute.thresholds
  const { t } = useTranslation(['translation', 'attributes'])
  const htmlId = uniqueId('data-input_')
  const [value, setValue] = useState(thresholds[0])
  const [value1, setValue1] = useState(thresholds[1])
  const [value2, setValue2] = useState(thresholds[2])
  const [value3, setValue3] = useState(thresholds[3])

  const handleInputChange = e => {
    let value = Number.parseInt(e.target.value)
    if (!value) {
      value = 0
    }
    thresholds[0] = value
    attribute.thresholds = thresholds
    setValue(value)
    setThreshold(thresholds)
  }
  const handleInputChange1 = e => {
    let value = Number.parseInt(e.target.value)
    if (!value) {
      value = 0
    }
    thresholds[1] = value
    attribute.thresholds = thresholds
    setValue1(value)
    setThreshold(thresholds)
  }
  const handleInputChange2 = e => {
    let value = Number.parseInt(e.target.value)
    if (!value) {
      value = 0
    }
    thresholds[2] = value
    attribute.thresholds = thresholds
    setValue2(value)
    setThreshold(thresholds)
  }
  const handleInputChange3 = e => {
    let value = Number.parseInt(e.target.value)
    if (!value) {
      value = 0
    }
    thresholds[3] = value
    attribute.thresholds = thresholds
    setValue3(value)
    setThreshold(thresholds)
  }
  return (
    <Grid.Row>
      <div className="input-row">
        {typeof thresholds === 'undefined' || thresholds[0] == null ? (
          ''
        ) : (
          <>
            <label htmlFor={htmlId}>{t('attributes.' + attribute.id)} </label>
            <Grid>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Input
                    label={t('thresholds.minvalue')}
                    value={value}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th1')}
                    value={value1}
                    onChange={handleInputChange1}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th2')}
                    value={value2}
                    onChange={handleInputChange2}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th3')}
                    value={value3}
                    onChange={handleInputChange3}
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
