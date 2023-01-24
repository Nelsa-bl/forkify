// Import Model
import * as model from './model.js';
// Import Recipe view
import recepieView from './views/recepieView.js';
// Import Search view
import serachView from './views/serachView.js';
// Import result view
import resultView from './views/resultView.js';
// Import peganation view
import paginationView from './views/paginationView.js';
// Import Bookmarks
import bookmarksView from './views/bookmarksView.js';
// Import add recipe manual view
import addRecipeView from './views/addRecipeView.js';
// Import Modal timeout
import { MODAL_CLOSE_SEC } from './config.js';
// Import Core-js for older browsers
import 'core-js/stable';

// Import regenerator-runtime for older browsers
import 'regenerator-runtime/runtime';
import { Module } from 'module';

// Parsel no load
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Fetch API
const controlRecipes = async function () {
  try {
    // Loading recipe

    // Get dynamic id and set id on hash change
    const id = window.location.hash.slice(1);

    // Guard if no id is found
    if (!id) return;

    // Spinner init
    recepieView.renderSpinner();

    // Update bookmarks view
    // debugger; // Debug for bugs
    bookmarksView.update(model.state.bookmarks);

    // Update results view to mark selected search result
    resultView.update(model.getSearchResultPage());

    // Import from model (promise) / Get data
    await model.loadRecepie(id);

    // Rendering the recipe
    recepieView.render(model.state.recipe);
  } catch (err) {
    // Report error
    recepieView.renderError();
  }
};

// Call search result
const controlSearchResults = async function () {
  try {
    // Display Spinner
    resultView.renderSpinner();

    // Get value from input field
    const querry = serachView.getQuerry();

    // Guard
    if (!querry) return;

    // Get results for search value
    await model.loadSearchResults(querry);

    // Render search Results
    // resultView.render(model.state.serach.results);
    resultView.render(model.getSearchResultPage());

    // Render pagination buttons
    paginationView.render(model.state.serach);
  } catch (err) {
    console.error(err);
  }
};

// When click on pagination button update
const controlPagination = function (goToPage) {
  // Update new results and new buttons
  resultView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.serach);
};

// Update servings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // Render entire view
  // recepieView.render(model.state.recipe);
  // Render only elements
  recepieView.update(model.state.recipe);
};

// Adding new bookmark
const controlAddBookmark = function () {
  // Add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // Delete bookmark
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.bookmarks);

  // Update recipe view
  recepieView.update(model.state.recipe);

  // Render bookmarks in header
  bookmarksView.render(model.state.bookmarks);
};

// Render bookmarks on load
const controlAddBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Add recipes manual (promise)
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Uplad the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recepieView.render(model.state.recipe);

    // Display succsess message
    addRecipeView.renderSuccsessMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the url (history change url without realod page)
    // pushState take 3 arrguments (state, title, url)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Go back to last page
    // window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// Call addEventlisntner on search button click
// Call addEventListner on Init
const init = function () {
  bookmarksView.addHandlerRender(controlAddBookmarks);
  recepieView.addHandlerRender(controlRecipes);
  recepieView.addHandlerUpdateServings(controlServings);
  recepieView.addHandlerAddBookmark(controlAddBookmark);
  serachView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
