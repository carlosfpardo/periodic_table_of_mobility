import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, Header, Button, Icon } from 'semantic-ui-react'
import { calculateDriverLevelRequired } from '../../utils/driversLicense'
import { calculateOperatingLevelRequired } from '../../utils/operatingLicense'
import { calculateDataLevelRequired } from '../../utils/dataRequirement'
import { calculatePriceRequired } from '../../utils/priceToUse'
import { calculateSpaceRequired } from '../../utils/spaceAllocation'
import { calculateSubsidyRequired } from '../../utils/subsidy'
import VehicleImage from './VehicleImage'
import RadarChart from './RadarChart'
import SummaryPolicy from './SummaryPolicy'
import { useTranslation } from 'react-i18next'
ResultOptions.propTypes = {
  vehicle: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    attributes: PropTypes.objectOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        units: PropTypes.string
      })
    )
  }),
  useCase: PropTypes.objectOf(PropTypes.string),
  levels: PropTypes.objectOf(PropTypes.number)
}

function ResultOptions ({ levels, useCase, vehicle }) {
  const { t } = useTranslation()
  if (!levels) return null

  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }

  return (
    <div className="box">
      <Header>{vehicle.name}</Header>
      <Grid centered>
        <Grid.Row stretched columns={2}>
          <Grid.Column width={6}>
            <div className="box1">
              <Grid centered>
                <Grid.Row>
                  <Header>{t('resultOptions.summary')}</Header>
                </Grid.Row>
                <Grid.Row>
                  <VehicleImage vehicle={vehicle} />
                </Grid.Row>
                <Grid.Row>
                  <RadarChart levels={levels} />
                </Grid.Row>
                <Grid.Row>
                  <SummaryPolicy levels={levels} />
                </Grid.Row>
              </Grid>
            </div>
          </Grid.Column>
          <Grid.Column width={10}>
            <div className="box1">
              <Grid centered>
                <Grid.Row>
                  <Header>{t('resultOptions.detail')}</Header>
                </Grid.Row>
                {calculateDriverLevelRequired(levels, useCase)}
                {calculateOperatingLevelRequired(levels, useCase)}
                {calculateDataLevelRequired(levels)}
                {calculatePriceRequired(levels, useCase)}
                {calculateSubsidyRequired(levels, useCase)}
              </Grid>
            </div>
          </Grid.Column>
        </Grid.Row>
        <div className="box2">
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Segment basic textAlign="center">
                {t('resultOptions.streetAllocation')}
              </Segment>
            </Grid.Column>
            <Grid relaxed>{calculateSpaceRequired(levels)}</Grid>
          </Grid.Row>
        </div>
      </Grid>
      <Segment basic>
        <Button fluid color="green" icon labelPosition="left">
          <Icon name="download" />
          {t('resultOptions.save')}
        </Button>
      </Segment>
    </div>
  )
}

export default ResultOptions
