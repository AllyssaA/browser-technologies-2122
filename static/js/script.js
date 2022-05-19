// const getFormData = require('./formData')
import { getPrevSibling, getNextSibling } from './getSibling.js'
import getFormData from './formData.js'

(function() {
    let formData = {}

    const form = document.querySelector('form')
    const formSection = form.querySelectorAll('.section')
    const question = form.querySelector('.question')
    const nav = form.querySelector('.js-navigation')
    const formInput = form.querySelectorAll('input')
    const formSelect = form.querySelectorAll('select')
    const btnSubmit = form.querySelector('.btn-submit')
    const formQuestions = document.querySelectorAll('.question')

    let activeQuestion = 1

    let btnNext
    let btnPrev
    let progressBar

    formData = getFormData('formData') || {}

    if(formData && Object.keys(formData).length !== 0) {
        formInput.forEach((input) => {
            const elName = input.getAttribute('name')
            if(formData[elName]) {
                if (input.type === 'radio' && input.value == formData[elName]) {
                    input.checked = true
            }
            if (input.type === 'checkbox' && formData[elName].includes(input.value)) {
                input.checked = true
              }
      
              if (input.type === 'text') {
                input.value = formData[elName]
              }
            }
        })

        formSelect.forEach((select)=> {
            const elName = select.getAttribute('name')
            const options = select.options

            Array.prototype.forEach.call(options, (option, index) => {
                if(option.value == formData[elName]) {
                    select.value = option.value
                }
            })
        })
    }

    createSection()
    createNav()
    createProgressIndi()

    //Only show 1 section at a time
    function createSection(){
        formSection.forEach((section, index) => {
            if (index > 0) section.classList.add('hidden')
            formSection[0].classList.add('active')

            const sectionQuestion = section.querySelectorAll('.question')
            sectionQuestion.forEach((question, index) => {
                if(index > 0) question.classList.add('hidden')
                sectionQuestion[0].classList.add('active')
            })
        })        
    }

    function createNav() {
        btnNext = document.createElement('button')
        btnNext.classList.add('button')
        btnNext.type = 'button'
        btnNext.innerText = 'Volgende'

        btnPrev = btnNext.cloneNode()
        btnPrev.innerText = 'Terug'

        if(activeQuestion === 1) {
            btnPrev.classList.add('invisible')
        }

        btnNext.addEventListener('click', navigate('next'))
        btnPrev.addEventListener('click', navigate('prev'))
    
        nav.insertAdjacentElement('afterbegin', btnNext)
        nav.insertAdjacentElement('afterbegin', btnPrev)
    
        // Hide submit button if user is not on the last question
        if (activeQuestion !== question.length) {
          btnSubmit.classList.add('hidden')
        }
    }

    function navigate(direction) {
        return () => {
            const currentSection = document.querySelector('.section.active')
            const currentQuestion = currentSection.querySelector('.question.active')
            const currentQuestionFields = currentQuestion.querySelectorAll('input, select')

            const prevSection = getPrevSibling(currentSection, '.section')
            const nextSection = getNextSibling(currentSection, '.section')

            const prevQuestion = getPrevSibling(currentQuestion, '.question')
            const nextQuestion = getNextSibling(currentQuestion, '.question')

            if(direction === 'next') {
                if(nextQuestion || nextSection) {
                    let fieldsValid = []

                    const errorMsg = currentQuestion.querySelector('.error-message') || document.createElement('span')

                    currentQuestionFields.forEach((field, index) => {
                        let fieldValidity
            
                        if (field.type === 'checkbox') {
                          fieldValidity = field.checked
                        } else {
                          fieldValidity = field.checkValidity()
                        }

                        fieldsValid = [...fieldsValid, fieldValidity]
                        
                         // Field is not valid, show error
                        if (!fieldValidity) {
                            field.classList.add('has-error')
                        } else {
                            field.classList.remove('has-error')
                        }
                    })


                        const isValid = (el) => el === true

                        // Invalid answer
                        if (fieldsValid.some(isValid)) {
                            errorMsg.innerText = ''
                        } else {
                            errorMsg.classList.add('error-message')
                            errorMsg.innerText = currentQuestion.dataset.error
                            currentQuestion.insertAdjacentElement('beforeend', errorMsg)
                            return
                        }

                        updateActiveQuestion(activeQuestion + 1)
                    }

                    // not last question
                    if(nextQuestion) {
                        currentQuestion.classList.add('hidden')
                        currentQuestion.classList.remove('active')
                        nextQuestion.classList.remove('hidden')
                        nextQuestion.classList.add('active')
                    } else if(nextSection){
                        const firstQuestion = nextSection.querySelector('.question')
                        firstQuestion.classList.remove('hidden')
                        firstQuestion.classList.add('active')

                        currentSection.classList.add('hidden')
                        currentSection.classList.remove('active')

                        nextSection.classList.remove('hidden')
                        nextSection.classList.add('active')
                    }      
                }

                else if(direction === 'prev'){
                    if(prevQuestion || prevSection) {
                        updateActiveQuestion(activeQuestion - 1)
                    }        

                    if(prevQuestion) {
                        currentQuestion.classList.add('hidden')
                        currentQuestion.classList.remove('active')
                        prevQuestion.classList.remove('hidden')
                        prevQuestion.classList.add('active')
                    }
                    else if(prevSection){
                        currentSection.classList.add('hidden')
                        currentSection.classList.remove('active')
              
                        prevSection.classList.remove('hidden')
                        prevSection.classList.add('active')    
                    }
                }

                if(activeQuestion === 1) {
                    btnPrev.classList.add('invisible')
                } else {
                    btnPrev.classList.remove('invisible')  
                }
                
                if (activeQuestion === formQuestions.length) {
                    btnNext.classList.add('hidden')
                    btnSubmit.classList.remove('hidden')
                  } else {
                    btnNext.classList.remove('hidden')
                    btnSubmit.classList.add('hidden')
                  }
            }
        }

    // Progress indicator
    function createProgressIndi() {
    // Create progress bar
        progressBar = document.createElement('div')
        progressBar.classList.add('progress-bar')

        updateProgressIndicator()
        
        document.body.insertAdjacentElement('afterbegin', progressBar)

        // Set active question
        form.dataset.activeQuestion = activeQuestion
    }

    // Set correct width progress bar
    function updateProgressIndicator() {
        form.dataset.activeQuestion = activeQuestion
        progressBar.style.transform = `scaleX(${activeQuestion / formQuestions.length})`
    }

    function updateActiveQuestion(value) {
        activeQuestion = value
        updateProgressIndicator()
    }

    // Update form fields on input
    formInput.forEach((input) => {
        input.addEventListener('input', updateInput)
    })

    formSelect.forEach((select) => {
        select.addEventListener('input', updateInput)
    })

    form.addEventListener('submit', handleFormSubmit)

    function updateInput(e) {
        const elName = this.getAttribute('name')
        const elValue = this.value

        if (this.type === 'checkbox') {
        const checkboxes = form.querySelectorAll(`input[name=${elName}]`)
        let checkboxesValues = []

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
            checkboxesValues[index] = checkbox.value
            }
        })

        formData[elName] = checkboxesValues
        } else {
            formData[elName] = elValue
        }   

        if ('localStorage' in window) {
        localStorage.setItem('formData', JSON.stringify(formData))
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault()
        alert('Antwoorden zijn verstuurd!')
    }

}())


                
            


                 

                
        
    

