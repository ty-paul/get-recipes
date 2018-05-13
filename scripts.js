$(window).on('beforeunload', function () {
    $("video").hide();
});

//Main app object
const getRecipes = {};
const allIngredients = [];
const allAllergies = [];
let dietRest = "none"


//Get values from search bar
//Get Data Inputted from user - Ty 1hr
//submit on enter

//add meals returned on side(results)***
//make ingredients into a list***
//limit displayed ingredients to 5 with ...***
//loading 3 at a time, load on scroll
//add refresh to page(reset search parameters)

//toggle class hide results, start with 100% home, autoscroll down on submit
//add dietary restrictions and flavors w/ filter
//add more food items to list


//This function checks whether the allergy checkbox is checked. If it is, it applies the filter to the Ajax allowedAllergy function. When unchecked, the filter is removed
getRecipes.allergy = function(allAllergies) {
    $('.allergy input[type=checkbox]').change(function() {
        if (this.checked) {
            allAllergies.push(($(this).val()))
            $('#meals').show()
            $('.itemsRemaining').show()
        }
        else {
            for (i = 0; i < allAllergies.length; i++) {
                if (allAllergies[i] === $(this).val()) {
                    allAllergies.splice(i,1)
                    if (allAllergies.length === 0 && allIngredients.length === 0 && dietRest === "none") {
                        $('#meals').hide()
                        $('.itemsRemaining').hide()
                    }
                }
            }
        }
        getRecipes.recipesByIngredients(allIngredients, allAllergies)
    });
};

//Scroll to the top of the main page when submitting a new ingredient
getRecipes.scrollToTop = function() {
    $('html,body').animate({
        scrollTop: $("main").offset().top
    },
        'slow');

}

//This function works similar to the function above, but only returns one string rather than an arrary. This string is then used in the getValue function to search for dietary restrictions

getRecipes.diet = function(dietRest) {
    $('.diet input[type=radio]').change(function(){
        if (this.checked) {
            $('#meals').show()
            $('.itemsRemaining').show()
            dietRest = $(this).val()
            if (allAllergies.length === 0 && allIngredients.length === 0 && dietRest === "none") {
                $('#meals').hide()
                $('.itemsRemaining').hide()
            }
        }
        
        getRecipes.recipesByIngredients(allIngredients, allAllergies, dietRest)
    });
}

//This is the main submit button for the website. When its clicked, information is received from API
getRecipes.getValue = function(allIngredients, allAllergies, dietRest) {
    $('input[type=submit]').on('click', function(e){
        e.preventDefault();
        //When the form is submitted for the first time, it is moved from the header to the footer
        $('header #submitIngredient').prependTo('.main-nav .wrapper');
        //This replaces the form with a button that says "enjoy!"
        $('header .button-container').removeClass('hidden');
        //The show methods are used to display the amount of recipes remaining. They are hidden again when there is nothing to display
        $('main').removeClass('hidden')
        $('#meals').show()
        $('.itemsRemaining').show()
        const inputText = $('input[type=text]').val();
        if (inputText) {
            const oneIngredient = $('input[name=myIngredients]').val();
            allIngredients.push(oneIngredient);
            $('ul').append(`<li>${oneIngredient}</li>`);
            // console.log(allIngredients)
            getRecipes.recipesByIngredients(allIngredients, allAllergies);
            //reset form after submitting
            const form = document.getElementById('submitIngredient');
            form.reset();
        }     
    });
    return allIngredients
};



//Remove item if user requests + Display nothing if array is empty

getRecipes.removeItem = function(allIngredients, allAllergies){
    //selects the ul, but targets the li on click
    $('ul').on('click', 'li', function(e){
        e.stopPropagation();
        const removedItem = $(this).remove().text();
        // console.log(removedItem)
        for (let i = 0; i < allIngredients.length; i++) {
            //this searches for the ingredient that has to be removed
            if (allIngredients[i] === removedItem) {
                allIngredients.splice(i,1)
            }
        }
        if (allAllergies.length === 0 && allIngredients.length === 0 && dietRest === "none") {
            //if the list is empty, nothing is displayed
            $('#meals').empty()
            $('.itemsRemaining').hide()

        }
        else {
            getRecipes.recipesByIngredients(allIngredients, allAllergies, dietRest);
            // console.log(allIngredients)
        }
    });
}

//This function toggles the Advanced Search option

getRecipes.showAdvanced = function() {
    $('.advancedButton').on('click', function(e){
          e.preventDefault();
        $('.advancedSearch').toggleClass('hidden');
        //This next code toggles the text from (Advanced Settings) to (Close Settings)
        $(this).text($(this).text() == "Close Settings" ? "Advanced Settings" : "Close Settings");

        });
}


