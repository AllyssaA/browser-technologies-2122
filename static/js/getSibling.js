function getPrevSibling(el, selector) {
    let sibling = el.previousElementSibling
  
    while (sibling) {
          if (sibling.matches(selector)) return sibling
          sibling = sibling.previousElementSibling
      }
  
    return sibling
  }
  
  function getNextSibling(el, selector) {
    let sibling = el.nextElementSibling
  
    while (sibling) {
          if (sibling.matches(selector)) return sibling
          sibling = sibling.nextElementSibling
      }
  
    return sibling
  }
  
  export { getPrevSibling, getNextSibling }