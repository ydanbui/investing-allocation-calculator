import AutoNumeric from 'autonumeric'

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

export { addStockInputGroup, formatAmountInput }