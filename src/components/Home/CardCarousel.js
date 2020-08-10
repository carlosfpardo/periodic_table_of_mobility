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
import { Header } from 'semantic-ui-react'

function CardCarousel () {
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
      naturalSlideHeight={1}
      totalSlides={profiles.length}
      style={{ width: '300px' }}
    >
      <Slider>
        {profiles.map(vehicle => (
          <Slide key={vehicle.id} index={i++}>
            <VehicleImage vehicle={vehicle} />
            <Header>{vehicle.name}</Header>
          </Slide>
        ))}
      </Slider>
      <ButtonFirst>First</ButtonFirst>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
      <ButtonLast>Last</ButtonLast>
    </CarouselProvider>
  )
}
export default CardCarousel
