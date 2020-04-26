import "core-js/stable"
import "regenerator-runtime/runtime"
import {fetchStockPrices, createStocksArray} from './stock'
import calculateInvestment, { printSummary } from './calculator'
import { addStockInputGroup, formatAmountInput } from './form'
import { checkFormValid, checkIfEmpty, inputValidator, showErrorText, hideErrorText, addValidator } from './validate'
import validator from "validator"

const maxAmountToInvestEl = document.querySelector('#maxAmountToInvestEl')

addStockInputGroup()
addStockInputGroup()

const runProgram = async (maxAmountToInvest, stockInputValues) => {
    const stocks = await fetchStockPrices(stockInputValues)
    const totalCombined = calculateInvestment(maxAmountToInvest, stocks)
    printSummary(maxAmountToInvest, stocks, totalCombined)
}

// User submits input (Event listener block)
const form = document.querySelector('#form')

form.addEventListener('submit', e => {
    e.preventDefault()

    const maxAmountToInvest = parseFloat(maxAmountToInvestEl.value.replace(',', ''))
    const stocksInputGroups = document.querySelectorAll('.stock-input-group')

    // Store user input in stocks array
    const stockInputArr = createStocksArray(stocksInputGroups)

    runProgram(maxAmountToInvest, stockInputArr)
})

// Add another stock
const addStockBtn = document.querySelector('#addStockBtn')
const submitBtn = document.querySelector('#submitBtn')
addStockBtn.addEventListener('click', e => {
    e.preventDefault()
    addStockInputGroup()

    // Disable button when we add a new stock (fields are empty)
    submitBtn.disabled = !checkFormValid()
})

// Format max amount input field using Autonumeric
formatAmountInput(maxAmountToInvestEl)

// Validate max amount field on blur
// maxAmountToInvestEl.addEventListener('input', function() {
//     inputValidator.maxAmount = !checkIfEmpty(this)
//     if (!checkIfEmpty(this)) {
//         hideErrorText(this)
//     }
// })
// maxAmountToInvestEl.addEventListener('blur', function() {
//     if (checkIfEmpty(this)) {
//         showErrorText(this, 'empty')
//     }
// })

addValidator(maxAmountToInvestEl, 'maxAmount', 'empty')