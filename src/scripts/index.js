import "core-js/stable"
import "regenerator-runtime/runtime"
import {fetchStockPrices, createStocksArray} from './stock'
import calculateInvestment, { printSummary } from './calculator'
import { addStockInputGroup, formatAmountInput } from './form'

import AutoNumeric from 'autonumeric'

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

    const maxAmountToInvest = parseFloat(document.querySelector('#maxAmountToInvestEl').value.replace(',', ''))
    const stocksInputGroups = document.querySelectorAll('.stock-input-group')

    // Store user input in stocks array
    const stockInputArr = createStocksArray(stocksInputGroups)

    runProgram(maxAmountToInvest, stockInputArr)
})

// Add another stock
const addStockBtn = document.querySelector('#addStockBtn')
addStockBtn.addEventListener('click', e => {
    e.preventDefault()
    addStockInputGroup()
})

// Format max amount input field using Autonumeric
formatAmountInput(document.querySelector('#maxAmountToInvestEl'))

// Format allocation fields using Autonumeric
const allocationInputEls = document.querySelectorAll('.input__allocation')
const numStocks = allocationInputEls.length

const allocationAutoNumArr = []
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
                // Sum all the allocations besides the last two stocks
                const sumOfPrevAllocations = allocationInputsArr.reduce((total, allocInput, ind) => {
                    if (ind < numStocks - 2) {
                        return total + parseFloat(allocInput.value)
                    } else {
                        return total
                    }
                }, 0)

                const remainingAllocation = 100 - input.value - sumOfPrevAllocations
                // Set the allocation of the second to last (previous) stock to add to 100
                allocationAutoNumArr[index - 1].set(remainingAllocation)
            })
        } else if (index === numStocks - 2){

            // If it's the second to last stock, change the last stock's allocation so the total sums to 100
            input.addEventListener('keyup', e => {
                // Sum all the allocations beside the last one
                const sumOfPrevAllocations = allocationInputsArr.reduce((total, allocInput, ind) => {
                    if (ind < numStocks - 1) {
                        return total + parseFloat(allocInput.value)
                    } else {
                        return total
                    }
                }, 0)

                const remainingAllocation = 100 - sumOfPrevAllocations

                // Set the allocation of the last stock to add to 100
                allocationAutoNumArr[index + 1].set(remainingAllocation)
            })
        }
    }
})