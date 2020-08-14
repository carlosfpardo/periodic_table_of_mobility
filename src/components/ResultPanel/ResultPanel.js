import React from 'react'
import PropTypes from 'prop-types'
import VehicleImage from './VehicleImage'
import SummaryPolicy from './SummaryPolicy'
import RadarChart from './RadarChart_old'
import { mapAttributeValuesToLevel } from '../../utils/binning'
import ImageUpload from '../ImageUpload/ImageUpload'

ResultPanel.propTypes = {
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
  setVehicle: PropTypes.func
}

function ResultPanel ({ vehicle, setVehicle }) {
  const levels = mapAttributeValuesToLevel(vehicle.attributes)

  return (
    <div className="box">
      <VehicleImage vehicle={vehicle} />
      <ImageUpload vehicle={vehicle} setVehicle={setVehicle} />
      <SummaryPolicy levels={levels} />
      <RadarChart levels={levels} />
    </div>
  )
}

export default ResultPanel
