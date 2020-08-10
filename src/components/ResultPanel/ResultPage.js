import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Header, Dropdown, Message } from 'semantic-ui-react'
import find from 'lodash/find'
import { fetchData } from '../../utils/gsheets'
import { useTranslation } from 'react-i18next'
import { mapAttributeValuesToLevel } from '../../utils/binning'
import ResultOptions from './ResultOptions'
import UseCase from './UseCase'

// import VEHICLE_PROFILES from '../../data/vehicle_profiles.json'

ResultPage.propTypes = {
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

function ResultPage ({ vehicle, setVehicle }) {
  const [city, setCity] = useState('')
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [lastUpdate] = useState(new Date().toISOString())
  const [vehicleset, setSetvehcile] = useState(false)
  const [useCase, setUseCase] = useState({})
  const levels = mapAttributeValuesToLevel(vehicle.attributes)
  const { t } = useTranslation()
  useEffect(() => {
    async function fetchVehicleProfiles () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchData()
        setProfiles(profiles)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoadingProfiles(false)
    }

    fetchVehicleProfiles()
  }, [lastUpdate])
  function handleDropdownChange (event, data) {
    const vehicle = find(profiles, { id: data.value })

    setVehicle(vehicle)
    // Reset error state.
    setSuccess('')
    setError('')
  }

  return (
    <div className="Policy">
      <p>{t('resultPage.part0')}</p>
      <Header as="h3" dividing>
        {t('resultPage.part1')}
      </Header>

      <p>{t('resultPage.part2')}</p>
      <div className="input-row">
        <Dropdown
          className="icon"
          id="presets"
          placeholder={
            isLoadingProfiles ? t('inputPanel.part3') : t('inputPanel.part4')
          }
          fluid
          search
          selection
          value=""
          text={vehicle.name}
          loading={isLoadingProfiles}
          options={profiles.map(item => ({
            key: item.id,
            text: item.name,
            value: item.id
          }))}
          onChange={handleDropdownChange}
        />
      </div>
      <UseCase
        useCase={useCase}
        setUseCase={setUseCase}
        city={city}
        setCity={setCity}
        vehicleset={vehicleset}
        setSetvehcile={setSetvehcile}
        levels={levels}
      />
      <ResultOptions
        levels={levels}
        useCase={useCase}
        city={city}
        vehicle={vehicle}
        vehicleset={vehicleset}
      />
      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}
    </div>
  )
}
export default ResultPage
