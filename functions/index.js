const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const { Storage } = require('@google-cloud/storage')
const Busboy = require('busboy')
const path = require('path')
const os = require('os')

const gcconfig = new Storage({
  projectId: 'periodicimage',
  keyfilename: 'periodicimage-firebase-adminsdk-zosmm-cf9b17db40.json'
})
const fs = require('fs')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.uploadFile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    const busboy = new Busboy({ headers: req.headers })
    let uploadData = null

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename)
      uploadData = { file: filepath, type: mimetype }
      file.pipe(fs.createWriteStream(filepath))
    })

    busboy.on('finish', () => {
      const bucket = gcconfig.bucket('periodicimage.appspot.com')
      bucket
        .upload(uploadData.file, {
          uploadType: 'media',
          metadata: {
            metadata: {
              contentType: uploadData.type
            }
          }
        })
        .then(() => {
          return res.status(200).json({
            message: 'It worked!'
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    })
    busboy.end(req.rawBody)
  })
})
