// Create array of functions that generate while loop for each stock
const createWhileLoopFunctions = (stocks) => {
    const functArr = stocks.map((stock) => {
        let generateWhileLoop

        if (!stock.mutualFund) {
            // Create the function for the current stock if it is a share stock
            generateWhileLoop = (maxAmountToInvest, totalCombined) => {
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
        } else {
            // Create the function for the current stock if it is a mutual fund
            generateWhileLoop = (maxAmountToInvest, totalCombined) => {
                // If the allocation of the current fund is less than desired and there is still money to invest
                if (stock.percent <= stock.allocation && maxAmountToInvest > 0) {
                    // Calculate amount of fund needed to buy to reach desired allocation
                    const amountNeeded = (totalCombined + maxAmountToInvest) * stock.allocation - stock.amount
                    
                    // If we have enough money to buy the amount needed
                    if (amountNeeded <= maxAmountToInvest) {
                        stock.amount += amountNeeded
                        stock.newShares += amountNeeded
                        totalCombined += amountNeeded
                        maxAmountToInvest -= amountNeeded
                    } else {
                        // If we don't have enough money to buy the amount needed
                        
                        // Buy the most we can with what we have left
                        stock.amount += maxAmountToInvest
                        stock.newShares += maxAmountToInvest
                        totalCombined += maxAmountToInvest
                        maxAmountToInvest = 0
                    }

                    // recalculate the percentages of each stock
                    stocks.forEach(stock => {
                        stock.percent = stock.amount / totalCombined
                    })
                }
                return [maxAmountToInvest, totalCombined]
            }
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
        // If starting amount of all stocks are 0, set the percent ot be 0
        // Have to manually set it otherwise 0 / 0 is NaN which breaks app
        stock.percent = totalCombined === 0 ? 0 : stock.amount / totalCombined
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

export {calculateInvestment as default}