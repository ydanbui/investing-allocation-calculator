import moment from 'moment'

// Get the latest stock price from the Alpha Vantage API
const getLatestPrice = async (symbol) => {
    // Real call below
    // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=AQPJW15UPBPWYDJ4`)

    // DEMO API CALL
    const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
    
    if (!response.ok) {
        throw Error('Unable to fetch price')
    }

    const data = await response.json()

    return data["Time Series (5min)"][getLastTime()]['4. close']
}

// Get the last stock price time to retrieve the price from the JSON response
const getLastTime = () => {
    // Get the current time in UTC
    const time = moment().utc()

    // Get the current hour in UTC
    const currentHour = time.hour()

    // Get the current minute
    const currentMinute = time.minute()

    // Set the current minute rounded down to the nearest 5 or 10
    time.minute(currentMinute - (currentMinute%5))

    // If the current hour is after the market is closed (this is in UTC time) but still same day
    if (currentHour >= 20) {
        // Set the time to be the market close
        time.minute(0)
        time.hour(20)
    } else if (currentHour < 13 || (currentHour === 13 && currentMinute < 35)){
        // If market is before hours

        // Set the time to be the preivous day market close
        time.subtract(1, 'days');
        time.minute(0)
        time.hour(20)
    }
    // Else market is open 
    
    // convert back to EST
    time.subtract(4, 'hours')

    return time.format("YYYY-MM-DD HH:mm:00")

}

export {getLatestPrice as default}