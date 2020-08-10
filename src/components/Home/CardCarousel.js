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
import { fetchData } from '../../utils/gsheets'
import VehicleImage from '../ResultPanel/VehicleImage'
import { Header, Icon, Grid } from 'semantic-ui-react'
import './Carousel.css'
import 'pure-react-carousel/dist/react-carousel.es.css'
import PropTypes from 'prop-types'
CardCarousel.propTypes = {
  setVehicle: PropTypes.func
}
function CardCarousel ({ setVehicle }) {
  const [profiles, setProfiles] = useState([])
  useEffect(() => {
    async function fetchVehicleProfiles () {
      try {
        const profiles = await fetchData()
        setProfiles(profiles)
      } catch (err) {
        console.error(err)
      }
    }

    fetchVehicleProfiles()
  }, [])
  var i = 0
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
            <ButtonFirst className="button">
              <Icon name="angle double left" />
            </ButtonFirst>
            <ButtonBack className="button">
              <Icon name="angle left" />
            </ButtonBack>
          </Grid.Column>
          <Grid.Column>
            <Slider>
              {profiles.map(vehicle => (
                <Slide key={vehicle.id} index={i++}>
                  <VehicleImage vehicle={vehicle} />
                  <Header>{vehicle.name}</Header>
                </Slide>
              ))}
            </Slider>
          </Grid.Column>
          <Grid.Column>
            <ButtonNext className="button">
              <Icon name="angle right" />
            </ButtonNext>
            <ButtonLast className="button">
              <Icon name="angle double right" />
            </ButtonLast>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </CarouselProvider>
  )
}
export default CardCarousel
