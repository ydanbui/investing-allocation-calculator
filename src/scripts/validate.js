import isEmpty from 'validator/lib/isEmpty';
import validator from 'validator';

// Initialize validator with initial form values
const inputValidator = {
    maxAmount: false,
    symbol: [],
    allocation: []
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

// Add event listeners to validate and error handling
const addValidator = (input, validatorProp, message, index) => {
    input.addEventListener('input', function() {
        // Add flag to validator object if field is not empty

        // If the input field is symbo or allocation
        if (validatorProp !== 'maxAmount') {
            // Change the correct flag in the array if field is not empy
            inputValidator[validatorProp][index] = !checkIfEmpty(this)
        // Else if it is the max amount field, change the flag in the object
        } else {
            inputValidator[validatorProp] = !checkIfEmpty(this)
        }
        // Do not show error text if field is not empty
        if (!checkIfEmpty(this)) {
            hideErrorText(this)
        }
    })

    input.addEventListener('blur', function() {
        // Show error text if field is empty on blur
        if (checkIfEmpty(this)) {
            showErrorText(this, message)
        }
    })

    // if (validatorProp === 'allocation') {
    //     input.addEventListener('change', () => {
    //         console.log('change')
    //         // inputValidator[validatorProp][index] = !checkIfEmpty(this)
    //     })
    // }
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

export {checkFormValid, checkIfEmpty, inputValidator, showErrorText, hideErrorText, addValidator}