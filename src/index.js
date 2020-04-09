import "core-js/stable"
import "regenerator-runtime/runtime"
import getLatestPrice from './requests'
 
getLatestPrice('IVV').then(price => {
    // console.log(price)
}).catch(err => {
    console.log(`Error: ${err}`)
})

const stocks = [{
    symbol: 'IVV', // user input
    price: 265, // from API
    allocation: .7, // user input
    amount: 7100, // user input
    percent: null,
    newShares: 0
}, {
    symbol: 'IXUS',
    price: 47,
    allocation: .3,
    amount: 2900,
    percent: null,
    newShares: 0
}]

// Stocks to invest in and desired allocation
// const stocks = [{
//     symbol: 'IVV', // user input
//     price: 265, // from API
//     allocation: .5, // user input
//     amount: 6000, // user input
//     percent: null,
//     newShares: 0
// }, {
//     symbol: 'IXUS',
//     price: 47,
//     allocation: .3,
//     amount: 2900,
//     percent: null,
//     newShares: 0
// }, {
//     symbol: 'IBM',
//     price: 19,
//     allocation: .2,
//     amount: 1100,
//     percent: null,
//     newShares: 0
// }]

// Amount of money user wants to invest
let maxAmountToInvest = 1500
const origMaxAmountToInvest = maxAmountToInvest

// Total value of all stocks in portfolio
let totalCombined = stocks.reduce((total, stock) => {
    return total + stock.amount
}, 0)

// Calculate the starting percentage of each stock
stocks.forEach(stock => {
    stock.percent = stock.amount / totalCombined
})

// Array of functions that generate the while loop for each stock
const whileLoopFunction = stocks.map((stock) => {

    // Create the function for the current stock
    const runWhileLoop = () => {
        // While the allocation of the current stock is less than desired and there is still money to invest
        while (stock.percent <= stock.allocation && maxAmountToInvest > 0) {
            maxAmountToInvest -= stock.price

            // Don't add a share if this goes over our investable amount
            if (maxAmountToInvest < 0) {
                break
            }

            // Add a share
            stock.newShares++
            stock.amount += stock.price
            totalCombined += stock.price
            
            // recalculate the percentages of each stock
            stocks.forEach(stock => {
                stock.percent = stock.amount / totalCombined
            })
        }
    }

    return runWhileLoop
}) 

// Nested while loops that will keep rebalancing the new shares to purchase as closely match our desired allocation as possible
// Will stop when we run out of money to buy new shares
do {
    // Generate a while loop for each stock
    whileLoopFunction.forEach((whileBlock) => {
        whileBlock()
    })
    // Once we run out of money left to spend, stop
} while (maxAmountToInvest > 0)


// =================== SUMMARY ===================


stocks.forEach((stock) => {
    console.log(`Buy ${stock.newShares} ${stock.symbol} shares at $${stock.price} per share ($${stock.newShares * stock.price} total)`)
})

const totalSpent = stocks.reduce((total, stock) => {
    return total + (stock.newShares * stock.price)
}, 0)

console.log(`Total of $${totalSpent} spent out of $${origMaxAmountToInvest} max amount`)
console.log('Updated holdings:')

stocks.forEach(stock => {
    console.log(`$${stock.amount} ${stock.symbol} (${(stock.percent * 100).toFixed(1)}%)`)
})

console.log(`$${totalCombined} Total`)
