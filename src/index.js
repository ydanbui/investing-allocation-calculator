import "core-js/stable"
import "regenerator-runtime/runtime"
import getLatestPrice from './requests'
import Stock from './stock'

// Create array of stocks from user input
// Function arguments multiple arrays containing stock information about each stock
const createStockArray = async (stockInputArr) => {
    // const stockInputArr = [new Stock('IVV', .5, 6000), new Stock('IXUS', .3, 2900), new Stock('IBM', .2, 1100)]
    // // Fetch the current stock price for each stock
    for (let i = 0; i < stockInputArr.length; i++) {
        const stock = stockInputArr[i]
        stock.price = await getLatestPrice(stock.symbol)
    }
    
    return stockInputArr
}

// Create array of functions that generate while loop for each stock
const createWhileLoopFunctions = (stocks) => {
    const functArr = stocks.map((stock) => {
        
        // Create the function for the current stock
        const generateWhileLoop = (maxAmountToInvest, totalCombined) => {
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
            return [maxAmountToInvest, totalCombined]
        }
        return generateWhileLoop
    }) 
    return functArr
}

// Main program that calculates investment to make based off investing amount entered
const calculateInvestment = (maxAmountToInvest, stocks) => {
    // Amount of money user wants to invest
    const origMaxAmountToInvest = maxAmountToInvest
    
    // const stocks = await createStockArray()
    // console.log(stocks)

    // Calculate Total value of all stocks in portfolio
    let totalCombined = stocks.reduce((total, stock) => {
        return total + stock.amount
    }, 0)

    // Calculate the starting percentage of each stock
    stocks.forEach(stock => {
        stock.percent = stock.amount / totalCombined
    })

    // Create array of functions that generate the while loop for each stock
    const whileLoopFunctArr = createWhileLoopFunctions(stocks)

    // // Nested while loops that will keep rebalancing the new shares to purchase as closely match our desired allocation as possible
    // // Will stop when we run out of money to buy new shares
    do {
        // Generate a while loop for each stock
        whileLoopFunctArr.forEach((generateWhileLoop) => {
            const [a, b] = generateWhileLoop(maxAmountToInvest, totalCombined)
            // Update global variables after each itearation
            maxAmountToInvest = a
            totalCombined = b
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
        console.log(`$${stock.amount.toFixed(2)} ${stock.symbol} (${(stock.percent * 100).toFixed(1)}%)`)
    })

    console.log(`$${totalCombined.toFixed(2)} Total`)
}

const runProgram = async (maxAmountToInvest, stockInputValues) => {
    const stocks = await createStockArray(stockInputValues)
    calculateInvestment(maxAmountToInvest, stocks)
}

// =============================
const form = document.querySelector('#form')

// User submits input (Event listener block)
form.addEventListener('submit', e => {
    e.preventDefault()
    console.log('form submitted')

    const maxAmountToInvest = parseFloat(document.querySelector('#maxAmountToInvestDOM').value)

    const stocksInputGroups = document.querySelectorAll('.stock-input-group')

    const stockInputArr = []

    // const arr = [new Stock('IVV', .5, 6000), new Stock('IXUS', .3, 2900), new Stock('IBM', .2, 1100)]

    stocksInputGroups.forEach(stockInputGroup => {
        const symbol = stockInputGroup.querySelector('.stock-symbol').value
        const allocation = parseFloat(stockInputGroup.querySelector('.stock-allocation').value)
        const amount = parseFloat(stockInputGroup.querySelector('.stock-amount').value)

        stockInputArr.push(new Stock(symbol, allocation, amount))
    })

    runProgram(maxAmountToInvest, stockInputArr)
    // calculateInvestment(1000)
})
