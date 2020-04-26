import isEmpty from 'validator/lib/isEmpty';

// Initialize validator with initial form values
const inputValidator = {
    maxAmount: false,
    symbol: [true, true],
    allocation: [true, true]
}

// Check if field is empty
const checkIfEmpty = (input) => {
    if (input.value === '0.00' || isEmpty(input.value)) {
        return true
    } else {
        return false
    }
}

const showErrorText = (input, message) => {
    const errorEl = input.nextElementSibling
    errorEl.textContent = message
    console.log(message)
}

const hideErrorText = (input) => {
    const errorEl = input.nextElementSibling
    errorEl.textContent = ''
}

const addValidator = (input, validatorProp, message) => {
    input.addEventListener('input', function() {
        inputValidator[validatorProp] = !checkIfEmpty(this)
        if (!checkIfEmpty(this)) {
            hideErrorText(this)
        }
    })
    input.addEventListener('blur', function() {
        if (checkIfEmpty(this)) {
            showErrorText(this, message)
        }
    })
}

const checkFormValid = () => {
    // Loop through inputValidator object
    for (const field in inputValidator) {
        // If there is a boolean value of false, return false
        if (!inputValidator[field]) {
            return false

        // If the  value is an array and one of the array elements is false
        } else if (typeof inputValidator[field] === 'object' && inputValidator[field].some(element => !element)) {
           return false
        }
    }
    return true
}

const form = document.querySelector('#form')
const submitBtn = document.querySelector('#submitBtn')

// Check if from is valid after user modifies form
form.addEventListener('input', e => {
    // IF from is valid, button should not be disabled
    submitBtn.disabled = !checkFormValid()
})

export {checkIfEmpty, inputValidator, showErrorText, hideErrorText, addValidator}