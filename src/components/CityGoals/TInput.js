import React from 'react'
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
  onChange: PropTypes.func
}

function TInput (props) {
  const { attribute, onChange = () => {} } = props
  const { thresholds } = attribute
  const { t } = useTranslation(['translation', 'attributes'])
  const htmlId = uniqueId('data-input_')

  function handleInputChange (event) {
    onChange({
      value: event.target.value
    })
  }
  const test = thresholds[1]
  return (
    <Grid.Row>
      <div className="input-row">
        {typeof test === 'undefined' ? (
          ''
        ) : (
          <>
            <label htmlFor={htmlId}>{t('attributes.' + attribute.id)} </label>
            <Grid>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Input
                    label={t('thresholds.minvalue')}
                    value={thresholds[0]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th1')}
                    value={thresholds[1]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th2')}
                    value={thresholds[2]}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th3')}
                    value={thresholds[3]}
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
