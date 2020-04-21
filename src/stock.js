import getLatestPrice from './requests'

class Stock {
    constructor(symbol, allocation, amount) {
        this.symbol = symbol,
        this.price = null,
        this.allocation = allocation,
        this.amount = amount,
        this.percent = null,
        this.newShares = 0,
        this.mutualFund = true
    }
}

// Retrieve the price of each stock the user entered
const fetchStockPrices = async (stockInputArr) => {
    // Function is an array of Stocks without the price yet
    // debugger
    // // Fetch the current stock price for each stock
    for (let i = 0; i < stockInputArr.length; i++) {
        const stock = stockInputArr[i]
        stock.price = await getLatestPrice(stock.symbol)
    }
    
    // Return the updated stocks array
    return stockInputArr
}

// Initialize the stocks array with stocks from user input
const createStocksArray = (stocksInputGroups) => {
    const stockInputArr = []

    stocksInputGroups.forEach(stockInputGroup => {
        const symbol = stockInputGroup.querySelector('.stock-symbol').value
        const allocation = parseFloat(stockInputGroup.querySelector('.stock-allocation').value)
        const amount = parseFloat(stockInputGroup.querySelector('.stock-amount').value)

        stockInputArr.push(new Stock(symbol, allocation, amount))
    })
    return stockInputArr
}

export { Stock as default, fetchStockPrices, createStocksArray }