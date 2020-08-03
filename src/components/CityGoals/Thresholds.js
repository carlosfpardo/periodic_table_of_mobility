import React from 'react'
import PropTypes from 'prop-types'
import { Header, Form, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import TInput from './TInput'

Thresholds.propTypes = {
  attributes: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    definedUnit: PropTypes.string,
    description: PropTypes.string,
    exampleValue: PropTypes.any,
    thresholds: PropTypes.array
  })
}
function Attributes ({ attributes, values = {}, onChange = () => {} }) {
  return attributes.map(attribute => (
    <TInput
      key={attribute.id}
      attribute={attribute}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

function Thresholds ({ attributes }) {
  const { t } = useTranslation()
  return (
    <div className="App">
      <Header textAlign="center">
        {t('thresholds.title')}
        <Header.Subheader>{t('thresholds.subtitle')}</Header.Subheader>
      </Header>

      <Form>
        <Grid>
          <Attributes attributes={attributes} />
        </Grid>
      </Form>
    </div>
  )
}
export default Thresholds
