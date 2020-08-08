import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Segment, Header, Button, Modal, Image } from 'semantic-ui-react'
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
          <Segment textAlign="right" basic>
            {t('resultOptions.operatingLicense')}
          </Segment>
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
    if (data === 1) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <Segment basic>{t('resultOptions.dataRequirements')}</Segment>
          </Grid.Column>
          <Grid.Column>
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
                    <Trans i18nKey="document.priceHigh">
                      Fees associated to this vehicle will be high, according to
                      the very popular and well-respected Pricing Office of
                      Atlantis. Please see guidelines
                      <Link to="/priceHighURL">HERE</Link>
                    </Trans>
                  </Header>
                </Modal.Description>
              </Modal.Content>
            </Modal>
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
          <Modal
            trigger={
              <Segment textAlign="center">{t('resultOptions.priceNA')}</Segment>
            }
          >
            <Modal.Header>{t('resultOptions.price')}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>{t('document.pricesNA')}</Header>
              </Modal.Description>
            </Modal.Content>
          </Modal>
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
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      doc.link(margin + 5.55, margin + line * oneLineHeight - 0.2, 0.5, 0.25, {
        url: 'https://stackoverflow.com/'
      })
      line = line + 3
    } else {
      text = t('document.driversNotReq')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    }
    if (operating > 0) {
      text = t('document.operatingReq')
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
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 5
    } else if (data === 1) {
      text = t('document.dataLoose')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 4
    } else {
      text = t('document.dataNone')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 4
    }
    if (price === 2) {
      text = t('document.pricesHigh')
      textLines = doc.setFontSize(fontSize).splitTextToSize(text, maxLineWidth)
      doc.text(textLines, margin, margin + line * oneLineHeight)
      line = line + 3
    } else if (price === 1) {
      text = t('document.pricesLow')
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

  return (
    <div id="printArea" className="box">
      <Header>
        <Trans i18nKey="header1">
          These are the recommendations for {vehicle.name} in {city.name}
          framework for {name} use
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
            <Image src="/images/PerfilCurb.jpg" alt="image" />
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
