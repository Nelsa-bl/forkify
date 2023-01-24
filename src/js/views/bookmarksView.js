// Import parent class
import View from './View';
// Import child class
import prviewView from './prviewView';

// Import Parcel icons from dist folder
import icons from 'url:../../img/icons.svg';

// Result view
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  _succsessMessage = '';

  // Render bookmarks
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => prviewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
