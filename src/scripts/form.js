import AutoNumeric from 'autonumeric'

const allocationAutoNumArr = []

const setAllocation1stStock = () => {
    // When there are two stocks
    // If there are just two stocks the remaining allocation is just 100 - the current allocation
    const remainingAllocation = 100 - document.querySelectorAll('.input__allocation')[1].value // allocation of 2nd stock
    // Set the allocation of the previous (first) stock to add to 100
    allocationAutoNumArr[0].set(remainingAllocation)
}

const setAllocation2ndStock = () => {
    // When there are two stocks
    // If there are just two stocks the remaining allocation is just 100 - the current allocation
    const remainingAllocation = 100 - document.querySelectorAll('.input__allocation')[0].value // allocation of first stock
    // Set the allocation of 2nd stock
    allocationAutoNumArr[1].set(remainingAllocation)
}

const setAllocationPenultStock = () => {
    const allocationInputEls = document.querySelectorAll('.input__allocation')
    const allocationInputsArr = Array.from(allocationInputEls)
    const numStocks = allocationInputEls.length

    // Sum all the allocations besides the last two stocks
    const sumOfPrevAllocations = allocationInputsArr.reduce((total, allocInput, ind) => {
        if (ind < numStocks - 2) {
            return total + parseFloat(allocInput.value)
        } else {
            return total
        }
    }, 0)

    // 100 - value of current (last) stock - sum of all stocks besides last 2
    const remainingAllocation = 100 - document.querySelectorAll('.input__allocation')[numStocks - 1].value - sumOfPrevAllocations
    // Set the allocation of the second to last (previous) stock to add to 100
    allocationAutoNumArr[numStocks - 2].set(remainingAllocation)
}

const setAllocationLastStock = () => {
    console.log('set alloc last stodk')
    const allocationInputEls = document.querySelectorAll('.input__allocation')
    const allocationInputsArr = Array.from(allocationInputEls)
    const numStocks = allocationInputEls.length

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
    allocationAutoNumArr[numStocks - 1].set(remainingAllocation)
}

const addStockInputGroup = () => {
    const stockInputContainer = document.querySelector('#stockInputContainer')
    const stocksInputGroups = document.querySelectorAll('.stock-input-group')
    const newStockInputGroupEl = document.createElement('div')

    newStockInputGroupEl.classList.add('stock-input-group')
    newStockInputGroupEl.innerHTML = `
        <div>${stocksInputGroups.length + 1}.</div>
        <input id="stockSymbol" class="input input__symbol" type="text" maxlength="5">
        <div>
            <label><input class="stock-checkbox" type="checkbox">Yes</label>
        </div>
        <div class="input-container input-container__allocation"> 
            <input class="stock-allocation input input__allocation" type="text">
        </div>
        <div class="input-container input-container__money"> 
            <input id="stockAmount" class="input input__money" type="text">
        </div>
    `

    // Only add remove button if it's the 3rd or higher stock
    if (stocksInputGroups.length >= 2) {
        newStockInputGroupEl.appendChild(addRemoveBtn(stockInputContainer, newStockInputGroupEl))
    }

    stockInputContainer.appendChild(newStockInputGroupEl)

    // Format input fields
    formatSymbolInput(newStockInputGroupEl.querySelector('.input__symbol'))
    formatAmountInput(newStockInputGroupEl.querySelector('.input__money'))



    // ALLOCATION FIELD BEHAVIOR
    const allocationInputEls = document.querySelectorAll('.input__allocation')
    // const allocationAutoNumArr = []
    const numStocks = allocationInputEls.length

    // When there are only the initial two stocks
    if (numStocks === 2 ) {
        allocationInputEls.forEach((input, index) => {
            // Format the two allocation fields
            // Store new AutoNumerics in the array
            allocationAutoNumArr[index] = formatAllocationInput(input)
            
            // If the input is the last stock,
            if (index === 1) {
                // When user edits last stock alloc, change the first stock allocation
                input.addEventListener('keyup', setAllocation1stStock)
            } else {
            // the input is the first stock
                // When user edits first stock alloc, change the second stock alloc
                input.addEventListener('keyup', setAllocation2ndStock)
            }
        })

    // When we add additional stocks to the initial 2
    } else if (numStocks > 2) {
        // Format the new allocation field

        // Add new Autonumeric to array
        allocationAutoNumArr[stocksInputGroups.length] = formatAllocationInput(newStockInputGroupEl.querySelector('.input__allocation'))

        allocationInputEls.forEach((input, index) => {
            // remove original initialized event listeners to set allocation when we add a 3rd stock
            if (numStocks === 3 && index <= 1) {
                input.removeEventListener('keyup', setAllocation1stStock)
                input.removeEventListener('keyup', setAllocation2ndStock)
            } else if (numStocks > 3) {
                if (index === numStocks - 3) {
                    input.removeEventListener('keyup', setAllocationLastStock)
                } else if (index === numStocks - 2) {
                    input.removeEventListener('keyup', setAllocationPenultStock)
                }
            }

            // If it's the last stock, change the previous allocation so it sums to 100 when we change the last allocation
            if (index === numStocks - 1) {
                input.addEventListener('keyup', setAllocationPenultStock)
            } else if (index === numStocks - 2){
                // If it's the second to last stock, change the last stock's allocation so the total sums to 100
                input.addEventListener('keyup', setAllocationLastStock)
            }
        })
    }
}

// Add remove button to stock input group
const addRemoveBtn = (stockInputContainer, newStockInputGroupEl) => {
    const removeBtn = document.createElement('button')
    removeBtn.textContent = '-'

    removeBtn.addEventListener('click', e => {
        stockInputContainer.removeChild(newStockInputGroupEl)
    })

    return removeBtn
}

// Allow only letter characters in symbol input (and backspace, tab, enter)
const formatSymbolInput = (symbolInputEl) => {
    symbolInputEl.addEventListener('keydown', e => {
        if (e.keyCode < 65 && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 13 || e.keyCode > 90) {
            e.preventDefault()
        }
    })
}

// Format money input fields using Autonumeric
const formatAmountInput = (moneyInputEl) => {
    new AutoNumeric(moneyInputEl, {
        emptyInputBehavior: "zero",
        minimumValue: "0"
    })
}

// Format allocation input fields using Autonumeric
const formatAllocationInput = (allocationInputEl) => {
    return new AutoNumeric(allocationInputEl, {
        decimalPlaces: 0,
        maximumValue: "99",
        minimumValue: "1"
    })
}

export { addStockInputGroup, formatAmountInput }