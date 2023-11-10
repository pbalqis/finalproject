// Define an array to store the added meals in the meal planner
var mealPlanner = [];

function buttonclick() {
  document.getElementById("displayDetailMeals").innerHTML = "";
  var selectedCategory = document.getElementById("category").value;

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.meals && data.meals.length > 0) {
        var listContainer = document.getElementById("list");
        listContainer.innerHTML = ""; // Clear previous content

        data.meals.forEach((meal) => {
          var mealBox = document.createElement("div");
          mealBox.className = "meal-box";

          var mealLink = document.createElement("a");
          mealLink.textContent = meal.strMeal;
          mealLink.href = "#";
          mealLink.onclick = function () {
            displayMealDetails(meal.strMeal); // Pass the meal name as the query
          };

          var mealThumbnail = document.createElement("img");
          mealThumbnail.className = "meal-thumbnail";
          mealThumbnail.src = meal.strMealThumb;
          mealThumbnail.alt = meal.strMeal;

          mealBox.appendChild(mealThumbnail);
          mealBox.appendChild(mealLink);

          listContainer.appendChild(mealBox);
        });
      } else {
        document.getElementById("list").innerHTML = `No meals found in the "${selectedCategory}" category.`;
      }
    });
}

function displayMealDetails(query) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        var meal = data.meals[0];

        var mealDetails = `<h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p>ID: ${meal.idMeal}</p>
          <div id="instruction" style="font-size: 18px; margin: 10px auto; text-align: center; padding: 0 20%;">Instructions: <br><br>${meal.strInstructions}</div>
          <p>Source: <a href="${meal.strSource}" target="_blank">${meal.strSource}</a></p>
          <p>How to cook: <a href=${meal.strYoutube}" target="_blank">${meal.strYoutube}</a></p>`;

        var ingredientsList = "<h3>Ingredients:</h3><ul>";
        for (let i = 1; i <= 20; i++) {
          var ingredient = meal["strIngredient" + i];
          var measure = meal["strMeasure" + i];

          if (ingredient && ingredient.trim() !== "") {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
          }
        }
        ingredientsList += "</ul>";

        // Create a button to go back to the category selection
        var backButton = document.createElement("button");
        backButton.textContent = "Back to Category";
        backButton.onclick = function () {
          document.getElementById("list").innerHTML = "";
          document.getElementById("displayDetailMeals").innerHTML = "";
        };

        // Create a button to add the meal to the meal planner
        var addToMealPlannerButton = document.createElement("button");
        addToMealPlannerButton.textContent = "Add to Meal Planner";
        addToMealPlannerButton.onclick = function () {
          addToMealPlanner(meal);
        };

        // Replace the entire page content with the container
        var mealDetailsContainer = document.createElement("div");
        mealDetailsContainer.innerHTML = mealDetails + ingredientsList;
        mealDetailsContainer.appendChild(backButton);
        mealDetailsContainer.appendChild(addToMealPlannerButton);

        // Replace the entire page content with the container
        document.getElementById("list").innerHTML = "";
        document.getElementById("displayDetailMeals").innerHTML = "";
        document.getElementById("displayDetailMeals").appendChild(mealDetailsContainer);
      } else {
        // Handle the case where no meals were found for the given query.
        document.getElementById("list").innerHTML = "No meals found for this query.";
      }
    });
}

function addToMealPlanner(meal) {
  // Retrieve the existing meal planner data from localStorage
  var existingMealPlanner = JSON.parse(localStorage.getItem('mealPlanner')) || [];

  // Push the new meal to the meal planner
  existingMealPlanner.push(meal);

  // Store the updated meal planner data in localStorage
  localStorage.setItem('mealPlanner', JSON.stringify(existingMealPlanner));

  // Show a success message to the user
  alert('Meal successfully added to the meal planner!');

  // Open the mealPlanner.html page in a new tab
  window.open('mealPlanner.html', '_blank');
}





// Function to update the meal planner display
function updateMealPlannerDisplay() {
  var mealPlannerContainer = document.getElementById("mealPlanner");
  mealPlannerContainer.innerHTML = "";

  if (mealPlanner.length > 0) {
    mealPlanner.forEach((meal, index) => {
      var mealItem = document.createElement("div");
      mealItem.className = "meal-item";
      mealItem.id = `mealItem-${index}`; // Add a unique identifier

      mealItem.innerHTML = `<p>${index + 1}. ${meal.strMeal}</p>`;

      var updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      updateButton.onclick = function () {
        updateMealInPlanner(index);
      };

      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = function () {
        deleteMealFromPlanner(index);
      };

      mealItem.appendChild(updateButton);
      mealItem.appendChild(deleteButton);

      mealPlannerContainer.appendChild(mealItem);
    });
  }
}



// Function to update a meal name in the meal planner
function updateMealNameInPlanner(index) {
  var newMealName = prompt('Enter the new meal name:');
  if (newMealName !== null) {
    mealPlanner[index].strMeal = newMealName;
    localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
    updateMealPlannerDisplay();
  }
}


function deleteMealFromPlanner(index) {
  mealPlanner.splice(index, 1);
  localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));

  // Remove the specific meal item from the DOM
  var mealItem = document.querySelector(`#mealPlanner .meal-item:nth-child(${index + 2})`);
  if (mealItem) {
    mealItem.remove();
  }

  // Update the meal items' indices in the DOM
  updateMealItemIndices();
}

function updateMealItemIndices() {
  // Get all meal items in the meal planner
  var mealItems = document.querySelectorAll('#mealPlanner .meal-item');

  // Update the meal item indices in the DOM
  mealItems.forEach((mealItem, index) => {
    mealItem.querySelector('button[data-action="update"]').setAttribute('data-index', index);
    mealItem.querySelector('button[data-action="delete"]').setAttribute('data-index', index);
    mealItem.querySelector('input[data-action="newName"]').setAttribute('data-index', index);
    mealItem.querySelector('button[data-action="saveName"]').setAttribute('data-index', index);
  });
}


function viewMealPlannerPage() {
  // Check if there is meal planner data in local storage
  if (localStorage.getItem('mealPlanner')) {
    // Open the mealPlanner.html page in a new tab
    window.open('mealPlanner.html', '_blank');
  } else {
    alert('Your meal planner is empty. Please add meals to the planner first.');
  }
}


// Function to update a meal name in the meal planner
function updateMealNameInPlanner(index) {
  var newNameInput = document.getElementById(`newNameInput${index}`);
  var saveButton = document.getElementById(`saveNameButton${index}`);
  var mealName = document.querySelector(`#mealPlanner .meal-item:nth-child(${index + 2}) .meal-name`);

  newNameInput.style.display = 'inline-block';
  saveButton.style.display = 'inline-block';
  mealName.style.display = 'none';
}

function saveUpdatedName(index) {
  var newNameInput = document.getElementById(`newNameInput${index}`);
  var saveButton = document.getElementById(`saveNameButton${index}`);
  var mealName = document.querySelector(`#mealPlanner .meal-item:nth-child(${index + 2}) .meal-name`);

  var newMealName = newNameInput.value;

  if (newMealName.trim() !== '') {
    mealPlanner[index].strMeal = newMealName;
    localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
    mealName.textContent = newMealName; // Update the displayed meal name
  }

  newNameInput.style.display = 'none';
  saveButton.style.display = 'none';
  mealName.style.display = 'inline-block';
}

function goToCaloryPage() {
  window.location.href = 'calory.html';
}
