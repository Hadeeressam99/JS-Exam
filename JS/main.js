let data= document.getElementById("data");
let search= document.getElementById("search");
let contact= document.getElementById("contact")

function openNavbar() {

    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();

    $(".side-nav-menu").animate({left:0}, 500);
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeNavbar(){

    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();

    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}

closeNavbar();

$(".side-nav-menu i.open-close-icon").click(function(){
    if($(".side-nav-menu").css("left")=="0px"){
        closeNavbar();
    }    
    else
    {
        openNavbar();
    }
})

 async function getCategories(){
    search.innerHTML="";
    let response= await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    response= await response.json();
    displayCategories(response.categories);
}

function displayCategories( arr){
    let cartona="";
    for(let i=0; i<arr.length; i++){
        cartona+=`
        <div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${arr[i].strCategoryThumb}" alt="Corba">
            <div class="meal-layer position-absolute text-center w-100">
                <h3 class="p-2">${arr[i].strCategory}</h3>
                <p> ${arr[i].strCategoryDescription.split(" ").slice(0, 10).join(" ")}</p>
            </div>
        </div>
    </div>`
    }
    data.innerHTML=cartona;
}

async function getArea(){
    search.innerHTML="";
    let response= await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    response= await response.json();
    displayArea(response.meals);
}

function displayArea(arr){
    let cartona="";
    for(let i=0; i<arr.length; i++){
        cartona+=`
        <div class="col-md-3">
        <div class="rounded-2 cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x" style="color: #ffffff;"></i>
                <h3 class="p-2 text-white">${arr[i].strArea}</h3>
        </div>
    </div>`
    }
    data.innerHTML=cartona;
}

async function getIngredients(){
    search.innerHTML="";
    let response= await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    response= await response.json();
    displayIngredients(response.meals.slice(0,15));
}

function displayIngredients(arr){
    let cartona="";
    for(let i=0; i<arr.length; i++){
        cartona+=`
        <div class="col-md-3">
        <div class="rounded-2 text-center cursor-pointer">
            <<i class="fa-solid fa-drumstick-bite fa-4x" style="color: #ffffff;"></i>
                <h3 class="p-2 text-white">${arr[i].strIngredient}</h3>
                <p class="text-white"> ${arr[i].strDescription.split(" ").slice(0, 10).join(" ")}</p>
        </div>
    </div>`
    }
    data.innerHTML=cartona;
}

async function getDetails(mealsId){
    search.innerHTML="";
    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealsId}`);
    response= await response.json();
    displayDetails(response.meals[0]);
}

function displayDetails(meal){
    let ingredients="";
    for(let i=0; i<20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients+=` <li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags=meal.strTags.split(",");
    if(!tags) tags=[]

    let tagsstr="";
    for(let i=0; i<tags.length; i++){
        tagsstr+=`<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let cartona=`<div class="col-md-4">
    <img class="w-100 rounded-2" src="${meal.strMealThumb}" alt="">
    <h2 class="text-white">${meal.strMeal}</h2>
</div>
<div class="col-md-8 text-white">
    <h2>Instructions</h2>
    <p>${meal.strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
    <h3>Recipes : </h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
    </ul>

    <h3>Tags : </h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsstr}
    </ul>

    <a href="${meal.strSource}" class="btn btn-success">Source</a>
    <a href="${meal.strYoutube}" class="btn btn-danger">Yotube</a>
</div>`
data.innerHTML=cartona;

}

async function searchByName(name){
    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    response= await response.json();
    if(response.meals){
        displayMeal(response.meals);
    }
    else{
        displayMeal([]);
    }
}
searchByName("");

function displayMeal(arr){
    let cartona="";
    for(let i=0; i<arr.length; i++){
        cartona+=`<div onclick="getDetails(${arr[i].idMeal})"class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2">
            <img class="w-100" src="${arr[i].strMealThumb}" alt="">
            <div class="meal-layer position-absolute d-flex align-items-center w-100">
                <h3 class="p-2">${arr[i].strMeal}</h3>
            </div>
        </div>
    </div>`;
    }
    data.innerHTML=cartona;
}
function openSearch(){
    search.innerHTML=`
    <div class="row py-3">
        <div class="col-md-6">
         <input  onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By Fist Letter">
        </div>
    </div>`
data.innerHTML=""
}
async function searchByFirstLetter(letter){
    if(letter==""){
        letter="a";
    }
    if(letter.length==1){
        let response= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        response= await response.json();
        if(response.meals){
            displayMeal(response.meals);
        }
        else{
            displayMeal([]);
        }
    }
    if(letter==""){
        letter="a";
    }
}

function contactUs(){
    search.innerHTML="";
    data.innerHTML=`
    <div class="contactUs d-flex justify-content-center min-vh-100 align-items-center">
    <div class="container w-50 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input class="form-control" type="text" placeholder="Enter Your Name">
            </div>
            <div class="col-md-6">
                <input class="form-control" type="email" placeholder="Enter Your Email">
            </div>
            <div class="col-md-6">
                <input class="form-control" type="text" placeholder="Enter Your Phone">
            </div>
            <div class="col-md-6">
                <input class="form-control" type="text" placeholder="Enter Your Age">
            </div>
            <div class="col-md-6">
                <input class="form-control" type="password" placeholder="Enter Your Password">
            </div>
            <div class="col-md-6">
                <input class="form-control" type="password" placeholder="Repassword">
            </div>
        </div>
        <button class="btn btn-outline-danger px-2 mt-3">Submin</button>
    </div>
</div>`
}