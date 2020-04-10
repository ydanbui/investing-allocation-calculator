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

export { Stock as default }