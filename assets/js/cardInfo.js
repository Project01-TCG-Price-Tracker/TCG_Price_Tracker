// vars for html elements to be replaced
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


// function to ajax a card's individual id
function getCardInfo() {
    // get id by making the card page's url end with the id
    var pageUri = document.documentURI;
    console.log(pageUri);
    var id = pageUri.substr(pageUri.indexOf("=")+ 1);
    console.log(id);
    
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
    // empty elements to be replaced
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
            console.log(prices[0]);
            var lowPrice = JSON.stringify(prices[0].low);
            var midPrice = JSON.stringify(prices[0].mid);
            var highPrice = JSON.stringify(prices[0].high);
            var marketPrice = JSON.stringify(prices[0].market);

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

getCardInfo();
