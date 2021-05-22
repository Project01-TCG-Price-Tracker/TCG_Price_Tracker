
// global variables for page elements

var resultsDiv = $('.searchResults');
var searchButton = $('.searchButton');
var searchInput = $('.searchInput');
var rarityCheck = $('#rarityCheck');
var supertypeCheck = $('#supertypeCheck');
var subtypeCheck = $("#subtypeCheck");
var typesCheck = $("#typeCheck");
var rarityDropdown = $('.rarityDropdown');
var supertypeDropdown = $('.supertypeDropdown');
var subtypeDropdown = $(".subtypeDropdown")
var typesDropdown = $(".typeDropdown");
var viewFavoritesButton = $('.viewFavorites');
var resultsDivHeader = $(".resultsDivText");
var currencySelector = $("#currency");
var sideBarImage = $("#sideBarImage")


// global variables for timer/price mode

var cryptoConversion;
var cryptoSymbol;
var currency;

// global variable for searched text/checked criteria/page

var finalSearchUrl = '';
var pageIndex = 0;
var paginationIndex = 0;
var totalResults;
var rarityChosen = rarityCheck[0].checked;
var supertypeChosen = supertypeCheck[0].checked;
var subtypeChosen = supertypeCheck[0].checked;
var typeChosen = typesCheck[0].checked;
var cardData;
var favoritesShown = false;
var favoritesList = [];
var onIntro = true;





// function to check criteria and create API URL

function createUrl(name) {
    var baseUrl = `https://api.pokemontcg.io/v2/cards?q=name:${name}`
    // if ((rarityDropdown.val() == null && rarityChosen == true) || 
    //     (supertypeDropdown.val() == null && supertypeChosen == true) ||
    //     (typesDropdown.val() == null && typeChosen == true)) {
    //         finalSearchUrl = baseUrl;
    // } 
    if (rarityChosen == true) {
        var rarityChoice = JSON.stringify(rarityDropdown.val());
        if (rarityChoice != "null") {
            baseUrl = `${baseUrl} rarity:${rarityChoice}`
        }
    }
    if (supertypeChosen == true) {
        var supertypeChoice = JSON.stringify(supertypeDropdown.val());
        if (supertypeChoice != "null") {
            baseUrl = `${baseUrl} supertype:${supertypeChoice}`;
        }
    }
    if (subtypeChosen == true) {
        var subtypeChoice = JSON.stringify(subtypeDropdown.val());
        if (subtypeChoice != null) {
            baseUrl = `${baseUrl} subtypes:${subtypeChoice}`;
        }
    }
    if (typeChosen == true) {
        var typeChoice = JSON.stringify(typesDropdown.val());
        if (typeChoice != "null") {
            baseUrl = `${baseUrl} types:${typeChoice}`;
        }
    }
    finalSearchUrl = baseUrl;
}

// function to create pagination buttons

function createPagination() {
    if(cardData.length != 0) {
        var paginationEl = $('<ul>').addClass('pagination col s12 push-l1')
        var pageAmount = (totalResults - ((paginationIndex * 12) * 8))/12
        var leftArrowItem = $('<li>').addClass('waves-effect prevButton')
        var leftIcon = $('<i>').addClass('material-icons').text('chevron_left')
        leftArrowItem.append(leftIcon)
        paginationEl.append(leftArrowItem)
        for(i = 0;i < pageAmount && i < 8; i++) {
            var pageButton = $('<li>').addClass('waves-effect pageButton').data('index', i + (paginationIndex*8))
            if(pageIndex === i + (paginationIndex*8)) {
                pageButton.addClass('active purple darken-4')
            }
            var pageLink = $('<a>').text(i + 1 + (paginationIndex*8))
            pageButton.append(pageLink)
            paginationEl.append(pageButton);
        }
        var rightArrowItem = $('<li>').addClass('waves-effect nextButton')
        var rightIcon = $('<i>').addClass('material-icons').text('chevron_right')
        rightArrowItem.append(rightIcon)
        paginationEl.append(rightArrowItem)
        resultsDiv.append(paginationEl);
        $('.pageButton').on('click', function() {
            pageIndex = $(this).data('index')
            searchCards();
        })
        $('.nextButton').on('click', function() {
            var totalPageButtons = $('.pageButton')
            if((pageIndex + 1)%8 === 0) {
                paginationIndex ++;
                pageIndex ++;
            }
            else if((pageIndex + 1) - (paginationIndex*8) < totalPageButtons.length) {
                pageIndex ++;
            }
            searchCards();
        })
        $('.prevButton').on('click', function() {
            if((pageIndex)%8 === 0 && pageIndex != 0) {
                paginationIndex --;
                pageIndex --;
            }
            else if(pageIndex > 0) {
                pageIndex --;
            }
            if(pageIndex === 0) {
                $('.prevButton').addClass('disabled')
            }
            if((pageIndex + 1) === cardData.length/8) {
                $('.nextButton').addClass('disabled')
            }
            searchCards();
        })
    }
}

