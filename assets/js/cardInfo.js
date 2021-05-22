// vars for html elements to be replaced
var pageTitle = $("#indivPageTitle")
var cardNameEl = $("#cardname");
var setEl = $("#set");
var cardArtDiv = $(".cardart");
var supertypeSubtypeEl = $("#supertypeSubtypes");
var relDateEl = $("#releasedate");
var setNumberEl = $("#setnumber");
var artistEl = $("#artist");
var lowPriceEl = $("#lowprice");
var midPriceEl = $("#midprice");
var highPriceEl = $("#highprice");
var marketPriceEl = $("#marketprice");
var tcgPlayerLinkEl = $("#tcgplayerlink");
var currencySelector = $("#currency");

var cryptoSymbol;
var cryptoConversion;

// function to ajax a card's individual id
function getCardInfo() {
    // get id by making the card page's url end with the id
    var pageUri = document.documentURI;
    var id = pageUri.substr(pageUri.indexOf("=")+ 1);
    
    var cardUrl = `https://api.pokemontcg.io/v2/cards/${id}`;
    
    $.ajax({
        url: cardUrl,
        method: 'GET',
        headers: {'X-Api-Key': 'c86ef810-3077-4361-80a8-0124aa67fc83'},
    }).then(function(response) {
        cardInfo = response.data;
        console.log(cardInfo);
        appendCardInfo();
    })
    
}

