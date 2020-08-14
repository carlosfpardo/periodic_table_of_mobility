import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Image } from 'semantic-ui-react'
import './VehicleImage.css'
import { useTranslation } from 'react-i18next'
import { storage } from '../firebase/index'

VehicleImage.propTypes = {
  vehicle: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string
  })
}

function VehicleImage ({ vehicle }) {
  const [imgUrl, setUrl] = useState('')
  const { t } = useTranslation()
  if (!vehicle.image) return null
  var storageRef = storage.ref()
  const imageRef = storageRef.child(vehicle.image)
  imageRef
    .getDownloadURL()
    .then(url => {
      setUrl(url)
      console.log(imgUrl)
    })
    .catch(e => {
      console.error(e)
    })
  return (
    <Image
      src={imgUrl}
      alt={`${t('description.image')}: ${vehicle.name}`}
      bordered
      fluid
      rounded
      className="vehicle-image"
    />
  )
}

export default VehicleImage
