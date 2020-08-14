import React, { useState } from 'react'
import api from '../../utils/api'
import { Button } from 'semantic-ui-react'

function ImageUpload () {
  const [file, setFile] = useState(null)
  function handleFileSelected (event) {
    setFile(event.target.files[0])
    if (checkPhoto(event.target)) {
      console.log('Not a valid image')
    }
  }
  function handleFileUpload () {
    const fd = new FormData()
    fd.append('image', file, file.name)
    api.createImage(file)
  }
  function checkPhoto (target) {
    if (target.files[0].type.indexOf('image') === -1) {
      return false
    }
    if (target.files[0].size > 102400) {
      return false
    }
    return true
  }
  return (
    <div>
      <input type="file" onChange={handleFileSelected} />
      <Button onClick={handleFileUpload}>Upload</Button>
    </div>
  )
}

export default ImageUpload
