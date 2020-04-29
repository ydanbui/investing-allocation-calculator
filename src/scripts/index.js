import "core-js/stable"
import "regenerator-runtime/runtime"
import {fetchStockPrices, createStocksArray} from './stock'
import calculateInvestment from './calculator'
import { addStockInputGroup, formatAmountInput } from './form'
import {displayResults, displayUpdatedHoldings, displayCurrentHoldings} from './output'
import { checkFormValid, checkIfEmpty, inputValidator, showErrorText, hideErrorText, addValidator } from './validate'
import validator from "validator"
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});


const maxAmountToInvestEl = document.querySelector('#maxAmountToInvestEl')

addStockInputGroup()
addStockInputGroup()

const runProgram = async (maxAmountToInvest, stockInputValues) => {
    const stocks = await fetchStockPrices(stockInputValues)
    const [originalTotal, totalCombined] = calculateInvestment(maxAmountToInvest, stocks)
    displayResults(maxAmountToInvest, stocks, totalCombined)
    
    // Output tab behavior
    // When results tab is clicked, display results card
    document.querySelector('#resultsTab').addEventListener('click', e => {
        displayResults(maxAmountToInvest, stocks, totalCombined)
    })
    // When updated holdings tab is clicked, display updated holdings card
    document.querySelector('#updatedHoldingsTab').addEventListener('click', e => {
        displayUpdatedHoldings(stocks, totalCombined)
    })
    // When current holdings tab is clicked, display current holdings card
    document.querySelector('#currentHoldingsTab').addEventListener('click', e => {
        displayCurrentHoldings(stocks, originalTotal)
    })
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

// Add event listeners to validate and error handling
addValidator(maxAmountToInvestEl, 'maxAmount', 'empty')