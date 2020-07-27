import React from 'react'
import PropTypes from 'prop-types'
import { Input, Grid } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'react-i18next'
import './TInput.css'

TInput.propTypes = {
  attribute: PropTypes.shape({
    attrib_id: PropTypes.string.isRequired,
    city_name: PropTypes.string.isRequired,
    thresholds: PropTypes.arrayOf(PropTypes.array)
  }),
  name: PropTypes.string,
  value: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.string
  }),
  onChange: PropTypes.func
}

function TInput (props) {
  const { name, attribute, onChange = () => {} } = props
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
        {test.value === null ? (
          ''
        ) : (
          <>
            <label htmlFor={htmlId}>
              {t('translation:attributes.' + name)}{' '}
            </label>
            <Grid>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Input
                    label={t('thresholds.minvalue')}
                    value={thresholds[1].value}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th1')}
                    value={thresholds[2].value}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th2')}
                    value={thresholds[3].value}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label={t('thresholds.th3')}
                    value={thresholds[4].value}
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
