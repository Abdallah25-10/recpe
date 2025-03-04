const spoonacularApiKey = 'e5ee712591c349399363a4377e620c32';

async function fetchRecipes() {
    const ingredients = document.getElementById('ingredients').value.trim();
    if (!ingredients) {
        alert('Please enter ingredients!');
        return;
    }

    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&apiKey=${spoonacularApiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const recipes = await response.json();
        if (recipes.length === 0) {
            alert('No recipes found. Try different ingredients!');
            return;
        }

        displayRecipes(recipes);
    } catch (error) {
        console.error(error);
        alert('Error fetching recipes.');
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipes');
    container.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <button onclick="fetchRecipeDetails(${recipe.id})">View Details</button>
        `;
        container.appendChild(recipeCard);
    });
}

async function fetchRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonacularApiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const recipe = await response.json();
        alert(`Title: ${recipe.title}\nCooking Time: ${recipe.readyInMinutes} min\nServings: ${recipe.servings}\nInstructions: ${recipe.instructions}`);
    } catch (error) {
        console.error(error);
        alert('Error fetching recipe details.');
    }
}

const app = {
    lang: 'en',

    getTranslation: function (key) {
        const translations = {
            en: { title: "Smart Recipe Finder", placeholder: "Enter ingredients (comma separated)" },
            ar: { title: "البحث الذكي عن الوصفات", placeholder: "أدخل المكونات (مفصولة بفواصل)" }
        };

        return translations[this.lang]?.[key] || key;
    },

    changeLanguage: function (event) {
        this.lang = event.target.value;
        document.getElementById('title').textContent = this.getTranslation('title');
        document.getElementById('ingredients').placeholder = this.getTranslation('placeholder');
    },

    init: function () {
        document.getElementById('languageSelect').addEventListener('change', this.changeLanguage.bind(this));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