// function to pull card data when search button is clicked

function pullCardData(){
    var name = searchInput.val();
    name = `"${name}*"`
    createUrl(name);
    $.ajax({
        url: finalSearchUrl,
        method: 'GET',
        headers: {'X-Api-Key': 'c86ef810-3077-4361-80a8-0124aa67fc83'},
    }).then(function(response) {
        cardData = response.data
        totalResults = cardData.length
        searchCards();
    })
}

// function to save favorites list locally as objects

function loadFavorites() {
    var favoritesListPre = localStorage.getItem('favorites')
    if(favoritesListPre != undefined) {
        cardDataPre = JSON.parse(favoritesListPre)
        favoritesList = [];
        for(i = 0;i < cardDataPre.length;i++) {
            var cardObject = JSON.parse(cardDataPre[i])
            favoritesList.push(cardObject);
        }
    }
}


// function to check current crypto selected

function checkCrypto() {
    if(chosenCurrency != currencySelector.val()) {
        var chosenCurrency = currencySelector.val()
        if(chosenCurrency != "USD") {
            getCryptoPrice(chosenCurrency);
        }
        else if(onIntro == false) {
            if(favoritesShown) {
                populateFavorites()
            }
            else {
                searchCards()
            }
        }
    }
}

// function to get bitcoin price

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
        if(onIntro == false) {
            if(favoritesShown) {
                populateFavorites()
            }
            else {
                searchCards()
            }
    }
      });
}


// function to populate with favorites

function populateFavorites() {
    loadFavorites();
    totalResults = favoritesList.length;
    cardData = favoritesList;
    searchCards();
    }

// function to populate cards in the searchResults div

function searchCards() {
    var chosenCurrency = currencySelector.val()
    loadFavorites();
    resultsDiv.empty()
    if(favoritesShown) {
        resultsDivHeader.text('Favorites List')
        sideBarImage.attr('src', "https://media0.giphy.com/media/bXguSfnEakGFG/giphy.gif")
    }
    else {
        resultsDivHeader.text('Search Results')
        sideBarImage.attr('src', "http://getintopik.com/wp-content/uploads/2020/12/Free-Mewtwo-Pokemon-PNG-Image-Background-1024x1024.png")
    }
    createPagination();
    var pageModifier = pageIndex*12;
    var cardsRow = $('<div>').addClass('row center')
    for (i = pageModifier; i < (pageModifier+12); i++) {
        if(cardData[i] != undefined) {
            var divider = $('<div>').addClass('col s12 hide-on-small-and-down')
            var cardContainer = $("<div>").addClass('cardContainer col s12 m3 l3 push-l1')
            var imageContainer = $('<div>')
            var textContainer = $('<div>').addClass("textContainer halign-wrapper center")
            var favButton = $('<a>').addClass('btn-floating favbutton waves-effect waves-yellow grey').attr('style', "top: -30px").data('card', cardData[i].id)
            for(l = 0;l < favoritesList.length; l++) {
                if(favoritesList[l].id === cardData[i].id) {
                    favButton.removeClass('waves-yellow grey')
                    favButton.addClass('yellow accent-4')
                }
            }
            if(favoritesList.length == 0) {
                favButton.addClass('grey')
            }
            var favIcon = $('<i>').addClass('material-icons').text("star")
            var name = cardData[i].name
            var set = cardData[i].set.name
            var nameEl = $('<span>').addClass('cardName').text(name)
            var setEl = $('<p>').addClass('cardSet').text(set)
            var priceEl = $('<p>').addClass('cardPrice')
            var imageEl = $("<img>").attr({src: cardData[i].images.large, width: 250}).addClass('responsive-img')
            var id = cardData[i].id
            var imageLink = $("<a>").attr({"href": `./cardpage.html?id=${id}`, "target": "_blank"}).append(imageEl)
            if (cardData[i].tcgplayer != undefined) {
                var prePrices = cardData[i].tcgplayer.prices
                var prices = $.map(prePrices, function (value, index) {
                    return [value]
                })
                if(prices[0] != undefined) {
                    var finalPrice = JSON.stringify(prices[0].mid);
                    if(chosenCurrency != "USD") {
                        var usdPrice = prices[0].mid
                        var cryptoPrice = usdPrice * cryptoConversion
                        var priceStringLong = `${cryptoPrice}`
                        var priceString = priceStringLong.substr(0, 7)
                        priceEl.text(`${priceString} ${cryptoSymbol}`)

                    }
                    else {
                        if(finalPrice.includes('.')) {
                            var periodIndex = finalPrice.indexOf('.')
                            var cents = finalPrice.substr(periodIndex)
                            if(cents.length == 2) {
                                finalPrice = finalPrice + "0"
                            }
                        } else {
                            finalPrice = finalPrice + ".00"
                        }
                        priceEl.text(`$${finalPrice}`)
                    }
                } else {
                    priceEl.text("No Price")
                }

            } else {

                priceEl.text("No Price")
            }
            favButton.append(favIcon)
            imageContainer.append(imageLink)
            imageContainer.append(favButton)
            cardContainer.append(imageContainer)
            textContainer.append(nameEl)
            textContainer.append(setEl)
            textContainer.append(priceEl)
            cardContainer.append(textContainer)
            cardsRow.append(cardContainer)
            if(i - (pageIndex*12) === 3 || i - (pageIndex*12) === 7) {
                cardsRow.append(divider)
            } 
            if(i === 249) {
                if(favoritesShown != true) {
                    var maxWarning = $('<h4>').text('Max results reached - Narrow your search criteria to see more!').addClass('col s12 center push-l1')
                    cardsRow.append(maxWarning)
                }
            }
        }
    }
    resultsDiv.append(cardsRow);
    if(cardData.length === 0) {
        if(favoritesShown) {
            var noResults = $("<h4>").text("No Favorites Added!").addClass("col s12 center push-l1")
            resultsDiv.append(noResults);
        }
        else {
            var noResults = $("<h4>").text("No Results Found!").addClass("col s12 center push-l1")
            resultsDiv.append(noResults);
        }
    }
    $('.favbutton').on('click', function() {
        var id = $(this).data('card')
        var savedFavorites = JSON.parse(localStorage.getItem('favorites'))
        if(savedFavorites == null) {
            localStorage.setItem('favorites', [])
            savedFavorites = []
        }
        var favUrl = `https://api.pokemontcg.io/v2/cards/${id}`
        $.ajax({
            url:favUrl,
            method: "GET",
            headers: {'X-Api-Key': 'c86ef810-3077-4361-80a8-0124aa67fc83'},
        }).then(function(response) {
            var data = JSON.stringify(response.data)
            var checkArray = savedFavorites.indexOf(data)
            if(checkArray === -1) {
                savedFavorites.push(data)
                localStorage.setItem('favorites', JSON.stringify(savedFavorites))
                console.log(savedFavorites)
            } else {
                savedFavorites.splice(checkArray, 1)
                localStorage.setItem('favorites', JSON.stringify(savedFavorites))
                console.log(savedFavorites)

            }
            if(favoritesShown) {
                populateFavorites();
            }
            else {
                searchCards();
            }

        })

    })
    $('.materialboxed').materialbox();
}
// function to run when webpage is loaded

