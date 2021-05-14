
// global variables for page elements

var resultsDiv = $('.searchResults')
var searchButton = $('.searchButton')
var searchInput = $('.searchInput')
var rarityCheck = $('.rarityCheck')
var supertypeCheck = $('.supertypeCheck')
var rarityDropdown = $('.rarityDropdown')
var supertypeDropdown = $('.supertypeDropdown')

// global variables for timer/price mode



// global variable for searched text/checked criteria/page

var finalSearchUrl = '';
var pageIndex = 0;
var paginationIndex = 0;
var totalResults;
var rarityChosen = false;
var supertypeChosen = false;
var cardData;

// function to check criteria and create API URL

function createUrl(name) {
    var baseUrl = `https://api.pokemontcg.io/v2/cards?q=name:${name}*`
    var searchUrl = ''
    if(rarityChosen && supertypeChosen) {
        var rarityChoice = rarityDropdown.val()
        var supertypeChoice = supertypeDropdown.val()
        searchUrl = `${baseUrl} supertype:${supertypeChoice} rarity:${rarityChoice}`
    } else if(rarityChosen && !supertypeChosen) {
        var rarityChoice = rarityDropdown.val()
        searchUrl = `${baseUrl} rarity:${rarityChoice}`
    } else if(supertypeChosen && !rarityChosen) {
        var supertypeChoice = supertypeDropdown.val()
        searchUrl = `${baseUrl} supertype:${supertypeChoice}`
    } else {
        searchUrl = baseUrl
    }
    finalSearchUrl = searchUrl;
}


// function to create pagination buttons

function createPagination() {
    var paginationEl = $('<ul>').addClass('pagination col s12 push-s1')
    var pageAmount = (totalResults - ((paginationIndex * 8) * 8))/8
    var leftArrowItem = $('<li>').addClass('waves-effect prevButton')
    var leftIcon = $('<i>').addClass('material-icons').text('chevron_left')
    leftArrowItem.append(leftIcon)
    paginationEl.append(leftArrowItem)
    for(i = 0;i < pageAmount && i < 8; i++) {
        var pageButton = $('<li>').addClass('waves-effect pageButton').data('index', i + (paginationIndex*8))
        if(pageIndex === i + (paginationIndex*8)) {
            pageButton.addClass('active blue darken-4')
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

// function to pull card data when search button is clicked

function pullCardData(){
    var name = searchInput.val();
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

// function to populate cards in the searchResults div

function searchCards() {
    resultsDiv.empty()
    createPagination();
    var pageModifier = pageIndex*8;
    var cardsRow = $('<div>').addClass('row center')
    var divider = $('<div>').addClass('col s12')
    for (i = pageModifier; i < (pageModifier+8); i++) {
        if(cardData[i] != undefined) {
            var cardContainer = $("<div>").addClass('cardContainer col s3 push-s1')
            var imageContainer = $('<div>')
            var textContainer = $('<div>')
            var favButton = $('<a>').addClass('btn-floating yellow accent-4').attr('style', "top: -30px")
            var favIcon = $('<i>').addClass('material-icons').text("star")
            var name = cardData[i].name
            var set = cardData[i].set.name
            var nameEl = $('<span>').addClass('cardName').text(name)
            var setEl = $('<p>').addClass('cardSet').text(set)
            var priceEl = $('<p>').addClass('cardPrice')
            var imageEl = $("<img>").attr({src: cardData[i].images.large, width: 250}).addClass('materialboxed responsive-img')
            if (cardData[i].tcgplayer != undefined) {
                var prePrices = cardData[i].tcgplayer.prices
                var prices = $.map(prePrices, function (value, index) {
                    return [value]
                })
                if (prices[0] != undefined) {
                    var finalPrice = JSON.stringify(prices[0].mid);
                    if(finalPrice.includes('.')) {
                        var periodIndex = finalPrice.indexOf('.')
                        console.log(periodIndex)
                        var cents = finalPrice.substr(periodIndex)
                        if(cents.length == 2) {
                            finalPrice = finalPrice + "0"
                        }
                    } else {
                        finalPrice = finalPrice + ".00"
                    }
                    priceEl.text(`$${finalPrice}`)
                }
                else {
                    priceEl.text("No Price")
                }
            }
            else {
                priceEl.text("No Price")
            }
            favButton.append(favIcon)
            imageContainer.append(imageEl)
            imageContainer.append(favButton)
            cardContainer.append(imageContainer)
            textContainer.append(nameEl)
            textContainer.append(setEl)
            textContainer.append(priceEl)
            cardContainer.append(textContainer)
            cardsRow.append(cardContainer)
            if(i - (pageIndex*8) === 3) {
                cardsRow.append(divider)
            } 
        }
    }
    resultsDiv.append(cardsRow);
    $('.materialboxed').materialbox();
}

// function to run when webpage is loaded

function init() {
    
    // Apply click event to search button
    searchButton.on('click', function() {
        pageIndex = 0
        paginationIndex = 0;
        pullCardData();
        
    })  
}

init()
