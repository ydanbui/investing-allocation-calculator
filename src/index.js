import "core-js/stable"
import "regenerator-runtime/runtime"
import getLatestPrice from './requests'
 
getLatestPrice('IVV').then(price => {
    // console.log(price)
}).catch(err => {
    console.log(`Error: ${err}`)
})

// BRAINSTORMING CODE

// Amount of money the user wants to invest
// Collected from user input

// Stocks to invest in and desired allocation, collected from user
const stocks = [{
    symbol: 'IVV',
    price: 265,
    allocation: .7,
    currentAmount: 7100
}, {
    symbol: 'IXUS',
    price: 47,
    allocation: .3,
    currentAmount: 2900
}]

const origMaxAmountToInvest = 1500
let maxAmountToInvest = 1500

// ============== CALCULATIONS ====================
const priceIVV = stocks[0].price
const priceIXUS = stocks[1].price

const allocationIVV = stocks[0].allocation
const allocationIXUS = stocks[1].allocation

let totalIVV = stocks[0].currentAmount
let totalIXUS = stocks[1].currentAmount
let totalAll = totalIVV + totalIXUS

let percentIVV = totalIVV / totalAll
let percentIXUS = totalIXUS / totalAll

let newSharesIVV = 0
let newSharesIXUS = 0


// Nested while loops that will keep rebalancing the new shares to purchase as closely match our desired allocation as possible
// Will stop when we run out of money to buy new shares
do {
    // While the allocation of IVV is less than desired and there is still money to invest
    while (percentIVV <= allocationIVV && maxAmountToInvest > 0) {
        maxAmountToInvest -= priceIVV

        // Don't add a share if this goes over our investable amount
        if (maxAmountToInvest < 0) {
            break
        }
        // Add a share and recalculate the percentages
        newSharesIVV++
        totalIVV += priceIVV
        totalAll += priceIVV
        percentIVV = totalIVV / totalAll
        percentIXUS = totalIXUS / totalAll
    }

    // While the allocation of IXUS is less than desired and there is still money to invest
    while (percentIXUS <= allocationIXUS && maxAmountToInvest > 0) {
        maxAmountToInvest -= priceIXUS

        // Don't add a share if this goes over our investable amount
        if (maxAmountToInvest < 0) {
            break
        }

        // Add a share and recalculate the percentage
        newSharesIXUS++
        totalIXUS += priceIXUS
        totalAll += priceIXUS
        percentIXUS = totalIXUS / totalAll
        percentIVV = totalIVV / totalAll
    }

    // If we don't have money left to spend, stop
} while (maxAmountToInvest > 0)

// console.log(`Buy ${newSharesIVV} IVV shares at $${priceIVV} ($${newSharesIVV * priceIVV} total)`)
// console.log(`Buy ${newSharesIXUS} IXUS shares at $${priceIXUS} ($${newSharesIXUS * priceIXUS} total)`)
// console.log(`Total of $${(newSharesIVV * priceIVV) + newSharesIXUS * priceIXUS} out of $${origMaxAmountToInvest} max amount`)
// console.log(`Updated percentages: ${(percentIVV * 100).toFixed(1)}% IVV : ${(percentIXUS * 100).toFixed(1)}% IXUS`)