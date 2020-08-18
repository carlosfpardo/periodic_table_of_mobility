import React from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Segment,
  Header,
  Button,
  Modal,
  Image,
  Icon
} from 'semantic-ui-react'
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
import { useTranslation, Trans } from 'react-i18next'
import * as JsPDF from 'jspdf'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import find from 'lodash/find'

ResultOptions.propTypes = {
  vehicle: PropTypes.shape({
    id: PropTypes.string,
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
  city: PropTypes.oneOfType([
    PropTypes.shape({
      attributes: PropTypes.array,
      description: PropTypes.string,
      name: PropTypes.string
    }),
    PropTypes.string
  ])
}

function ResultOptions ({ levels, vehicle, vehicleset, useCase, city }) {
  const { t } = useTranslation()
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
  if (city == null) return null
  const { attributes } = city
  let { weight, speed, footprint, emissions, health } = {}
  if (typeof attributes === 'undefined') {
  } else {
    weight = find(attributes, { id: 'weight' })
    speed = find(attributes, { id: 'speed' })
    footprint = find(attributes, { id: 'footprint' })
    emissions = find(attributes, { id: 'emissions' })
    health = find(attributes, { id: 'health' })
  }
  let elevation = 0
  if (elevationF) {
    elevation = 1
  } else if (elevationU) {
    elevation = -1
  } else if (elevationL) {
    elevation = 0
  } else {
    elevation = 2
  }

  if (!levels || !vehicleset) return null
  // Require ALL dependent variables to be set
  const allValues = Object.values(levels)
  if (allValues.includes(0)) {
    return null
  }
  const weights = weight.thresholds[1] + ''
  const wunits = weight.defaultUnit
  const speeds = speed.thresholds[1] + ''
  const sunits = speed.defaultUnit
  const footprints = footprint.thresholds[1] + ''
  const footprint2 = footprint.thresholds[2] + ''
  const funits = footprint.defaultUnit
  const emission = emissions.thresholds[1] + ''
  const emission2 = emissions.thresholds[2] + ''
  const eunits = emissions.defaultUnit
  const weight2 = weight.thresholds[2] + ''
  const speed2 = speed.thresholds[2] + ''
  const healths = health.thresholds[0] + ''
  const hunits = health.defaultUnit
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
          <Modal
            trigger={
              <Segment basic textAlign="right">
                {t('resultOptions.driverLicense')}
                <Icon circular color="teal" name="help" />
              </Segment>
            }
          >
            <Modal.Header>{t('resultOptions.driverLicense')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>
                  <Trans i18nKey="resultOptions.driversExp">
                    If the intended use of the vehicle is commercial, OR if its
                    level of automation is above 2, OR if it is elevated above
                    ground (flying), OR if its weight is more than {{ weights }}
                    {{ wunits }} AND if its top factory speed is higher than
                    {{ speed2 }} {{ sunits }}, then it requires a driver
                    license.
                  </Trans>
                </Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column>
          {counter ? (
            <Modal
              trigger={
                <Segment color="red" inverted textAlign="center">
                  {t('resultOptions.seeRequirements')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.driverLicense')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.driversReq">
                      A driver license is required for this vehicle, more
                      information to request a license can be found
                      <Link to="/driversURL">HERE</Link>
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : (
            <Modal
              trigger={
                <Segment textAlign="center">
                  {t('resultOptions.notNecessary')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.driverLicense')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.driversNotReq">
                      A driver license is not required to operate this vehicle.
                      Regardless, please be careful when moving around our city
                      and follow all traffic rules. See
                      <Link to="/driversNotURL">HERE</Link> the general traffic
                      rules for your beautiful island.
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
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
          <Modal
            trigger={
              <Segment basic textAlign="right">
                {t('resultOptions.operatingLicense')}
                <Icon circular color="teal" name="help" />
              </Segment>
            }
          >
            <Modal.Header>{t('resultOptions.operatingLicense')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>{t('resultOptions.operatingExp')}</Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column>
          {operating ? (
            <Modal
              trigger={
                <Segment inverted color="red" textAlign="center">
                  {t('resultOptions.seeRequirements')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.operatingLicense')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.operatingReq">
                      An operating license is required for this vehicle, more
                      information can be found
                      <Link to="/operatingURL">HERE</Link>
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : (
            <Modal
              trigger={
                <Segment textAlign="center">
                  {t('resultOptions.notNecessary')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.operatingLicense')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>{t('document.operatingNotReq')}</Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }
  function DataRequirement () {
    const counter = calculateDataLevelRequired(levels, charge, elevation)
    data = counter
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="right">
          <Modal
            trigger={
              <Segment basic textAlign="right">
                {t('resultOptions.dataRequirements')}
                <Icon circular color="teal" name="help" />
              </Segment>
            }
          >
            <Modal.Header>{t('resultOptions.dataRequirements')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>
                  <Trans i18nKey="resultOptions.dataExpH">
                    If the vehicle does not transit on the ground level, OR if
                    its weight is more than {{ weight2 }} {{ wunits }}, OR if
                    its top factory speed is higher than {{ speed2 }}
                    {{ sunits }}, then the data-sharing requirements are strict.
                  </Trans>
                  <br />
                  <br />
                  <Trans i18nKey="resultOptions.dataExpL">
                    If the vehicle transits on the ground level, AND if its
                    weight is less than or equal to {{ weight2 }} {{ wunits }},
                    AND if its top factory speed is lower than or equal to
                    {{ speed2 }} {{ sunits }}, OR if its intended use is
                    commercial, then the data-sharing requirements are less
                    strict.
                  </Trans>
                  <br />
                  <br />
                  <Trans i18nKey="resultOptions.dataExpN">
                    If the vehicle transits on the ground level, AND if its
                    weight is less than or equal to {{ weights }} {{ wunits }}
                    AND if its top factory speed is lower than or equal to
                    {{ speeds }} {{ sunits }}, AND if its intended use is
                    personal, then it must not share any data.
                  </Trans>
                </Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column>
          {data === 1 ? (
            <Modal
              trigger={
                <Segment inverted color="orange" textAlign="center">
                  {t('resultOptions.loose')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.dataRequirements')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.dataLoose">
                      This vehicle must report some data, according to the
                      Atlantis Data Office's moderate level guidelines available
                      <Link to="/dataLooseURL">HERE</Link>. And remember that we
                      will always protect your privacy
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : data === 2 ? (
            <Modal
              trigger={
                <Segment inverted color="red" textAlign="center">
                  {t('resultOptions.strict')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.dataRequirements')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.dataStrict">
                      This vehicle in the use case indicated has the highest
                      level of data requirements, according to the Atlantis Data
                      Office's guidelines available
                      <Link to="/dataStrictURL">HERE</Link>. Given the
                      characteristics of the vehicle and how it will be used,
                      these more stringent requirements have been established
                      for everyone's wellbeing, and in order to monitor with
                      greater detail how the vehicle is being used. You have
                      been warned
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : (
            <Modal
              trigger={
                <Segment textAlign="center">{t('resultOptions.none')}</Segment>
              }
            >
              <Modal.Header>{t('resultOptions.dataRequirements')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.dataNone">
                      No data will be required of this vehicle, You can roam
                      freely and peacefully but please always be alert of your
                      surroundings. Also, you could still voluntarily provide
                      some data it if you find that it will improve Atlantis's
                      mobility conditions. If you are interested in providing
                      data, please go <Link to="/dataNoneURL">HERE</Link> (you
                      can later revoke this).
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }

  function PriceRequired () {
    const counter = calculatePriceRequired(levels)
    price = counter
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Modal
            trigger={
              <Segment basic textAlign="right">
                {t('resultOptions.price')}
                <Icon circular color="teal" name="help" />
              </Segment>
            }
          >
            <Modal.Header>{t('resultOptions.price')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>
                  <Trans i18nKey="resultOptions.priceExpH">
                    If the weight of the vehicle is more than {{ weight2 }}
                    {{ wunits }}, OR if its top factory speed is higher than
                    {{ speed2 }} {{ sunits }}, OR if its space efficiency per
                    person is more than {{ footprint2 }} {{ funits }}, OR if its
                    exhaust-emissions efficiency per person is more than
                    {{ emission2 }} {{ eunits }}, then it must pay high fees and
                    fines.
                  </Trans>
                  <br />
                  <br />
                  <Trans i18nKey="resultOptions.priceExpL">
                    If the weight of the vehicle is less than or equal to
                    {{ weight2 }} {{ wunits }}, AND if its top factory speed is
                    lower than or equal to {{ speed2 }} {{ sunits }}, AND if its
                    space efficiency per person is less than or equal to
                    {{ footprint2 }} {{ funits }}, AND if its exhaust-emissions
                    efficiency per person is less than or equal to
                    {{ emission2 }} {{ eunits }}, OR if its intended use is
                    commercial, then it must pay low fees and fines.
                  </Trans>
                  <br />
                  <br />
                  <Trans i18nKey="resultOptions.priceExpN">
                    If the weight of the vehicle is less than or equal to
                    {{ weights }} {{ wunits }}, AND if its top factory speed is
                    lower than or equal to {{ speeds }} {{ sunits }}, AND if its
                    space efficiency per person is less than or equal to
                    {{ footprints }} {{ funits }}, OR if its exhaust-emissions
                    efficiency per person is equal to {{ emission }}
                    {{ eunits }}, AND if its intended use is personal, then it
                    must not pay any fees and fines.
                  </Trans>
                </Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column>
          {counter === 2 ? (
            <Modal
              trigger={
                <Segment inverted color="red" textAlign="center">
                  {t('resultOptions.priceHigh')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.price')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.pricesHigh">
                      Fees associated to this vehicle will be high, according to
                      the very popular and well-respected Pricing Office of
                      Atlantis. Please see guidelines
                      <Link to="/priceHighURL">HERE</Link>
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : counter === 1 ? (
            <Modal
              trigger={
                <Segment textAlign="center" inverted color="orange">
                  {t('resultOptions.priceLow')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.price')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.priceLow">
                      Fees associated to this vehicle will be low, according to
                      the very popular and well-respected Pricing Office of
                      Atlantis. Please see guidelines
                      <Link to="/priceLowURL">HERE</Link>
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : (
            <Modal
              trigger={
                <Segment textAlign="center">
                  {t('resultOptions.priceNA')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.price')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>{t('document.pricesNA')}</Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          )}
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
          <Modal
            trigger={
              <Segment basic textAlign="right">
                {t('resultOptions.subsidy')}
                <Icon circular color="teal" name="help" />
              </Segment>
            }
          >
            <Modal.Header>{t('resultOptions.subsidy')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>
                  <Trans i18nKey="resultOptions.subsidyExp">
                    If the vehicle transits on the ground level, AND if its
                    exhaust-emissions efficiency per person is equal to
                    {{ emission }} {{ eunits }}, OR if its ILL-Health value is
                    greater than or equal to {{ healths }} {{ hunits }}, OR if
                    the service provider is local, then it is eligible for
                    subsidies.
                  </Trans>
                </Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column>
          {subsidy ? (
            <Modal
              trigger={
                <Segment textAlign="center" inverted color="green">
                  {t('resultOptions.formRequest')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.subsidy')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.subsidyGiven">
                      This vehicle can receive a subsidy, after a very simple
                      process that can be requested online through the
                      Department of Nice Things
                      <Link to="/subsidyURL">HERE</Link>. It's our way of saying
                      thanks.
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : (
            <Modal
              trigger={
                <Segment textAlign="center">{t('resultOptions.none')}</Segment>
              }
            >
              <Modal.Header>{t('resultOptions.subsidy')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>{t('document.subsidyNone')}</Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }

  function Risk () {
    const counter = calculateRisk(levels, elevation, charge)
    risk = counter
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Modal
            trigger={
              <Segment basic textAlign="right">
                {t('resultOptions.risk')}
                <Icon circular color="teal" name="help" />
              </Segment>
            }
          >
            <Modal.Header>{t('resultOptions.risk')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>
                  <Trans i18nKey="resultOptions.riskExp">
                    If the intended use of the vehicle is commercial, OR if its
                    weight is more than {{ weight2 }} {{ wunits }}, OR if its
                    top factory speed is higher than {{ speed2 }} {{ sunits }},
                    OR if its exhaust-emissions efficiency per person is more
                    than {{ emission2 }} {{ eunits }}, OR if its elevation is
                    above the ground (flying), then it requires a risk
                    assessment.
                  </Trans>
                </Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
        <Grid.Column>
          {risk ? (
            <Modal
              trigger={
                <Segment inverted color="red" textAlign="center">
                  {t('resultOptions.seeRequirements')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.risk')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="document.riskReq">
                      A risk assessment is required for this vehicle. The Risk
                      Department contains greater details
                      <Link to="/riskURL">HERE</Link>
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          ) : (
            <Modal
              trigger={
                <Segment textAlign="center">
                  {t('resultOptions.notNecessary')}
                </Segment>
              }
            >
              <Modal.Header>{t('resultOptions.risk')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>{t('document.riskNotReq')}</Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          )}
        </Grid.Column>
      </Grid.Row>
    )
  }

  function SpaceAllocation () {
    spaceArray = calculateSpaceRequired(levels, elevation, automation)
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
          <Modal trigger={<Button>{t('resultOptions.nextPUDO')}</Button>}>
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
    var pageWidth = 8.5
    var lineHeight = 1.2
    var margin = 0.5
    var maxLineWidth = pageWidth - margin * 2
    var fontSize = 10
    var ptsPerInch = 72
    var oneLineHeight = (fontSize * lineHeight) / ptsPerInch
    var doc = new JsPDF({
      unit: 'in',
      lineHeight: lineHeight
    }).setProperties({ title: 'Linesplit' })
    var svgElements = document.body.querySelectorAll('svg')
    svgElements.forEach(function (item) {
      item.setAttribute('width', item.getBoundingClientRect().width)
      item.style.width = null
    })
    html2canvas(document.getElementById(vehicle.name)).then(function (canvas) {
      document.body.appendChild(canvas)
    })

    let text = ''
    const intro = (
      <Trans i18nKey="introPDF">
        This document is a summary of the {city.name} policy recommendation for
        a {vehicle.name} in a {name} use case, based on the Periodic Table of
        Mobility. It can be used in Atlantis to process requirements in order to
        use this vehicle in this glorious (albeit fictitious) island.
      </Trans>
    )
    intro.props.children.forEach(element => {
      text += element
    })
    let line = 10
    var textLines = doc
      .setFontSize(fontSize)
      .splitTextToSize(text, maxLineWidth)
    doc.text(textLines, margin, margin + oneLineHeight * line)
    line = line + 4
    if (drivers) {
      text = t('document.driversReq')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      doc.link(margin + 5.55, margin + line * oneLineHeight - 0.2, 0.5, 0.25, {
        url: 'https://stackoverflow.com/'
      })
      line = line + 3
    } else {
      text = t('document.driversNotReq')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    }
    if (operating > 0) {
      text = t('document.operatingReq')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 2
    } else {
      text = t('document.operatingNotReq')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 2
    }
    if (data === 2) {
      text = t('document.dataStrict')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 5
    } else if (data === 1) {
      text = t('document.dataLoose')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 4
    } else {
      text = t('document.dataNone')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 4
    }
    if (price === 2) {
      text = t('document.pricesHigh')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    } else if (price === 1) {
      text = t('document.pricesLow')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    } else {
      text = t('document.pricesNA')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    }
    if (subsidy) {
      text = t('document.subsidyGiven')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    } else {
      text = t('document.subsidyNone')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    }
    if (risk > 0) {
      text = t('document.riskReq')
      text = text.replace('<1>HERE</1>', 'HERE')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 2
    } else {
      text = t('document.riskNotReq')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 2
    }
    doc.text(vehicle.name, margin, margin + oneLineHeight)
    doc.save('generated.pdf')
  }
  const vname = t('vehicles:vehicleNames.' + vehicle.id)
  const cname = city.name
  return (
    <div id="printArea" className="box">
      <Header>
        <Trans i18nKey="resultOptions.header1">
          These are the recommendations for {{ vname }} in {{ cname }}
          framework for {{ name }} use
        </Trans>
      </Header>
      <Grid centered>
        <Grid.Row stretched columns={2}>
          <Grid.Column width={6}>
            <div className="box1">
              <Grid id="someHtml" centered>
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
                <Grid.Row>
                  <Segment basic>{t('resultOptions.attTitle')}</Segment>
                </Grid.Row>
                <Grid.Row columns={2} textAlign="center">
                  <Grid.Column>
                    <Segment textAlign="right" basic>
                      {t('resultOptions.capacity')}:{' '}
                      {vehicle.attributes.capacity.value}{' '}
                      {vehicle.attributes.capacity.units}{' '}
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment basic>
                      {t('resultOptions.weight')}:{' '}
                      {vehicle.attributes.weight.value}{' '}
                      {vehicle.attributes.weight.units}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} textAlign="center">
                  <Grid.Column>
                    <Segment textAlign="right" basic>
                      {t('resultOptions.footprint')}:{' '}
                      {vehicle.attributes.footprint.value}{' '}
                      {vehicle.attributes.footprint.units}
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment basic>
                      {t('resultOptions.emissions')}:{' '}
                      {vehicle.attributes.emissions.value} CO₂ g/km
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} textAlign="center">
                  <Grid.Column>
                    <Segment textAlign="right" basic>
                      {t('resultOptions.health')}:{' '}
                      {vehicle.attributes.health.value} MET
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment basic>
                      {t('resultOptions.speed')}:{' '}
                      {vehicle.attributes.speed.value}{' '}
                      {vehicle.attributes.speed.units}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
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

            <Modal
              trigger={
                <Image src="/images/PerfilCurb.jpg" alt="street-image" />
              }
            >
              <Modal.Header>{t('resultOptions.streetAllocation')}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header>
                    <Trans i18nKey="resultOptions.streetA">
                      If the elevation of the vehicle is not above the ground
                      (flying), AND if its weight is less than or equal to
                      {{ weights }} {{ wunits }}, AND if its top factory speed
                      is lower than or equal to {{ speeds }} {{ sunits }}, AND
                      if its space efficiency per person is less than or equal
                      to {{ footprints }} {{ funits }}, AND if its
                      exhaust-emissions efficiency per person is equal to
                      {{ emission }} {{ eunits }}, AND if its ILL-Health value
                      is greater than or equal to {{ healths }} {{ hunits }},
                      AND if its level of automation is 0, then it belongs to
                      position A.
                    </Trans>
                    <br />
                    <br />
                    <Trans i18nKey="resultOptions.streetC">
                      If the elevation of the vehicle is not above the ground
                      (flying), AND if its top factory speed is lower than or
                      equal to {{ speed2 }} {{ sunits }}, AND if its space
                      efficiency per person is less than or equal to
                      {{ footprint2 }} {{ funits }}, AND if its
                      exhaust-emissions efficiency per person is less than or
                      equal to {{ emission2 }} {{ eunits }}, AND if its level of
                      automation is below or equal to 2, then it belongs to
                      position C.
                    </Trans>
                    <br />
                    <br />
                    <Trans i18nKey="resultOptions.streetD">
                      If the top factory speed of the vehicle is higher than to
                      {{ speed2 }} {{ sunits }}, OR if its space efficiency per
                      person is more than {{ footprint2 }} {{ funits }}, OR if
                      its exhaust-emissions efficiency per person is more than
                      {{ emission2 }} {{ eunits }}, OR if its level of
                      automation is above 2, OR if its elevation is above the
                      ground (flying), then it belongs to position D.
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
            <Grid relaxed>
              <SpaceAllocation />
            </Grid>
          </Grid.Row>
        </div>
      </Grid>
      <Segment basic>
        <Button onClick={GeneratePDF}>{t('generatePDF')}</Button>
      </Segment>
    </div>
  )
}

export default ResultOptions