function init() {

    
    // Apply click event to search button
    searchButton.on('click', function() {
        if(onIntro == true) {
            onIntro = false;
        }
        pageIndex = 0
        paginationIndex = 0;
        favoritesShown = false;
        pullCardData();
        
    })  
    // keypress listener to run search on enter key pressed
    $(document).keypress(function(event) {
        if (event.which == 13) {
            if(onIntro == true) {
                onIntro = false;
            }
            event.preventDefault();
            favoritesShown = false;
            pageIndex = 0;
            paginationIndex = 0;
            pullCardData();
        }
    })
    // listener to add functionality to checks 

rarityCheck.on("click", function() {
    if (rarityChosen == false) {
        rarityChosen = true;
        rarityDropdown.prop('disabled', false)
    } else {
        rarityChosen = false;
        rarityDropdown.prop('disabled', true)
    }
});
supertypeCheck.on("click", function() {
    if (supertypeChosen == false) {
        supertypeChosen = true;
        supertypeDropdown.prop('disabled', false)
    } else {
        supertypeChosen = false;
        supertypeDropdown.prop('disabled', true)
    }
});
subtypeCheck.on("click", function() {
    if (subtypeChosen == false) {
        subtypeChosen = true;
        subtypeDropdown.prop('disabled', false)
    } else {
        subtypeChosen = false;
        subtypeDropdown.prop('disabled', true)
    }
});
typesCheck.on("click", function() {
    if (typeChosen == false) {
        typeChosen = true;
        typesDropdown.prop('disabled', false)
    } else {
        typeChosen = false;
        typesDropdown.prop('disabled', true)
    }
});
currencySelector.on('change', function() {
    checkCrypto()
    var selectedCurrency = currencySelector.val()
    if(selectedCurrency == "USD") {

    }

})
    viewFavoritesButton.on('click', function() {
        if(onIntro == true) {
            onIntro = false;
        }
        favoritesShown = true;
        pageIndex = 0;
        populateFavorites();
    })
    favoritesShown = false;
}

init()

