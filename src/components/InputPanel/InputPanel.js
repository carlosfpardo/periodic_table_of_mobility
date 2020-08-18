import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Header,
  Dropdown,
  Button,
  Icon,
  Input,
  Message
} from 'semantic-ui-react'
import find from 'lodash/find'
import DataInput from './DataInput'
import { getNewVehicleId } from '../../utils/uniqueid'
import ATTRIBUTES from '../../data/attributes_numo.json'
import { useTranslation } from 'react-i18next'
import api from '../../utils/api'

function Attributes ({ values = {}, onChange = () => {} }) {
  return ATTRIBUTES.map(attribute => (
    <DataInput
      key={attribute.id}
      attribute={attribute}
      value={values[attribute.id]}
      onChange={value => {
        onChange({ ...values, [attribute.id]: value })
      }}
    />
  ))
}

InputPanel.propTypes = {
  vehicle: PropTypes.shape({
    'app:edited': PropTypes.string,
    id: PropTypes.string,
    lastEddited: PropTypes.string,
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

function InputPanel ({ vehicle, setVehicle }) {
  // const [profiles, setProfiles] = useState(VEHICLE_PROFILES)
  const [profiles, setProfiles] = useState([])
  /* const [idv, setId] = useState(null) */
  /* const [vehicles, setVehicles] = useState([]) */
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())
  const [isSavePending, setSavePending] = useState(false)
  const [isLoadingProfiles, setLoadingProfiles] = useState(false)
  const { t } = useTranslation(['translation', 'vehicles'])
  useEffect(() => {
    async function fetchVehicleProfiles () {
      setLoadingProfiles(true)

      try {
        api.readAllVehicles().then(vehicles => {
          const profiles = []
          var i = 0
          vehicles.forEach(element => {
            profiles[i] = element.data
            i++
          })
          /* setVehicles(vehicles) */
          /* setId(vehicles[0]) */
          setProfiles(profiles)
        })
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoadingProfiles(false)
    }

    fetchVehicleProfiles()
  }, [lastUpdate])

  function handleSaveProfile (event) {
    const clone = {
      ...vehicle,
      id: getNewVehicleId(),
      name: `${vehicle.name}`
    }
    if (typeof find(profiles, { name: clone.name }) === 'undefined') {
      setVehicle(clone)
      saveToApi('POST', clone)
    } else {
      updateToApi(vehicle)
    }
  }

  async function updateToApi (vehicle) {
    setSuccess('')
    setError('')
    const transport = {
      lastEddited: vehicle['app:edited'],
      attributes: vehicle.attributes,
      id: getNewVehicleId(),
      name: vehicle.name,
      image: vehicle.image
    }
    setSavePending(true)
    /* const cityref = find(vehicles, { data: idv })
    const id = getVehicleId(cityref)
    api.updateVehicle(id, transport).then(response => { */
    api.createVehicle(transport).then(response => {
      console.log(response)
      setLastUpdate(new Date().toISOString())
      setSavePending(false)
    })
  }
  async function saveToApi (method, vehicle) {
    setSuccess('')
    setError('')
    setSavePending(true)

    const transport = {
      id: vehicle.id,
      name: vehicle.name,
      image: vehicle.image,
      lastEddited: vehicle['app:edited'],
      attributes: vehicle.attributes
    }
    api
      .createVehicle(transport)
      .then(response => {
        console.log(response)
        setSavePending(false)
        setLastUpdate(new Date().toISOString())
        setSuccess(t('inputPanel.savedCorrect'))
      })
      .catch(e => {
        console.log('An API error occurred', e)
        setError(t('inputPanel.saveFail'))
      })
  }

  function handleAttributesChange (attributes) {
    setVehicle({
      ...vehicle,
      attributes
    })
  }

  function handleDropdownChange (event, data) {
    const vehicle = find(profiles, { id: data.value })
    /* setIdv(vehicle) */
    setVehicle(vehicle)

    // Reset error state.
    setSuccess('')
    setError('')
  }
  /* function setIdv (vehicle) {
    const oldVehicle = {
      lastEddited: vehicle.lastEddited,
      attributes: vehicle.attributes,
      id: vehicle.id,
      name: vehicle.name,
      image: vehicle.image
    }
    setId(oldVehicle)
  } */
  function handleNameChange (event, data) {
    const newVehicle = {
      ...vehicle,
      name: event.target.value
    }

    // Delete the vehicle image on name change so that
    // edited vehicles don't end up with the wrong image
    if (Object.prototype.hasOwnProperty.call(newVehicle, 'image')) {
      delete newVehicle.image
    }

    setVehicle(newVehicle)
  }

  return (
    <div className="box">
      <Header as="h3" dividing>
        {t('inputPanel.part1')}
      </Header>

      <p>{t('inputPanel.part2')}</p>

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
            text: t('vehicles:vehicleNames.' + item.id),
            value: item.id
          }))}
          onChange={handleDropdownChange}
        />
      </div>

      <div className="input-row">
        <label htmlFor="input-name">{t('inputPanel.vehicleName')}</label>
        <Input
          id="input-name"
          value={vehicle && vehicle.name}
          placeholder={t('inputPanel.vehicleNamePlaceholder')}
          onChange={handleNameChange}
        />
      </div>

      <Attributes
        values={vehicle && vehicle.attributes}
        onChange={handleAttributesChange}
      />

      <Button
        fluid
        color="green"
        icon
        labelPosition="left"
        onClick={handleSaveProfile}
        disabled={isSavePending || (vehicle && !vehicle.name)}
      >
        {isSavePending ? (
          <>
            <Icon loading name="spinner" />
            {t('inputPanel.savePlaceholder')}
          </>
        ) : (
          <>
            <Icon name="save" />
            {t('inputPanel.save')}
          </>
        )}
      </Button>
      {/*
        <Button
          primary
          basic
          icon
          labelPosition="left"
          onClick={updateToApi}
        >
          <Icon name="download" />
          Save as new vehicle
        </Button>
      */}

      {error && <Message error>{error}</Message>}
      {success && <Message success>{success}</Message>}
    </div>
  )
}
/* function getVehicleId (todo) {
  if (!todo.ref) {
    return null
  }
  return todo.ref['@ref'].id
} */
export default InputPanel
