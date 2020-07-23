import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, Header, Button, Modal } from 'semantic-ui-react'
import { calculateDriverLevelRequired } from '../../utils/driversLicense'
import { calculateOperatingLevelRequired } from '../../utils/operatingLicense'
import { calculateDataLevelRequired } from '../../utils/dataRequirement'
import { calculatePriceRequired } from '../../utils/priceToUse'
import { calculateSpaceRequired } from '../../utils/spaceAllocation'
import { calculateSubsidyRequired } from '../../utils/subsidy'
import { calculateRisk } from '../../utils/riskAssessment'
import VehicleImage from './VehicleImage'
import RadarChart from './RadarChart'
import SummaryPolicy from './SummaryPolicy'
import { useTranslation } from 'react-i18next'
import { jsPDF as JsPDF } from 'jspdf'

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
  levels: PropTypes.objectOf(PropTypes.number)
}

function ResultOptions ({ levels, vehicle }) {
  let spaceArray = {}
  let drivers = 0
  let operating = 0
  let data = 0
  let price = 0
  let subsidy = 0
  let risk = 0
  const { t } = useTranslation()
  if (!levels) return null
  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }
  function DriversLicense () {
    const counter = calculateDriverLevelRequired(levels)
    drivers = counter
    if (counter > 1) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment basic textAlign="center">
              {t('resultOptions.driverLicense')}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment color="red" inverted textAlign="center">
              {t('resultOptions.seeRequirements')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    }
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {t('resultOptions.driverLicense')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            {t('resultOptions.notNecessary')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
  function OperatingLicense () {
    const counter = calculateOperatingLevelRequired(levels)
    operating = counter
    if (counter > 0) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment textAlign="center" basic>
              {t('resultOptions.operatingLicense')}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted color="red" textAlign="center">
              {t('resultOptions.application')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    }
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {t('resultOptions.operatingLicense')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            {t('resultOptions.notNecessary')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
  function DataRequirement () {
    const counter = calculateDataLevelRequired(levels)
    data = counter
    const elev = 0
    if (counter > 1 && elev === 0) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <Segment basic>{t('resultOptions.dataRequirements')}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted color="orange" textAlign="center">
              {t('resultOptions.loose')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    } else if (counter === 2 && elev === 1) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <Segment basic>{t('resultOptions.dataRequirements')}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>{t('resultOptions.strict')}</Segment>
          </Grid.Column>
        </Grid.Row>
      )
    } else {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <Segment basic>{t('resultOptions.dataRequirements')}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center">{t('resultOptions.none')}</Segment>
          </Grid.Column>
        </Grid.Row>
      )
    }
  }

  function PriceRequired () {
    const counter = calculatePriceRequired(levels)
    price = counter
    if (counter === 2) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment basic textAlign="center">
              {t('resultOptions.price')}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted color="red" textAlign="center">
              {t('resultOptions.priceHigh')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    } else if (counter === 1) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment basic textAlign="center">
              {t('resultOptions.price')}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" inverted color="orange">
              {t('resultOptions.priceLow')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    }
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {t('resultOptions.price')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">{t('resultOptions.priceNA')}</Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
  function Subsidy () {
    const counter = calculateSubsidyRequired(levels)
    subsidy = counter
    const elevation = 0
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {t('resultOptions.subsidy')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {counter && elevation !== 1 ? (
            <Segment textAlign="center" inverted color="green">
              {t('resultOptions.formRequest')}
            </Segment>
          ) : (
            <Segment textAlign="center">{t('resultOptions.none')}</Segment>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }

  function Risk () {
    const counter = calculateRisk(levels)
    risk = counter
    if (counter === 1) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment basic textAlign="center">
              {t('resultOptions.risk')}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted color="red" textAlign="center">
              {t('resultOptions.seeRequirements')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    }
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {t('resultOptions.risk')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            {t('resultOptions.notNecessary')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }

  function SpaceAllocation () {
    spaceArray = calculateSpaceRequired(levels)
    const elevation = 0
    const counterA = spaceArray[0]
    const counterC = spaceArray[1]
    const counterD = spaceArray[2]
    return (
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          {counterA && elevation !== 1 ? (
            <Segment basic textAlign="center">
              {t('resultOptions.sidewalk')}
            </Segment>
          ) : (
            <Segment basic disabled textAlign="center">
              {t('resultOptions.sidewalk')}
            </Segment>
          )}
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Modal
            trigger={
              <Segment basic textAlign="center">
                {t('resultOptions.nextPUDO')}
              </Segment>
            }
          >
            <Modal.Header>Has caveats</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>
                  Most vehicles only have PUDO (pick-up dropoff) privilages in
                  this area
                </Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column textAlign="center">
          {counterC && elevation !== 1 ? (
            <Segment basic textAlign="center">
              {t('resultOptions.nextMove')}
            </Segment>
          ) : (
            <Segment basic disabled textAlign="center">
              {t('resultOptions.nextMove')}
            </Segment>
          )}
        </Grid.Column>
        <Grid.Column textAlign="center">
          {elevation === 1 || counterD ? (
            <Segment basic textAlign="center">
              {t('resultOptions.farMove')}
            </Segment>
          ) : (
            <Segment basic disabled textAlign="center">
              {t('resultOptions.farMove')}
            </Segment>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }
  function GeneratePDF () {
    var Doc = new JsPDF()
    Doc.text(vehicle.name, 35, 20)
    Doc.text('' + drivers)
    Doc.text('' + operating)
    Doc.text('' + data)
    Doc.text('' + price)
    Doc.text('' + subsidy)
    Doc.text('' + risk)
    Doc.save('generated.pdf')
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
                <DriversLicense />
                <OperatingLicense />
                <DataRequirement />
                <PriceRequired />
                <Subsidy />
                <Risk />
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
            <Grid relaxed>
              <SpaceAllocation />
            </Grid>
          </Grid.Row>
        </div>
      </Grid>
      <Segment basic>
        <Button onClick={GeneratePDF}>Generate PDF</Button>
      </Segment>
    </div>
  )
}

export default ResultOptions
