import "core-js/stable"
import "regenerator-runtime/runtime"
import getLatestPrice from './requests'
import Stock from './stock'

// Pseudocode

const createStockArray = async () => {
    // Create stocks array from user input
    const arr = [new Stock('IVV', .7, 7100), new Stock('IXUS', .3, 2900)]
        
    // // Retrieve current stock price
    for (let i = 0; i < arr.length; i++) {
        const stock = arr[i]
        stock.price = await getLatestPrice(stock.symbol)
    }
    // arr.forEach(async stock => {
    //     const stockPrice = await getLatestPrice(stock.symbol)
    //     stock.price = stockPrice
    // }) 
    
    return arr
}

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

const calculateInvestment = async (maxAmountToInvest) => {
    // Amount of money user wants to invest
    const origMaxAmountToInvest = maxAmountToInvest
    
    
    const stocks = await createStockArray()
    console.log(stocks)

    // Calculate Total value of all stocks in portfolio
    let totalCombined = stocks.reduce((total, stock) => {
        return total + stock.amount
    }, 0)

    stocks.forEach(stock => {
        stock.percent = stock.amount / totalCombined
    })

    const whileLoopFunctArr = createWhileLoopFunctions(stocks)

    // debugger

    // // Nested while loops that will keep rebalancing the new shares to purchase as closely match our desired allocation as possible
    // // Will stop when we run out of money to buy new shares
    do {
        // Generate a while loop for each stock
        whileLoopFunctArr.forEach((generateWhileLoop) => {
            const [a, b] = generateWhileLoop(maxAmountToInvest, totalCombined)
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

    console.log(`$${totalCombined.toFixed(1)} Total`)
}

// User submits input (Event listener block)

calculateInvestment(1500)