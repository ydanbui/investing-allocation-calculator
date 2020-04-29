const generateChart = (chartData) => {
    // const dataArray = [ ['Stock', 'Amount'],
    //     ['IVV', 11201.42],
    //     ['IXUS', 12232.30]]

    return function() {
        const data = google.visualization.arrayToDataTable(chartData);
        // const data = google.visualization.arrayToDataTable(dataArray);
    
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

  export {generateChart as default}