import AutoNumeric from 'autonumeric'
import { validateIfEmpty } from './validate'

const allocationAutoNumArr = []

// Reset event listeners to change allocation values in response to user input
// Called after the new stock is added
const configureAllocationInputs = () => {
    const allocationInputEls = document.querySelectorAll('.input__allocation')
    const numStocks = allocationInputEls.length

    // Skip event listener code until the two stock inputs have been initialized
    if (numStocks < 2) {
        return
    }

    // Loop through each allocation input
    // Remove old allocation setting event listeners if they exist
    // Add new event listeners to the now last and second to last stocks
    allocationInputEls.forEach((input, index) => {
        // Remove event listener on the now 3rd to last stock but was formerly the second to last
        if (index === numStocks - 3) {
            input.removeEventListener('keyup', setAllocationLastStock)
        
        // For the the now 2nd to last stock but was formerly last stock
        } else if (index === numStocks - 2) {
            // Remove old event listner
            input.removeEventListener('keyup', setAllocationPenultStock)

            // Add new event lister change the last stock's allocation
            input.addEventListener('keyup', setAllocationLastStock)

        // If it's the last stock, change the previous allocation so it sums to 100 when we change the last allocation
        } else if (index === numStocks - 1) {
            input.addEventListener('keyup', setAllocationPenultStock)
        }
    })
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
        <div>
            <input id="stockSymbol" class="input input__symbol" type="text" maxlength="5">
            <div class="input__error"></div>
        </div>
        <div>
            <label><input class="stock-checkbox" type="checkbox">Yes</label>
        </div>
        <div class="input-container input-container__allocation"> 
            <input class="stock-allocation input input__allocation" type="text">
            <div class="input__error"></div>
        </div>
        <div class="input-container input-container__money"> 
            <input id="stockAmount" class="input input__money" type="text">
            <div class="input__error"></div>
        </div>
    `

    // Only add remove button if it's the 3rd or higher stock
    if (stocksInputGroups.length >= 2) {
        newStockInputGroupEl.appendChild(addRemoveBtn(stockInputContainer, newStockInputGroupEl))
    }

    // Render the new stock input group
    stockInputContainer.appendChild(newStockInputGroupEl)

    // Format input fields
    formatSymbolInput(newStockInputGroupEl.querySelector('.input__symbol'))
    formatAmountInput(newStockInputGroupEl.querySelector('.input__money'))

    // Format the new allocation field and store new Autonumeric in array
    allocationAutoNumArr[stocksInputGroups.length] = formatAllocationInput(newStockInputGroupEl.querySelector('.input__allocation'))
    
    // Add and remove (if necessary) even handlers
    configureAllocationInputs()

    // Add field validation
    // Add validation on blur event to max amount filed
    newStockInputGroupEl.querySelector('#stockSymbol').addEventListener('blur', function () {
        validateIfEmpty(this, 'empty')
    })

    // Add validation on blur event to Allocation field
    newStockInputGroupEl.querySelector('.input__allocation').addEventListener('blur', function () {
        validateIfEmpty(this, 'empty')
    })
}

// Add remove button to stock input group
const addRemoveBtn = (stockInputContainer, newStockInputGroupEl) => {
    const removeBtn = document.createElement('button')
    removeBtn.textContent = '-'

    removeBtn.addEventListener('click', e => {
        const stocksInputGroupsNodeList = document.querySelectorAll('.stock-input-group')
        const stockInputGroups = Array.from(stocksInputGroupsNodeList)
        const allocationInputs = document.querySelectorAll('.input__allocation')
        
        // Get the index of the stock that is to be removed
        const indexToRemove = stockInputGroups.findIndex(inputGroup => inputGroup === newStockInputGroupEl)
        
        // Remove it's corresponding allocation AutoNumeric from the autonum array
        allocationAutoNumArr.splice(indexToRemove, 1)
            
        // If we are remocing the last stock
        if (indexToRemove === stockInputGroups.length -1) {
            // Remove the old allocation setter on the 2nd to last input
            allocationInputs[indexToRemove - 1].removeEventListener('keyup', setAllocationLastStock)
            // Make the 2nd to last (now last) alloc field change the new 2nd to last field
            allocationInputs[indexToRemove - 1].addEventListener('keyup', setAllocationPenultStock)
            // Make the what will become new second to last field change the new last field
            allocationInputs[indexToRemove - 2].addEventListener('keyup', setAllocationLastStock)
        
        // If we are removing the second to last stock
        } else if (indexToRemove === stockInputGroups.length - 2) {
            // Add event listener to what will become new second to last stock
            allocationInputs[indexToRemove - 1].addEventListener('keyup', setAllocationLastStock)
        }
                
        // Remove the input group
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