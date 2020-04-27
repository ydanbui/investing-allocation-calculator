// Generate amount to invest html elements for called stock
const generateAmountToBuyDOM = (stock) => {
    const investEl = document.createElement('div')

    if (stock.mutualFund) {
        investEl.innerHTML = `
            <p>$${stock.newShares.toFixed(2)} into ${stock.symbol}</p>
            <p>Current Price: $${stock.price.toFixed(2)} per share</p>
        `
    } else {
        investEl.innerHTML = `
            <p>$${(stock.newShares * stock.price).toFixed(2)} into ${stock.symbol}</p>
            <p>${stock.newShares} Shares at $${stock.price.toFixed(2)} per share</p>
        `
    }
    return investEl
}

// Generate updated holding html elements for called stock
const generateUpdatedStockAmountDOM = (stock) => {
    const holdingEl = document.createElement('div')

    holdingEl.innerHTML = `
        <span>${stock.symbol}</span>
        <span>$${stock.amount.toFixed(2)}(${(stock.percent * 100).toFixed(1)}%)</span>
    `
    return holdingEl
}

// Generate current holding html elements for called stock
const generateOriginalStockAmountDOM = (stock, originalTotal) => {
    const holdingEl = document.createElement('div')

    holdingEl.innerHTML = `
        <span>${stock.symbol}</span>
        <span>$${stock.originalAmount.toFixed(2)}(${(stock.originalAmount / originalTotal * 100).toFixed(1)}%)</span>
    `
    return holdingEl
}

// Display the updated holdings results view
const displayUpdatedHoldings = (stocks, totalCombined) => {
    const outputCard = document.querySelector('.output__card')
    outputCard.innerHTML = `
        <p>Your updated holdings will be</p>
    `

    // Display updated holding of each stock
    stocks.forEach((stock) => {
        outputCard.appendChild(generateUpdatedStockAmountDOM(stock))
    })

    const totalCombinedEl = document.createElement('div')
    totalCombinedEl.innerHTML = `
        <span>Total</span><span>$${totalCombined.toFixed(2)}</span>
    `

    outputCard.appendChild(totalCombinedEl)
}

// Display the current holdings results view
const displayCurrentHoldings = (stocks, originalAmount) => {
    const outputCard = document.querySelector('.output__card')
    outputCard.innerHTML = `
        <p>Your current holdings are</p>
    `

    // Display original holding of each stock
    stocks.forEach((stock) => {
        outputCard.appendChild(generateOriginalStockAmountDOM(stock, originalAmount))
    })

    const totalOriginalAmountEl = document.createElement('div')
    totalOriginalAmountEl.innerHTML = `
        <span>Total</span><span>$${originalAmount.toFixed(2)}</span>
    `

    outputCard.appendChild(totalOriginalAmountEl)
}

// Display/update the output card when calculation runs
const displayResults = (maxAmountToInvest, stocks, totalCombined) => {
    const outputCard = document.querySelector('.output__card')
    outputCard.innerHTML = `
        <p>You should invest</p>
    `
    
    // Display amount to invest in each stock
    stocks.forEach((stock) => {
        if (stock.mutualFund) {
            console.log(`Buy $${stock.newShares} of ${stock.symbol} (Current Price: $${stock.price})`)
        } else {
            console.log(`Buy ${stock.newShares} ${stock.symbol} shares at $${stock.price} per share ($${stock.newShares * stock.price} total)`)
        }
        outputCard.appendChild(generateAmountToBuyDOM(stock))
    })

    // Calculate the total invested in each stock
    const totalSpent = stocks.reduce((total, stock) => {
        if (stock.mutualFund) {
            return total + (stock.newShares)
        } else {
            return total + (stock.newShares * stock.price)
        }
    }, 0)

    // Display the total invested
    const totalSpentEl = document.createElement('div')
    totalSpentEl.innerHTML = `
        <p>$${totalSpent.toFixed(2)} Total</p>
        <p>Out of $${maxAmountToInvest} max amount</p>
    `
    outputCard.appendChild(totalSpentEl)

    console.log(`Total of $${totalSpent} spent out of $${maxAmountToInvest} max amount`)
    console.log('Updated holdings:')

    stocks.forEach(stock => {
        console.log(`$${stock.amount.toFixed(2)} ${stock.symbol} (${(stock.percent * 100).toFixed(1)}%)`)
    })

    console.log(`$${totalCombined.toFixed(2)} Total`)
}

export {generateAmountToBuyDOM, displayResults, displayUpdatedHoldings, displayCurrentHoldings}