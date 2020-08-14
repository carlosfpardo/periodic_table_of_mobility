import React, { useState } from 'react'
import { Button, Message } from 'semantic-ui-react'
import axios from 'axios'
import PropTypes from 'prop-types'

ImageUpload.propTypes = {
  vehicle: PropTypes.shape({
    name: PropTypes.string
  }),
  setVehicle: PropTypes.func
}

function ImageUpload ({ vehicle, setVehicle }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleFileSelected (event) {
    setFile(event.target.files[0])
    setSuccess('')
    setError('')
    if (!checkPhoto(event.target)) {
      setError(
        'Not a valid image (image must be jpg, png or svg) and smaller than 100kb'
      )
      setFile(null)
    }
  }
  function handleFileUpload () {
    const fd = new FormData()
    fd.append('image', file, file.name)
    axios
      .post(
        'https://us-central1-periodicimage.cloudfunctions.net/uploadFile',
        fd
      )
      .then(res => {
        console.log(res)
      })
      .catch(e => {
        console.error(e)
      })
    const newVehicle = {
      ...vehicle,
      image: file.name
    }
    setVehicle(newVehicle)
    setSuccess('Image uploaded')
    setError('')
  }
  function checkPhoto (target) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg']
    if (target.files[0] == null) {
      return false
    }
    if (!acceptedImageTypes.includes(target.files[0].type)) {
      return false
    }
    if (target.files[0].size > 102400) {
      return false
    }
    return true
  }
  return (
    <div>
      {vehicle.name == null ? (
        ''
      ) : (
        <>
          <input type="file" onChange={handleFileSelected} />
          <Button disabled={file == null} onClick={handleFileUpload}>
            Upload
          </Button>
          {error && <Message error>{error}</Message>}
          {success && <Message success>{success}</Message>}
        </>
      )}
    </div>
  )
}

export default ImageUpload
