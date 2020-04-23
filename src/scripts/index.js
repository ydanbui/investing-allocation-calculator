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

// Allow only letter characters in simple input (and backspace, tab, enter)
const symbolInputEls = document.querySelectorAll('.input__symbol')
symbolInputEls.forEach(input => {
    input.addEventListener('keydown', e => {
        if (e.keyCode < 65 && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 13 || e.keyCode > 90) {
            e.preventDefault()
        }
    })
})

// Format money input fields using Autonumeric
const moneyInputEls = document.querySelectorAll('.input__money')
moneyInputEls.forEach(input => {
    new AutoNumeric(input, {
        emptyInputBehavior: "zero",
        minimumValue: "0"
    })
})

// Format allocation fields using Autonumeric
const allocationInputEls = document.querySelectorAll('.input__allocation')
const allocationAutoNumArr = []
const numStocks = allocationInputEls.length

allocationInputEls.forEach((input, index) => {
    allocationAutoNumArr[index] = new AutoNumeric(input, {
        decimalPlaces: 0,
        maximumValue: "99",
        minimumValue: "1"
    })

    // If there are just two stocks, changing allocaiton of one changes the other accordingly to sum to 100
    if (numStocks === 2) {
        // If this input is the last stock, change the first allocation
        if (index === numStocks - 1) {
            input.addEventListener('keyup', e => {
                // If there are just two stocks the remaining allocation is just 100 - the current allocation
                const remainingAllocation = 100 - input.value
                // Set the allocation of the previous stock to add to 100
                allocationAutoNumArr[index - 1].set(remainingAllocation)
            })
        } else {
            input.addEventListener('keyup', e => {
                // If there are just two stocks the remaining allocation is just 100 - the current allocation
                const remainingAllocation = 100 - input.value
                allocationAutoNumArr[index + 1].set(remainingAllocation)
            
            })
        }
    } else {
        // If there are more than 2 stock
        const allocationInputsArr = Array.from(allocationInputEls)

        // If it's the last stock, change the previous allocation so it sums to 100 when we change the last allocation
        if (index === numStocks - 1) {
            input.addEventListener('keyup', e => {
                const sumOfPrevAllocations = allocationInputsArr.reduce((total, allocInput, ind) => {
                    if (ind < numStocks - 2) {
                        return total + parseFloat(allocInput.value)
                    } else {
                        return total
                    }
                }, 0)

                const remainingAllocation = 100 - input.value - sumOfPrevAllocations
                // Set the allocation of the previous stock to add to 100
                allocationAutoNumArr[index - 1].set(remainingAllocation)
            })
        } else if (index === numStocks - 2){
            // If it's the second to last stock, change the last stock's allocation so they sum to 100
            input.addEventListener('keyup', e => {
                const sumOfPrevAllocations = allocationInputsArr.reduce((total, allocInput, ind) => {
                    if (ind < numStocks - 1) {
                        return total + parseFloat(allocInput.value)
                    } else {
                        return total
                    }
                }, 0)

                const remainingAllocation = 100 - sumOfPrevAllocations
                // Set the allocation of the next stock to add to 100
                allocationAutoNumArr[index + 1].set(remainingAllocation)
            })
        }
    }
})