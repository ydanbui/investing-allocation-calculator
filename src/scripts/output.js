// Generate amount to invest html elements for called stock
const generateAmountToBuyDOM = (stock) => {
    const investEl = document.createElement('div')

    if (stock.mutualFund) {
        investEl.innerHTML = `
            <p>$${stock.newShares.toFixed(2)} into ${stock.symbol}</p>
            <p>Current Price: $${stock.price.toFixed(2)} per share</p>
        `
    } else {
        investEl.innerHTML = `
            <p>$${(stock.newShares * stock.price).toFixed(2)} into ${stock.symbol}</p>
            <p>${stock.newShares} Shares at $${stock.price.toFixed(2)} per share</p>
        `
    }
    return investEl
}

// Generate updated holding html elements for called stock
const generateUpdatedStockAmountDOM = (stock) => {
    const holdingEl = document.createElement('div')

    holdingEl.innerHTML = `
        <span>${stock.symbol}</span>
        <span>$${stock.amount.toFixed(2)}(${(stock.percent * 100).toFixed(1)}%)</span>
    `
    return holdingEl
}

// Generate current holding html elements for called stock
const generateOriginalStockAmountDOM = (stock, originalTotal) => {
    const holdingEl = document.createElement('div')

    holdingEl.innerHTML = `
        <span>${stock.symbol}</span>
        <span>$${stock.originalAmount.toFixed(2)}(${(stock.originalAmount / originalTotal * 100).toFixed(1)}%)</span>
    `
    return holdingEl
}

// Display the updated holdings results view
const displayUpdatedHoldings = (stocks, totalCombined) => {
    // Array of data to be used to draw pie chart
    const chartData = [['Stock', 'Amount']]

    const outputCard = document.querySelector('.output__card')
    outputCard.innerHTML = `
        <p>Your updated holdings will be</p>
        <div id="chart_div"></div>
    `

    // Display updated holding of each stock
    stocks.forEach((stock) => {
        outputCard.appendChild(generateUpdatedStockAmountDOM(stock))
        
        // Store data of each stock for chart
        chartData.push([stock.symbol, stock.amount])
    })

    const totalCombinedEl = document.createElement('div')
    totalCombinedEl.innerHTML = `
        <span>Total</span><span>$${totalCombined.toFixed(2)}</span>
    `

    outputCard.appendChild(totalCombinedEl)
    // chartData.push([totalCombined])

    // Draw google chart
    google.charts.setOnLoadCallback(generateChart(chartData));

}

// Display the current holdings results view
const displayCurrentHoldings = (stocks, originalAmount) => {
    const outputCard = document.querySelector('.output__card')
    outputCard.innerHTML = `
        <p>Your current holdings are</p>
    `

    // Display original holding of each stock
    stocks.forEach((stock) => {
        outputCard.appendChild(generateOriginalStockAmountDOM(stock, originalAmount))
    })

    const totalOriginalAmountEl = document.createElement('div')
    totalOriginalAmountEl.innerHTML = `
        <span>Total</span><span>$${originalAmount.toFixed(2)}</span>
    `

    outputCard.appendChild(totalOriginalAmountEl)
}

// Display/update the output card when calculation runs
const displayResults = (maxAmountToInvest, stocks, totalCombined) => {
    // Stop hiding the output section
    document.querySelector('.output').classList.remove('hide')
    
    const outputCard = document.querySelector('.output__card')
    outputCard.innerHTML = `
        <p>You should invest</p>
    `
    
    // Display amount to invest in each stock
    stocks.forEach((stock) => {
        if (stock.mutualFund) {
            console.log(`Buy $${stock.newShares} of ${stock.symbol} (Current Price: $${stock.price})`)
        } else {
            console.log(`Buy ${stock.newShares} ${stock.symbol} shares at $${stock.price} per share ($${stock.newShares * stock.price} total)`)
        }
        outputCard.appendChild(generateAmountToBuyDOM(stock))
    })

    // Calculate the total invested in each stock
    const totalSpent = stocks.reduce((total, stock) => {
        if (stock.mutualFund) {
            return total + (stock.newShares)
        } else {
            return total + (stock.newShares * stock.price)
        }
    }, 0)

    // Display the total invested
    const totalSpentEl = document.createElement('div')
    totalSpentEl.innerHTML = `
        <p>$${totalSpent.toFixed(2)} Total</p>
        <p>Out of $${maxAmountToInvest} max amount</p>
    `
    outputCard.appendChild(totalSpentEl)

    console.log(`Total of $${totalSpent} spent out of $${maxAmountToInvest} max amount`)
    console.log('Updated holdings:')

    stocks.forEach(stock => {
        console.log(`$${stock.amount.toFixed(2)} ${stock.symbol} (${(stock.percent * 100).toFixed(1)}%)`)
    })

    console.log(`$${totalCombined.toFixed(2)} Total`)
}

// CHART STUFF

const generateChart = (chartData) => {
    const dataArray = [ ['Stock', 'Amount'],
        ['IVV', 11201.42],
        ['IXUS', 12232.30]]

    return function() {
        // const data = google.visualization.arrayToDataTable(chartData);
        const data = google.visualization.arrayToDataTable(dataArray);
    
        const options = {
        //   title: 'My Daily Activities',
          pieHole: 0.3,
          legend: 'none',
          colors: ['red', 'black', 'green'],
          fontName: 'Open Sans',
          chartArea:{left:0,top:0,width:'100%',height:'100%'},
          height:300,
          width: 400
    
        };
    
        const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
  }
// Chart TEsting
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(generateChart());

 // Set a callback to run when the Google Visualization API is loaded.
//  google.charts.setOnLoadCallback(drawChart);

 // Callback that creates and populates a data table,
 // instantiates the pie chart, passes in the data and
 // draws it.

export {generateAmountToBuyDOM, displayResults, displayUpdatedHoldings, displayCurrentHoldings}