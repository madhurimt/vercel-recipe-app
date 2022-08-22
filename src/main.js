let API = "https://www.themealdb.com/api/json/v1/1/";

let app = document.querySelector(".app");
let screen = {
  main: app.querySelector(".main-screen"),
  recipe: app.querySelector(".recipe-screen"),
};

function convertToJsObject(res) {
  return res.json();
}

fetch(API + "categories.php")
  .then(convertToJsObject)
  .then(displayCategories);

function displayCategories(data) {
  let type = data.categories;
  for (let i = 1; i < type.length; i++) {
    let div = document.createElement("div");
    div.innerText = type[i].strCategory;
    div.addEventListener("click", function () {
      screen.main
        .querySelector(".categories .active")
        .classList.remove("active");
      div.classList.add("active");
      getRecipeOfCategory(type[i].strCategory);
    });
    if (i == 1) {
      div.classList.add("active");
      getRecipeOfCategory(type[i].strCategory);
    }
    screen.main.querySelector(".categories").appendChild(div);
  }
}

function getRecipeOfCategory(category) {
  fetch(API + "filter.php?c=" + category)
    .then(convertToJsObject)
    .then(displayMeals);
}

function displayMeals(data) {
  screen.main.querySelector(".recipe-list").innerHTML = "";
  let recipes = data.meals;
  for (let i = 0; i < recipes.length; i++) {
    let div = document.createElement("div");
    div.classList.add("item");
    div.addEventListener("click", function () {
      showFullRecipe(recipes[i].idMeal);
    });
    div.innerHTML = `
        <div class="details">
        <h2>${recipes[i].strMeal}</h2>
        </div>
        <div class="thumbnail">
        <img src="${recipes[i].strMealThumb}"/>
        </div>`;
    screen.main.querySelector(".recipe-list").appendChild(div);
  }
}

function showFullRecipe(recipeId) {
  screen.main.classList.add("hidden");
  screen.recipe.classList.remove("hidden");
  screen.recipe
    .querySelector(".back-btn")
    .addEventListener("click", function () {
      screen.recipe.classList.add("hidden");
      screen.main.classList.remove("hidden");
      screen.recipe.querySelector(".thumbnail img").src = "";
      screen.recipe.querySelector(".details h2").innerText = "";
      screen.recipe.querySelector(".details ul").innerText = "";
      screen.recipe.querySelector(".details ol").innerText = "";
    });

  fetch(API + "lookup.php?i=" + recipeId)
    .then(convertToJsObject)
    .then(displayAllIngredients);
}

function displayAllIngredients(data) {
  let recipe = data.meals[0];
  screen.recipe.querySelector(".thumbnail img").src = recipe.strMealThumb;
  screen.recipe.querySelector(".details h2").innerText = recipe.strMeal;

  for (let i = 1; i <= 20; i++) {
    if (recipe["strIngredient" + i].length == 0) {
      break;
    }
    let li = document.createElement("li");
    li.innerText = recipe["strIngredient" + i] + "-" + recipe["strMeasure" + i];
    screen.recipe.querySelector(".details ul").appendChild(li);
  }
  let instructions = recipe.strInstructions.split("\r\n").filter((v) => v);
  for (let i = 0; i < instructions.length; i++) {
    let li = document.createElement("li");
    li.innerText = instructions[i];
    screen.recipe.querySelector(".details ol").appendChild(li);
  }
}
