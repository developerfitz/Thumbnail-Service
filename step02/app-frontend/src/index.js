
import ThumbnailServiceApi from '../../image-api/dist'

const client = new ThumbnailServiceApi.ImagesApi()

window.onload = (event) => {
  const uploadButton = document.getElementById('#upload_button')
  if (uploadButton) {
    uploadButton.addEventListener('click', (e) => {
      const uploadInput = document.getElementById('#upload_input')
      for (let file of uploadInput.files) {
        client.appGetUploadUrl(file.name, file.type, (err, imageUrl, response) => {
          const request = new Request(imageUrl.presigned_url, {
            method: 'PUT',
            mode: 'cors',
            body: file,
            contentType: file.type,
          })

          fetch(request)
            .then(response => {
              console.log(response)
            })
        })
      }
    })
  }
};
