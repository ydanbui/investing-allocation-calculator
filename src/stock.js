import getLatestPrice from './requests'

class Stock {
    constructor(symbol, allocation, amount) {
        this.symbol = symbol,
        this.price = null,
        this.allocation = allocation,
        this.amount = amount,
        this.percent = null,
        this.newShares = 0
    }
}

// Retrieve the price of each stock the user entered
const fetchStockPrices = async (stockInputArr) => {
    // Function is an array of Stocks without the price yet

    // // Fetch the current stock price for each stock
    for (let i = 0; i < stockInputArr.length; i++) {
        const stock = stockInputArr[i]
        stock.price = await getLatestPrice(stock.symbol)
    }
    
    // Return the updated stocks array
    return stockInputArr
}

export { Stock as default, fetchStockPrices }