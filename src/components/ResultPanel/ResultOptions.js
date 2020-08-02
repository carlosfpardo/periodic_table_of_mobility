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
import * as JsPDF from 'jspdf'

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
  levels: PropTypes.objectOf(PropTypes.number),
  vehicleset: PropTypes.bool,
  useCase: PropTypes.shape({
    name: PropTypes.string,
    automation: PropTypes.number,
    fleetSize: PropTypes.number,
    rideshare: PropTypes.bool,
    charge: PropTypes.bool,
    app: PropTypes.bool,
    local: PropTypes.bool,
    pudoPassager: PropTypes.bool,
    elevationF: PropTypes.bool,
    elevationL: PropTypes.bool,
    elevationU: PropTypes.bool
  }),
  city: PropTypes.string
}

function ResultOptions ({ levels, vehicle, vehicleset, useCase, city }) {
  let spaceArray = {}
  let drivers = 0
  let operating = 0
  let data = 0
  let price = 0
  let subsidy = 0
  let risk = 0
  const {
    name,
    automation,
    charge,
    local,
    elevationF,
    elevationL,
    elevationU
  } = useCase
  let elevation
  if (elevationF) {
    elevation = 1
  } else if (elevationU) {
    elevation = -1
  } else if (elevationL) {
    elevation = 0
  } else {
    elevation = 2
  }
  const { t } = useTranslation()

  if (!levels || !vehicleset) return null
  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }
  function DriversLicense () {
    const counter = calculateDriverLevelRequired(
      levels,
      charge,
      automation,
      elevation
    )
    drivers = counter
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="right">
            {t('resultOptions.driverLicense')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {counter ? (
            <Segment color="red" inverted textAlign="center">
              {t('resultOptions.seeRequirements')}
            </Segment>
          ) : (
            <Segment textAlign="center">
              {t('resultOptions.notNecessary')}
            </Segment>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }
  function OperatingLicense () {
    const counter = calculateOperatingLevelRequired(charge)
    operating = counter
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment textAlign="right" basic>
            {t('resultOptions.operatingLicense')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {operating ? (
            <Segment inverted color="red" textAlign="center">
              {t('resultOptions.seeRequirements')}
            </Segment>
          ) : (
            <Segment textAlign="center">
              {t('resultOptions.notNecessary')}
            </Segment>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }
  function DataRequirement () {
    const counter = calculateDataLevelRequired(levels, charge, elevation)
    data = counter
    if (data === 1) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Segment basic>{t('resultOptions.dataRequirements')}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted color="orange" textAlign="center">
              {t('resultOptions.loose')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    } else if (data === 2) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Segment basic>{t('resultOptions.dataRequirements')}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment inverted color="red" textAlign="center">
              {t('resultOptions.strict')}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
    } else {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
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
            <Segment basic textAlign="right">
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
            <Segment basic textAlign="right">
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
          <Segment basic textAlign="right">
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
    const counter = calculateSubsidyRequired(levels, elevation, local)
    subsidy = counter
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="right">
            {t('resultOptions.subsidy')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {subsidy ? (
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
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="right">
            {t('resultOptions.risk')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          {risk ? (
            <Segment inverted color="red" textAlign="center">
              {t('resultOptions.seeRequirements')}
            </Segment>
          ) : (
            <Segment textAlign="center">
              {t('resultOptions.notNecessary')}
            </Segment>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }

  function SpaceAllocation () {
    spaceArray = calculateSpaceRequired(levels, elevation)
    const counterA = spaceArray[0]
    const counterC = spaceArray[1]
    const counterD = spaceArray[2]
    return (
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          {counterA ? (
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
              <Button textAlign="center">{t('resultOptions.nextPUDO')}</Button>
            }
          >
            <Modal.Header>{t('resultOptions.flexTitle')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>{t('resultOptions.flextext')}</Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column textAlign="center">
          {counterC ? (
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
          {counterD ? (
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
    var doc = new JsPDF()
    doc.setFontSize(10)
    doc.text(vehicle.name, 35, 20)
    if (drivers) {
      doc.text(t('document.driversReq'), 35, 30)
    } else {
      doc.text(t('document.driversNotReq'), 35, 30)
    }
    if (operating > 0) {
      doc.text(t('document.operatingReq'), 35, 40)
    } else {
      doc.text(t('document.operatingNotReq'), 35, 40)
    }
    if (data === 2) {
      doc.text(t('document.dataStrict'), 35, 50)
    } else if (data === 1) {
      doc.text(t('document.dataLoose'), 35, 50)
    } else {
      doc.text(t('document.dataNone'), 35, 50)
    }
    if (price === 2) {
      doc.text(t('document.pricesHigh'), 35, 60)
    } else if (price === 1) {
      doc.text(t('document.pricesLow'), 35, 60)
    } else {
      doc.text(t('document.pricesNA'), 35, 60)
    }
    if (subsidy) {
      doc.text(t('document.subsidyGiven'), 35, 70)
    } else {
      doc.text(t('document.subsidyNone'), 35, 70)
    }
    if (risk > 0) {
      doc.text(t('document.riskReq'), 35, 80)
    } else {
      doc.text(t('document.riskNotReq'), 35, 80)
    }
    doc.save('generated.pdf')
  }

  return (
    <div className="box">
      <Header>
        These are the recomendations for a {vehicle.name} in {city.name} for{' '}
        {name}{' '}
      </Header>
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
