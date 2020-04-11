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

// Calculate investment to make based off max investment amount and stock informaiton user entered
const calculateInvestment = (maxAmountToInvest, stocks) => {
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

    return totalCombined
}

const printSummary = (maxAmountToInvest, stocks, totalCombined) => {
    // =================== SUMMARY ===================
    stocks.forEach((stock) => {
        console.log(`Buy ${stock.newShares} ${stock.symbol} shares at $${stock.price} per share ($${stock.newShares * stock.price} total)`)
    })

    const totalSpent = stocks.reduce((total, stock) => {
        return total + (stock.newShares * stock.price)
    }, 0)

    console.log(`Total of $${totalSpent} spent out of $${maxAmountToInvest} max amount`)
    console.log('Updated holdings:')

    stocks.forEach(stock => {
        console.log(`$${stock.amount.toFixed(2)} ${stock.symbol} (${(stock.percent * 100).toFixed(1)}%)`)
    })

    console.log(`$${totalCombined.toFixed(2)} Total`)
}

export {calculateInvestment as default, printSummary}