function getLocalStorage(item) {
    const data = localStorage.getItem(item)
    if (!data) return
    return JSON.parse(data)
  }
  
  export default getLocalStorage