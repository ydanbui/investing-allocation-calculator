import "core-js/stable"
import "regenerator-runtime/runtime"
import {fetchStockPrices, createStocksArray} from './stock'
import calculateInvestment, { printSummary } from './calculator'

const runProgram = async (maxAmountToInvest, stockInputValues) => {
    const stocks = await fetchStockPrices(stockInputValues)
    const totalCombined = calculateInvestment(maxAmountToInvest, stocks)
    printSummary(maxAmountToInvest, stocks, totalCombined)
}

// const arr = [new Stock('IVV', .5, 6000), new Stock('IXUS', .3, 2900), new Stock('IBM', .2, 1100)]

const form = document.querySelector('#form')

// User submits input (Event listener block)
form.addEventListener('submit', e => {
    e.preventDefault()

    const maxAmountToInvest = parseFloat(document.querySelector('#maxAmountToInvestDOM').value)
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
    stockInputGroupEl.innerHTML = `<div>${stocksInputGroups.length + 1}.</div><input class="stock-symbol" type="text"><div><label><input type="checkbox">Yes</label></div><input class="stock-allocation" type="text"><input class="stock-amount" type="number" step=".01">`
    stockInputContainer.appendChild(stockInputGroupEl)
})
