import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';

/* if(module.hot) {
  module.hot.accept();
} */

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner()

    //Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //Update bookmarks view
    bookMarksView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);

    // Rendering Recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError()
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    //Render Results
    resultsView.render(model.getSearchResultsPage(1));

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPaginationBtn = function (goTo) {
  //Render New Results
  resultsView.render(model.getSearchResultsPage(goTo));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings)

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add-Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update Recipe view
  recipeView.update(model.state.recipe);

  //Render Bookmarks
  bookMarksView.render(model.state.bookmarks)
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    
    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();
    
    //Rende bookmarkview
    bookMarksView.render(model.state.bookmarks);

    //Change Id in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error('💩💥💥', err);
    addRecipeView.renderError(err.message)
  }
}

const newFeature = function(){
  console.log(`Welcome to the application`);
}
const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPaginationBtn);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
}

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();