import moment from 'moment'

// Get the latest stock price from the Alpha Vantage API
const getLatestPrice = async (symbol) => {
    // IEX PRoduction
    const response = await fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_d5b2dda8ef5044f8b9b5f778fab53e24`)
    
    // IEX Sandbox
    // const response = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tpk_dbba3d0711794d788c87602cb0d21f80`)
    
    // Alphavantage production
    // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=AQPJW15UPBPWYDJ4`)
    
    // Alphavantage Demo
    // const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
    
    if (!response.ok) {
        throw Error('Unable to fetch price')
    }

    const data = await response.json()
    console.log(data.latestPrice)
    console.log(typeof data.latestPrice)


    return data.latestPrice

    // Alphaadvantage 
    // return parseFloat(data["Time Series (5min)"][getLastTime()]['4. close'])
    // return parseFloat(data["Time Series (5min)"]["2020-04-17 16:00:00"]['4. close'])

}

// Get the last stock price time to retrieve the price from the JSON response
const getLastTime = () => {
    // Get the current time in UTC
    const time = moment().utc()

    // Testing different times
    // const time = moment("2020-04-13 06:36", "YYYY-MM-DD HH:mm").utc() // local PST time 24 hrs

    // Get the current hour in UTC
    const currentHour = time.hour()

    // Get the current minute
    const currentMinute = time.minute()

    // Set the current minute rounded down to the nearest 5 or 10
    time.minute(currentMinute - (currentMinute%5))

    // If it's currently Sunday
    if (time.day() === 0) {
        // Set the time to be last Friday at market close
        time.day(-2)
        setTimeMarketClose(time)

    // If it's currently Saturday
    } else if (time.day() === 6) {
        // Set the time to be this Friday at market close
        time.day(5)
        setTimeMarketClose(time)

    // If it's a weekday
    } else {
        // If the current hour is after the market is closed (this is in UTC time) but still same day
        if (currentHour >= 20) {
            // Set the time to be the market close
            setTimeMarketClose(time)
        
        // If market is before hours 
        } else if (currentHour < 13 || (currentHour === 13 && currentMinute < 35)){
            // if it's monday, set day to be previous Fri
            if (time.day() === 1) {
                time.day(-2)

            // If it's other weekday set day to yesterday
            } else {
                time.subtract(1, 'days');
            }

            // Set the time to be market close
            setTimeMarketClose(time)
        }
    }

    // If none of conditions above met, market is open 

    // convert back to EST
    time.subtract(4, 'hours')

    console.log(time.format("YYYY-MM-DD HH:mm:00"))

    // Return the proper time format to extract data from API JSON
    return time.format("YYYY-MM-DD HH:mm:00")

}

// Set the time of the moment object to be 4pm EST (market close)
const setTimeMarketClose = moment => {
    moment.minute(0)
    moment.hour(20) // hours in UTC
}

export {getLatestPrice as default}