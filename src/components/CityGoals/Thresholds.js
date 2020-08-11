import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Header, Form, Grid, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import TInput from './TInput'
import api from '../../utils/api'

Thresholds.propTypes = {
  city: PropTypes.any,
  cityId: PropTypes.string,
  attributes: PropTypes.array,
  setAttributes: PropTypes.func
}
function Attributes ({ attributes = {}, setThreshold = {} }) {
  return attributes.map(attribute => (
    <TInput
      key={attribute.id}
      attribute={attribute}
      setThreshold={setThreshold}
    />
  ))
}

function Thresholds ({ city, cityId, attributes, setAttributes }) {
  const [threshold, setThreshold] = useState(attributes.threshold)
  const { t } = useTranslation()
  function handleSetThresholds (event) {
    if (threshold) {
    }
    city = {
      ...city,
      attributes: attributes
    }
    api.update(cityId, city)
    setAttributes(attributes)
  }
  return (
    <div className="App">
      <Header textAlign="center">
        {t('thresholds.title')}
        <Header.Subheader>{t('thresholds.subtitle')}</Header.Subheader>
      </Header>

      <Form>
        <Grid>
          <Attributes attributes={attributes} setThreshold={setThreshold} />
        </Grid>
        <Button onClick={handleSetThresholds}>{t('thresholds.button')}</Button>
      </Form>
    </div>
  )
}
export default Thresholds
