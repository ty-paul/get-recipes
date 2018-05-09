//Main app object
const getRecipes = {};


//Get values from search bar

getRecipes.getValue = function() {
    $('input[type=submit]').on('click', function(e){
        e.preventDefault();
        const addIngredient = $('input[name=myIngredients]').val();
        $('ul').append(`<li>${addIngredient}</li>`);
        });
};

//Get Data Inputted from user
//search API for food items containing those and return list of them
//display recipe title ingredients image and rating + url to actual website
//users can sort by cooking time/rating/dietary restrictions


$.ajax({
    url: 'http://api.yummly.com/v1/api/recipes?_app_id=dfbe7dff&_app_key=2bccb2cb18b4186352c9c884a2cff49a',
    dataType: 'json',
    data: {
        method: 'GET',
        source: 'sourceRecipeUrl'
    }
        })
        //promise
        .then((res) => {
            console.log(res)
          });


//Create an init method

getRecipes.init = function() {
    getRecipes.getValue();
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
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
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
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
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





    const ingredients = ["Algae", "Almond", "Amaranth", "Anchovy", "Anise", "Apple", "Apricot", "Asparagus", "Aubergine", "Avocado", "Beta Lactoglobulin", "Banana", "Barley", "Barley Flour", "Basil", "Bay Leaf", "Beef", "Beetroot", "Bell Pepper", "Black Pepper", "Black Tea", "Blackberry", "Blackcurrant", "Blue Mussel", "Blueberry", "Boiled Milk", "Bovine Lactoferrin", "Bovine Serum Albumin", "Brazil Nut", "Bread – Rye", "Bread – Wheat", "Bread - White", "Broad Bean", "Broccoli", "Bromelin", "Brussels Sprouts", "Buckwheat", "Butter Fat", "Cabbage – Green, Red & White", "Cacao", "Carambola", "Caraway", "Cardamon", "Carob", "Carrot", "Casein", "Cashew Nut", "Castor Bean", "Cauliflower", "Cayenne", "Celery", "Chamomile Tea", "Cheddar cheese", "Cherry", "Chestnut", "Chick Pea", "Chicken Breast", "Chicken Broth", "Chicken Stock", "Chicken Thigh", "Chilli Pepper", "Chocolate", "Chub Mackerel", "Chufas", "Cinnamon", "Clam", "Clove", "Cocoa Bean", "Coconut", "Cod", "Coffee", "Conalbumin", "Coriander", "Corn Meal", "Courgette", "Milk", "Milk Whey", "Crab", "Cranberry", "Crayfish", "Cucumber", "Cumin", "Curry", "Dandelion", "Date", "Dill", "Dinkel Flour", "Dried Berries", "Duck", "Eel", "Egg – White & Yolk", "Elk / Moose Meat", "Eucalyptus", "Fennel", "Fennel Seed", "Fenugreek", "Fig", "Flaxseed", "Garlic", "Gelitin", "Ginger", "Gluten", "Goat Milk", "Grape", "Grapefruit", "Green Coffee Beans", "Green Beans", "Green Pepper", "Green Tea", "Ground Beef", "Guar Guar Gum", "Guava", "Gum Arabic", "Hake", "Halibut", "Hazelnut", "Hemp Flour", "Herring", "Honey", "Hops", "Horse Meat", "Isphagula", "Jalepeno", "Jujube fruit", "Kamut", "Kiwi Fruit", "Kohlrabi", "Lamb", "Laurel", "Leeks", "Lemon", "Lemon Verbena", "Lentils", "Lettuce", "Lime", "Lime Blossom Tea", "Linseed", "Lobster", "Lovage", "Lysozyme", "Macadamia Nuts", "Mace", "Mackerel", "Maize Corn", "Mallow Tea", "Malt", "Mandarin", "Mango", "Maple Syrup", "Mare’s Milk", "Marjoram", "Mate Tea", "Melon – Honeydew", "Milk Fat", "Milk Lactose & Powder", "Millet", "Millet Seed", "Mixed Fish", "Mixed Seafood", "Mixed Spices", "Mint", "Mould Cheese", "Mushroom", "Mustard", "Mutton", "Nettle", "Oat Flour", "Oats", "Octopus", "Olive", "Onion", "Orange", "Oregano", "Ovalbumin", "Oyster", "Pacific Squid", "Papaya", "Paprika", "Parsley", "Parsnip", "Passion Fruit", "Pea", "Peach", "Peanut", "Peanut Butter", "Pear", "Pecan", "Persimmon", "Pilchard", "Pine Nut", "Pineapple", "Pistachio Nut", "Plaice", "Plum", "Poppy Seed", "Pork", "Potato", "Pumpkin", "Pumpkin Seed", "Quinoa", "Rabbit", "Radish", "Rapeseed", "Raspberry", "Red Bass", "Red Beet", "Red Currant", "Red Kidney Bean", "Rice", "Rice Flour", "Rooibos Tea", "Rosehip Tea", "Rosemary", "Runner Beans", "Rye", "Rye Flour", "Salmon", "Semolina", "Sesame Seed", "Sheep’s Milk", "Sheep’s Milk Whey", "Shrimp", "Snail", "Sole", "Soya Bean", "Spinach", "Squid", "Steak", "Strawberry", "Sugar", "Sunflower Seed", "Sweet Chestnut", "Sweet Potato", "Sweet Corn", "Swordfish", "Tapioca", "Tarragon", "Tea", "Thyme", "Tomato", "Triticale", "Trout", "Tuna", "Turkey Meat", "Turmeric", "Vanilla", "Veal", "Vegetable(Mixed)", "Venison", "Walnut", "Watermelon", "Wheat", "White Bean", "Whole Chicken", "Yeast"]

    autocomplete(document.getElementById("myInput"), ingredients);


    
});//End of Document Ready