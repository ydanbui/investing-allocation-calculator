import isEmpty from 'validator/lib/isEmpty';

// Initialize validator with initial form values
const validator = {
    maxAmount: false,
    symbol: [false, false],
    allocation: [false, false]
}

// Check if field is empty
const validateIfEmpty = (input, message) => {
    const errorEl = input.nextElementSibling
    if (input.value === '0.00' || isEmpty(input.value)) {
        // console.dir(input)
        // console.log(input.nextElementSibling)
        // const errorEl = document.createElement('div')
        errorEl.textContent = message
        // input.insertAdjacentElement('afterend', errorEl)
        console.log(message)
    } else {
        errorEl.textContent = ''
    }
}

const checkFormValid = () => {
    // Loop through validator object
    for (const field in validator) {
        // If there is a boolean value of false, return false
        if (!validator[field]) {
            return false

        // If the  value is an array and one of the array elements is false
        } else if (typeof validator[field] === 'object' && validator[field].some(element => !element)) {
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

export {validateIfEmpty}