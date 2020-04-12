import "core-js/stable"
import "regenerator-runtime/runtime"
import Stock, {fetchStockPrices} from './stock'
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
    const stockInputArr = []

    stocksInputGroups.forEach(stockInputGroup => {
        const symbol = stockInputGroup.querySelector('.stock-symbol').value
        const allocation = parseFloat(stockInputGroup.querySelector('.stock-allocation').value)
        const amount = parseFloat(stockInputGroup.querySelector('.stock-amount').value)

        stockInputArr.push(new Stock(symbol, allocation, amount))
    })

    runProgram(maxAmountToInvest, stockInputArr)
})

// Add another stock
const addStockBtn = document.querySelector('#addStockBtn')
const stockInputContainer = document.querySelector('#stockInputContainer')

addStockBtn.addEventListener('click', e => {
    e.preventDefault()
    
    const stockInputGroupEl = document.createElement('div')
    stockInputGroupEl.classList.add('stock-input-group')
    stockInputGroupEl.innerHTML = ' <label for="">Stock symbol</label><input class="stock-symbol" type="text"><label for="">Desired Allocation</label><input class="stock-allocation" type="text"><label for="">Current Amount</label><input class="stock-amount" type="number">'
    stockInputContainer.appendChild(stockInputGroupEl)
})
