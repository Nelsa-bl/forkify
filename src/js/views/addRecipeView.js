// View for adding recipes manual
// Import parent class
import View from './View';

// Import Parcel icons from dist folder
import icons from 'url:../../img/icons.svg';

// Pagination view
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _succsessMessage = 'Recipe was succsessfully uploaded ✔️';

  // On load
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // Toggle hidden classes
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // Show on click
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Hide on click
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Form submition
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get all the data from form (New method)
      const dataArray = [...new FormData(this)];
      // Covert to Object (New method)
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  // Render Buttons
  _generateMarkup() {}
}

export default new AddRecipeView();
