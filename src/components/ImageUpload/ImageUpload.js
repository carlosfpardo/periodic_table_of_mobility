import React, { useState } from 'react'
/* import api from '../../utils/api' */
import { Button } from 'semantic-ui-react'

function ImageUpload () {
  const [file, setFile] = useState(null)
  function handleFileSelected (event) {
    setFile(event.target.files[0])
  }
  function handleFileUpload () {
    const fd = new FormData()
    fd.append('image', file, file.name)
  }
  return (
    <div>
      <input type="file" onChange={handleFileSelected} />
      <Button onClick={handleFileUpload}>Upload</Button>
    </div>
  )
}

export default ImageUpload
