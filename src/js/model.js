import { async } from 'regenerator-runtime';

// Import URL_API & RES_PER_PAGE
import { API_URL, RES_PER_PAGE, KEY } from './config.js';

// Import JSON
import { AJAX } from './views/helpers.js';
// import { getJSON, sendJSON } from './views/helpers.js';

// State
export const state = {
  recipe: {},
  serach: {
    querry: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// Reformat data
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecepie = async function (id) {
  try {
    // Get data
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // Put reform data into state
    state.recipe = createRecipeObject(data);

    // Check for bookamrk true
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 🔥🔥🔥`);
    // Delegate err
    throw err;
  }
};

// Search function
export const loadSearchResults = async function (querry) {
  try {
    state.serach.querry = querry;
    const data = await AJAX(`${API_URL}?search=${querry}&key=${KEY}`);
    console.log(data);

    // Update state
    state.serach.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // Update page on new search
    state.serach.page = 1;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
    // Delegate err
    throw err;
  }
};

// Search result by page
export const getSearchResultPage = function (page = state.serach.page) {
  // Set page
  state.serach.page = page;
  // Calc serach results
  const start = (page - 1) * state.serach.resultPerPage; // 0;
  const end = page * state.serach.resultPerPage; // 9
  // Return only 10 results
  return state.serach.results.slice(start, end);
};

// Update servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    const calcSer = newServings / state.recipe.servings;
    ing.quantity = ing.quantity * calcSer;
  });
  state.recipe.servings = newServings;
};

// Save bookmarks to local storage
const persistBookmark = function () {
  // Covert to JSON
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Bookmark recipe
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Store to local storage
  persistBookmark();
};

// Delete bookmark
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Store to local storage
  persistBookmark();
};

// Extract local bookmarks out of local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // Covert back from JSON
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// console.log(state.bookmarks);

// For debugging clear bookmarks
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// Upload recipe to API
export const uploadRecipe = async function (newRecipe) {
  try {
    // Format data to match API get data
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map((el) => el.trim());
        const [quantity, unit, description] = ingArr;

        // Test if ingArray has length of 3
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the right format : quantity, unit, description all seperated by comma ,'
          );

        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    // Create recipe Object for uplad
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);

    // Send created recipe to API (2 params)
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // Store data in our state
    state.recipe = createRecipeObject(data);

    // Add bookmark automatic
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
