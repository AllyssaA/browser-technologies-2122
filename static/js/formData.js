import getLocalStorage from './getLocalStorage.js'

function getFormData() {
  let formData = null

  if ('localStorage' in window) {
    formData = getLocalStorage('formData')
  }

  return formData
}

export default getFormData