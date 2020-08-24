import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonNext,
  ButtonBack,
  ButtonFirst,
  ButtonLast
} from 'pure-react-carousel'
import React, { useEffect, useState } from 'react'
import VehicleImage from '../ResultPanel/VehicleImage'
import { Header, Icon, Grid } from 'semantic-ui-react'
import './Carousel.css'
import 'pure-react-carousel/dist/react-carousel.es.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { Trans } from 'react-i18next'

CardCarousel.propTypes = {
  setVehicle: PropTypes.func
}
function CardCarousel ({ setVehicle }) {
  const [profiles, setProfiles] = useState([])
  const [i, setI] = useState(1)
  useEffect(() => {
    async function fetchVehicleProfiles () {
      try {
        api.readAllVehicles().then(vehicles => {
          const profiles = []
          var i = 0
          vehicles.forEach(element => {
            profiles[i] = element.data
            i++
          })
          setProfiles(profiles)
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchVehicleProfiles()
  }, [setVehicle])

  function handleFirst () {
    setI(0)
    setVehicle(profiles[0])
  }
  function handleBack () {
    setI(i - 1)
    setVehicle(profiles[i])
  }
  function handleNext () {
    setI(i + 1)
    setVehicle(profiles[i])
  }
  function handleLast () {
    setI(profiles.length - 1)
    setVehicle(profiles[i])
  }
  return (
    <CarouselProvider
      naturalSlideWidth={1}
      naturalSlideHeight={1.5}
      totalSlides={profiles.length}
      style={{ width: '500px' }}
    >
      <Grid verticalAlign="middle">
        <Grid.Row columns={3}>
          <Grid.Column>
            <ButtonFirst onClick={handleFirst} className="button">
              <Icon name="angle double left" />
            </ButtonFirst>
            <ButtonBack onClick={handleBack} className="button">
              <Icon name="angle left" />
            </ButtonBack>
          </Grid.Column>
          <Grid.Column>
            <Slider>
              {profiles.map(vehicle => (
                <Slide key={vehicle.id}>
                  <VehicleImage vehicle={vehicle} />
                  <Link to="/vehicles">
                    <Header>
                      <Trans i18nKey={'vehicles:vehicleNames.' + vehicle.id}>
                        {vehicle.name}
                      </Trans>
                    </Header>
                  </Link>
                </Slide>
              ))}
            </Slider>
          </Grid.Column>
          <Grid.Column>
            <ButtonNext onClick={handleNext} className="button">
              <Icon name="angle right" />
            </ButtonNext>
            <ButtonLast onClick={handleLast} className="button">
              <Icon name="angle double right" />
            </ButtonLast>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </CarouselProvider>
  )
}
export default CardCarousel
