import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Header, Dropdown, Message } from 'semantic-ui-react'
import find from 'lodash/find'
import { fetchData } from '../../utils/gsheets'
import { useTranslation } from 'react-i18next'
import { mapAttributeValuesToLevel } from '../../utils/binning'
import ResultOptions from './ResultOptions'
import { DEFAULT_USE_CASE } from '../../constants'
import { useCases } from '../../utils/useCase'
import Test from '../test/test'

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
  // const [profiles, setProfiles] = useState(VEHICLE_PROFILES)
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const [lastUpdate] = useState(new Date().toISOString())
  const levels = mapAttributeValuesToLevel(vehicle.attributes)
  const useCase = useCases(DEFAULT_USE_CASE)
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
      <Header as="h3" dividing>
        {t('resultPage.part1')}
      </Header>

      <p>{t('resultPage.part2')}</p>
      <Test />
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
          loading={isLoadingProfiles}
          options={profiles.map(item => ({
            key: item.id,
            text: item.name,
            value: item.id
          }))}
          onChange={handleDropdownChange}
        />
      </div>

      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}

      <ResultOptions levels={levels} useCase={useCase} vehicle={vehicle} />
    </div>
  )
}

export default ResultPage