//search API for food items containing those and return list of them
//display recipe title ingredients image and rating + url to actual website
//users can sort by cooking time/rating/dietary restrictions

getRecipes.recipesByIngredients = function(ingredients,allAllergies,dietRest) {
    $.ajax({
        url: 'http://api.yummly.com/v1/api/recipes',
        dataType: 'json',
        data: {
            _app_id:'dfbe7dff',
            _app_key:'2bccb2cb18b4186352c9c884a2cff49a',
            q: ingredients,
            maxResult: 8,
            allowedAllergy: allAllergies,
            allowedDiet: dietRest,
            requirePictures:true
            //Add pages filter to display 12
        }
    })
    //promise
    .then((res) => {
        // const mealsReturned = res.mealsReturned
        // console.log(res)
        const mealInfoArray = getRecipes.mealInfo(res);
        // console.log(`meal info array: `, mealInfoArray);
        getRecipes.printInfo(mealInfoArray);
        getRecipes.remaining(res);
        });
};



//using split function, split string(url) at the equals sign, only keep index 0(first part of array). This replaces default small image with large image
getRecipes.trimImgUrl = function(imgUrl){
    return imgUrl.split('=')[0]
    //splits string at = sign and you keep the index of [0] and discard [1]
}


getRecipes.mealInfo = function(apiResult){
    const foodItems = apiResult.matches;
    // console.log(foodItems);
    
//returns an array of objects, each object contains the data you need
    const foodDataArray = foodItems.map(item => {
        //returns only 5 ingredients required for meal
        const ingredients = item.ingredients.slice(0,5);
        const title = item.recipeName;
        const uniqueTitle = item.id;
        let mealImageUrl = item.imageUrlsBySize['90'];
        mealImageUrl = getRecipes.trimImgUrl(mealImageUrl);
        const websiteUrl = "https://www.yummly.com/recipe/" + uniqueTitle;
        const itemInfoObject = {title, uniqueTitle, ingredients, mealImageUrl, websiteUrl};
        return itemInfoObject;
        
    });//end of map
    return foodDataArray;
}

//Putting information pulled from API on the webpage including Img, title, ingredients, and rating

//return the amount of search results
getRecipes.remaining = function(foodInfo) {
    const $results = $('<h2>').text(`Total Recipes Found: ${foodInfo.totalMatchCount}`)
    $('.itemsRemaining').html($results)

}

//This is how each ingredient is displayed on the page
getRecipes.printInfo = function(meals) {
    

    //Empty the results and display new ones
    $('#meals').empty();
    meals.forEach((oneMeal) =>{
        //create variable for ul which creates ul element in html
        const $ul = $('<ul>');

        //forEach to go through every item in the ingredients array
        oneMeal.ingredients.forEach(function(ingredient){

            //create variable for li which creates li for each ingredient
            const $li = $('<li>').text(ingredient);
            //add each list item to ul
            $ul.append($li);
        })
        
        $('#meals').append($ul);

        if (oneMeal.mealImageUrl) {
            const $title = $('<h2>').text(oneMeal.title);
            const $ingredients = $ul;
            const $image = $('<img>').attr('src', oneMeal.mealImageUrl)
            const $url = $('<a>').attr({'href':oneMeal.websiteUrl, 'target':'_blank'}).text('Read More')
            const $mealContainer = $('<div>').append($title, $image, $ingredients, $url);
            
            // console.log(oneMeal.websiteUrl)
            // console.log(oneMeal.websiteUrl)
            $('#meals').append($mealContainer);
        }
    });
};



//Create an init method

getRecipes.init = function() {
    getRecipes.allergy(allAllergies)
    getRecipes.diet(dietRest)
    getRecipes.getValue(allIngredients);
    getRecipes.removeItem(allIngredients, allAllergies, dietRest);
    getRecipes.showAdvanced()
}

//Doucument ready

