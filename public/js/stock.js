;(function() {
  'use strict';

  var Stock = (function() {
    var refreshRate = 5000; // Refresh rate (in ms).
    var url = 'https://api.fixer.io/latest?base=';
    var initialized = false;
    var watchList, refresh;

    function getQuotes(stock,stockTo) {
      if (!stock) {
        return;
      }
      $.ajax({
        'type': 'GET',
        'url': url + stock,
        'dataType': 'jsonp',
        'success': function(data) {
            var ticker1;


            $('#watchList').empty()
            // Set up initial ticker item.

            ticker1 = document.createElement('li');
            ticker1.classList.add('ticker');
            ticker1.textContent = `1 ${stock} = ${data.rates[stockTo]} ${stockTo}`;

            watchList.appendChild(ticker1);
            watchList.appendChild(ticker2);


        }
      })
      .done(function() {

        refresh = setTimeout(getQuotes, refreshRate);
      });
    }
    return {
      'init': function(stock,stockTo) {
        watchList = document.getElementById('watchList');
        getQuotes(stock,stockTo);
      }
    };
  }());

  window.Stock = Stock;
}());
