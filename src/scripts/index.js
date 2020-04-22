import "core-js/stable"
import "regenerator-runtime/runtime"
import {fetchStockPrices, createStocksArray} from './stock'
import calculateInvestment, { printSummary } from './calculator'
import AutoNumeric from 'autonumeric'

const runProgram = async (maxAmountToInvest, stockInputValues) => {
    const stocks = await fetchStockPrices(stockInputValues)
    const totalCombined = calculateInvestment(maxAmountToInvest, stocks)
    printSummary(maxAmountToInvest, stocks, totalCombined)
}

const form = document.querySelector('#form')

// User submits input (Event listener block)
form.addEventListener('submit', e => {
    e.preventDefault()

    const maxAmountToInvest = parseFloat(document.querySelector('#maxAmountToInvestDOM').value.replace(',', ''))
    console.log(maxAmountToInvest)
    const stocksInputGroups = document.querySelectorAll('.stock-input-group')

    // Store user input in stocks array
    const stockInputArr = createStocksArray(stocksInputGroups)

    runProgram(maxAmountToInvest, stockInputArr)
})

// Add another stock
const addStockBtn = document.querySelector('#addStockBtn')
const stockInputContainer = document.querySelector('#stockInputContainer')


addStockBtn.addEventListener('click', e => {
    e.preventDefault()

    const stocksInputGroups = document.querySelectorAll('.stock-input-group')
    const stockInputGroupEl = document.createElement('div')
    stockInputGroupEl.classList.add('stock-input-group')
    stockInputGroupEl.innerHTML = `<div>${stocksInputGroups.length + 1}.</div><input class="stock-symbol" type="text" maxlength="5">
    <div>
        <label><input class="stock-checkbox" type="checkbox">Yes</label>
    </div>
    <div class="input-container input-container__allocation"> 
        <input class="stock-allocation input input__allocation" type="number" min="1" max="99">
    </div>
    <div class="input-container input-container__money"> 
        <input class="stock-amount input input__money" type="number" step=".01">
    </div>`
    
    const removeButton = document.createElement('button')
    removeButton.textContent = '-'

    removeButton.addEventListener('click', e => {
        stockInputContainer.removeChild(stockInputGroupEl)
    })

    stockInputGroupEl.appendChild(removeButton)
    stockInputContainer.appendChild(stockInputGroupEl)
})

// Format money input fields using Autonumeric
const moneyInputEls = document.querySelectorAll('.input__money')
moneyInputEls.forEach(input => {
    new AutoNumeric(input, {
        emptyInputBehavior: "zero",
        minimumValue: "0"
        // unformatOnSubmit: true
        // outputFormat: "number"
    })
})

// Format allocation fields using Autonumeric
const allocationInputEls = document.querySelectorAll('.input__allocation')
allocationInputEls.forEach(input => {
    new AutoNumeric(input, {
        decimalPlaces: 0,
        maximumValue: "99",
        minimumValue: "1"
    })
})

