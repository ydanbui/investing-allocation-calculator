import "core-js/stable"
import "regenerator-runtime/runtime"
import getLatestPrice from './requests'
 
getLatestPrice('IVV').then(price => {
    // console.log(price)
}).catch(err => {
    console.log(`Error: ${err}`)
})

const stocks = [{
    symbol: 'IVV',
    price: 265,
    allocation: .7,
    currentAmount: 7100,
    newAmount: 7100,
    percent: null,
    newShares: 0
}, {
    symbol: 'IXUS',
    price: 47,
    allocation: .3,
    currentAmount: 2900,
    newAmount: 2900,
    percent: null,
    newShares: 0
}]

let maxAmountToInvest = 1500

// Store the total value of all stocks in portfolio
let totalCombined = stocks.reduce((total, stock) => {
    return total + stock.currentAmount
}, 0)

// Calculate the stock percentages
stocks.forEach(stock => {
    stock.percent = stock.newAmount / totalCombined
})

// Generate while loop for each stock
const whileLoopFunction = stocks.map((stock) => {
    const runWhileLoop = () => {
        while (stock.percent <= stock.allocation && maxAmountToInvest > 0) {
            maxAmountToInvest -= stock.price

            if (maxAmountToInvest < 0) {
                break
            }

            stock.newShares++
            stock.newAmount += stock.price
            totalCombined += stock.price
            
            stocks.forEach(stock => {
                stock.percent = stock.newAmount / totalCombined
            })
        }
    }

    return runWhileLoop
}) 

do {
    whileLoopFunction.forEach((whileBlock) => {
        whileBlock()
    })
} while (maxAmountToInvest > 0)

stocks.forEach((stock) => {
    console.log(`Buy ${stock.newShares} ${stock.symbol} shares at $${stock.price} ($${stock.newShares * stock.price} total)`)
})