// function to append card info to page
function appendCardInfo() {
    var chosenCurrency = currencySelector.val();
    // empty elements to be replaced
    pageTitle.empty();
    cardNameEl.empty();
    setEl.empty();
    cardArtDiv.empty();
    supertypeSubtypeEl.empty();
    relDateEl.empty();
    setNumberEl.empty();
    artistEl.empty();
    lowPriceEl.empty();
    midPriceEl.empty();
    highPriceEl.empty();
    marketPriceEl.empty();
    tcgPlayerLinkEl.empty();

    // change text of elements to match id of url
    pageTitle.text(`${cardInfo.name} - ${cardInfo.set.name}`);

    cardNameEl.text(cardInfo.name);

    setEl.text(cardInfo.set.name);

    var cardArt = $("<img>").attr({src: cardInfo.images.large, width: 400}).addClass('materialboxed responsive-img');
    cardArtDiv.append(cardArt);
    $(".materialboxed").materialbox();
    
    for (i = 0; i < cardInfo.subtypes.length; i++) {
        if (cardInfo.subtypes.length == 1) {
            supertypeSubtypeEl.text(`${cardInfo.supertype} - ${cardInfo.subtypes[i]}`).addClass("flow-text");
        } 
        if (cardInfo.subtypes.length == 2) {
            supertypeSubtypeEl.text(`${cardInfo.supertype} - ${cardInfo.subtypes[i]}, ${cardInfo.subtypes[i-1]}`).addClass("flow-text");
        }
        if (cardInfo.subtypes.length == 3) {
            supertypeSubtypeEl.text(`${cardInfo.supertype} - ${cardInfo.subtypes[i]}, ${cardInfo.subtypes[i-1]}, ${cardInfo.subtypes[i-2]}`).addClass("flow-text");
        }
        if (cardInfo.subtypes.length == 4) {
            supertypeSubtypeEl.text(`${cardInfo.supertype} - ${cardInfo.subtypes[i]}, ${cardInfo.subtypes[i-1]}, ${cardInfo.subtypes[i-2]}, ${cardInfo.subtypes[i-3]}`).addClass("flow-text");
        }
    }

    relDateEl.text(cardInfo.set.releaseDate);

    setNumberEl.text(`${cardInfo.number}/${cardInfo.set.printedTotal}`);

    artistEl.text(cardInfo.artist);

    if (cardInfo.tcgplayer.prices != undefined) {
        var prePrices = cardInfo.tcgplayer.prices;
        var prices = $.map(prePrices, function(value, index) {
            return [value];
        })
        if (prices[0] != undefined) {
            var lowPrice = JSON.stringify(prices[0].low);
            var midPrice = JSON.stringify(prices[0].mid);
            var highPrice = JSON.stringify(prices[0].high);
            var marketPrice = JSON.stringify(prices[0].market);
            if (chosenCurrency != "USD") {
                var usdLowPrice = prices[0].low;
                var usdMidPrice = prices[0].mid;
                var usdHighPrice = prices[0].high;
                var usdMarketPrice = prices[0].market;
                
                var cryptoLowPrice = cryptoConversion*usdLowPrice;
                var cryptoMidPrice = cryptoConversion*usdMidPrice;
                var cryptoHighPrice = cryptoConversion*usdHighPrice;
                var cryptoMarketPrice = cryptoConversion*usdMarketPrice;
                
                var lowPriceStringLong = `${cryptoLowPrice}`;
                var midPriceStringLong = `${cryptoMidPrice}`;
                var highPriceStringLong = `${cryptoHighPrice}`;
                var marketPriceStringLong = `${cryptoMarketPrice}`;

                var lowPriceString = lowPriceStringLong.substr(0, 7);
                var midPriceString = midPriceStringLong.substr(0, 7);
                var highPriceString = highPriceStringLong.substr(0, 7);
                var marketPriceString = marketPriceStringLong.substr(0, 7);

                lowPriceEl.text(`${lowPriceString} ${cryptoSymbol}`);
                midPriceEl.text(`${midPriceString} ${cryptoSymbol}`);
                highPriceEl.text(`${highPriceString} ${cryptoSymbol}`);
                marketPriceEl.text(`${marketPriceString} ${cryptoSymbol}`);
            } else {
            if(lowPrice.includes('.')) {
                var periodIndex = lowPrice.indexOf('.')
                var cents = lowPrice.substr(periodIndex)
                if(cents.length == 2) {
                    lowPrice = lowPrice + "0"
                }
            } else {
                lowPrice = lowPrice + ".00"
            }
            if(midPrice.includes('.')) {
                var periodIndex = midPrice.indexOf('.')
                var cents = midPrice.substr(periodIndex)
                if(cents.length == 2) {
                    midPrice = midPrice + "0"
                }
            } else {
                midPrice = midPrice + ".00"
            }
            if(highPrice.includes('.')) {
                var periodIndex = highPrice.indexOf('.')
                var cents = highPrice.substr(periodIndex)
                if(cents.length == 2) {
                    highPrice = highPrice + "0"
                }
            } else {
                highPrice = highPrice + ".00"
            }
            if(marketPrice.includes('.')) {
                var periodIndex = marketPrice.indexOf('.')
                var cents = marketPrice.substr(periodIndex)
                if(cents.length == 2) {
                    marketPrice = marketPrice + "0"
                }
            } else {
                marketPrice = marketPrice + ".00"
            }
            lowPriceEl.text(`$${lowPrice}`);
            midPriceEl.text(`$${midPrice}`);
            highPriceEl.text(`$${highPrice}`);
            marketPriceEl.text(`$${marketPrice}`);
            }
        } else {
            lowPriceEl.text("No Price");
            midPriceEl.text("No Price");
            highPriceEl.text("No Price");
            marketPriceEl.text("No Price");
        }
    } else {
        lowPriceEl.text("No Price");
        midPriceEl.text("No Price");
        highPriceEl.text("No Price");
        marketPriceEl.text("No Price");
    }

    var tcgPlayerLink = $("<a>").attr({href: cardInfo.tcgplayer.url, "target": "_blank"}).text("Prices sourced from TCGPlayer");
    tcgPlayerLinkEl.append(tcgPlayerLink);
}

// function to ajax crypto prices
function getCryptoPrice(crypto) {
    var settings = {
        "url": `https://api.coincap.io/v2/assets/${crypto}`,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        var usdPrice = response.data.priceUsd
        cryptoSymbol = response.data.symbol
        cryptoConversion = 1 / usdPrice;
        appendCardInfo();
    });
}

// function to check page's crypto selection
function checkCrypto() {
    if (chosenCurrency != currencySelector.val()) {
        var chosenCurrency = currencySelector.val();
        if (chosenCurrency != "USD") {
            getCryptoPrice(chosenCurrency);
        } else {
            appendCardInfo();
        }
    }
}

getCardInfo();

currencySelector.on('change', function() {
    checkCrypto();
})