$(function () {
    getRecipes.init();



    //Autocomplete Form Section
    function autocomplete(inp, arr) {
        
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            /*reset form*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            
            //Autocorrect only starts when user types 3 letters
            if (this.value.length > 2) {
                for (i = 0; i < arr.length; i++) {
                    /*check if the item starts with the same letters as the text field value:*/
                    if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        /*make the matching letters bold:*/
                        b.innerHTML = arr[i].substr(0, val.length);
                        b.innerHTML += arr[i].substr(val.length);
                        /*insert a input field that will hold the current array item's value:*/
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function (e) {
                            /*insert the value for the autocomplete text field:*/
                            inp.value = this.getElementsByTagName("input")[0].value;
                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                }

            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }





    const ingredients = ["Algae", "Almond", "Amaranth", "Anchovy", "Anise", "Apple", "Apricot", "Asparagus", "Aubergine", "Avocado", "Beta Lactoglobulin", "Banana", "Barley", "Barley Flour", "Basil", "Bay Leaf", "Beef", "Beetroot", "Bell Pepper", "Black Pepper", "Black Tea", "Blackberry", "Blackcurrant", "Blue Mussel", "Blueberry", "Boiled Milk", "Bovine Lactoferrin", "Bovine Serum Albumin", "Brazil Nut", "Bread", "Broad Bean", "Broccoli", "Bromelin", "Brussels Sprouts", "Buckwheat", "Butter Fat", "Cabbage – Green, Red & White", "Cacao", "Carambola", "Caraway", "Cardamon", "Carob", "Carrot", "Casein", "Cashew Nut", "Castor Bean", "Cauliflower", "Cayenne", "Celery", "Chamomile Tea", "Cheddar cheese", "Cherry", "Chestnut", "Chick Pea", "Chicken Breast", "Chicken Broth", "Chicken Stock", "Chicken Thigh", "Chicken Wings", "Chilli Pepper", "Chocolate", "Chub Mackerel", "Chufas", "Cinnamon", "Clam", "Clove", "Cocoa Bean", "Coconut", "Cod", "Coffee", "Conalbumin", "Coriander", "Corn Meal", "Courgette", "Milk", "Milk Whey", "Crab", "Cranberry", "Crayfish", "Cucumber", "Cumin", "Curry", "Dandelion", "Date", "Dill", "Dinkel Flour", "Dried Berries", "Duck", "Eel", "Egg – White & Yolk", "Elk / Moose Meat", "Eucalyptus", "Fennel", "Fennel Seed", "Fenugreek", "Fig", "Flaxseed", "Garlic", "Gelitin", "Ginger", "Gluten", "Goat Milk", "Grape", "Grapefruit", "Green Coffee Beans", "Green Beans", "Green Pepper", "Green Tea", "Ground Beef", "Guar Guar Gum", "Guava", "Gum Arabic", "Hake", "Halibut", "Hazelnut", "Hemp Flour", "Herring", "Honey", "Hops", "Horse Meat", "Isphagula", "Jalepeno", "Jujube fruit", "Kamut", "Kiwi Fruit", "Kohlrabi", "Lamb", "Laurel", "Leeks", "Lemon", "Lemon Verbena", "Lentils", "Lettuce", "Lime", "Lime Blossom Tea", "Linseed", "Lobster", "Lovage", "Lysozyme", "Macadamia Nuts", "Mace", "Mackerel", "Maize Corn", "Mallow Tea", "Malt", "Mandarin", "Mango", "Maple Syrup", "Mare’s Milk", "Marjoram", "Mate Tea", "Melon – Honeydew", "Milk Fat", "Milk Lactose & Powder", "Millet", "Millet Seed", "Mixed Fish", "Mixed Seafood", "Mixed Spices", "Mint", "Mould Cheese", "Mushroom", "Mustard", "Mutton", "Nettle", "Oat Flour", "Oats", "Octopus", "Olive", "Onion", "Orange", "Oregano", "Ovalbumin", "Oyster", "Pacific Squid", "Papaya", "Paprika", "Parsley", "Parsnip", "Passion Fruit", "Pea", "Peach", "Peanut", "Peanut Butter", "Pear", "Pecan", "Persimmon", "Pilchard", "Pine Nut", "Pineapple", "Pistachio Nut", "Plaice", "Plum", "Poppy Seed", "Pork", "Potato", "Pumpkin", "Pumpkin Seed", "Quinoa", "Rabbit", "Radish", "Rapeseed", "Raspberry", "Red Bass", "Red Beet", "Red Currant", "Red Kidney Bean", "Rice", "Rice Flour", "Rooibos Tea", "Rosehip Tea", "Rosemary", "Runner Beans", "Rye", "Rye Flour", "Salmon", "Semolina", "Sesame Seed", "Sheep’s Milk", "Sheep’s Milk Whey", "Shrimp", "Snail", "Sole", "Soya Bean", "Spinach", "Squid", "Steak", "Strawberry", "Sugar", "Sunflower Seed", "Sweet Chestnut", "Sweet Potato", "Sweet Corn", "Swordfish", "Tapioca", "Tarragon", "Tea", "Thyme", "Tomato", "Triticale", "Trout", "Tuna", "Turkey Meat", "Turmeric", "Vanilla", "Veal", "Vegetable(Mixed)", "Venison", "Walnut", "Watermelon", "Wheat", "White Bean", "Whole Chicken", "Yeast", "Pizza Dough", "Cherry Tomato"]

    autocomplete(document.getElementById("myInput"), ingredients);
   
   
   
   
    //SMOOTH SCROLLING
    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });


    
});//End of Document Ready