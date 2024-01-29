const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipedetails = document.querySelector(".recipe-details");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const fetchRecipes = async (mealName) => {
    recipeContainer.innerHTML = `<div class="customloader"></div>`;
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        const response = await data.json();
    
        console.log(response);
    
        recipeContainer.innerHTML = "";
    
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src = "${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belogs to <span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement("button");
            button.innerText = "View Recipe";
            recipeDiv.appendChild(button);
    
            button.addEventListener('click',()=>{
                recipeContainer.classList.add("blur");
                openRecipePopup(meal);
            });
    
            recipeContainer.appendChild(recipeDiv);
        });
    } 

    catch (error) {
        recipeContainer.innerHTML = "<h2> Error in Fetching Recipes... </h2>";
    }
}

const fetchIngredients = meal => {
    let ingredientsList = "";
    for(i=1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}

const openRecipePopup = meal => {
    recipeDetailsContent.innerHTML=`
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients : </h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
        <h3>Instructions :</h3>
        <p>${meal.strInstructions}</p>
        <div class="youtube"><i class="fa-brands fa-youtube"></i>
        <a href=${meal.strYoutube} target="_blank">Watch Recipe</a></div>
        </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click',()=>{
    recipeContainer.classList.remove("blur");
    recipeDetailsContent.parentElement.style.display = "none";
})

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
})