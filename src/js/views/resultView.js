// Import parent class
import View from './View';
// Import child class
import prviewView from './prviewView';

// Import Parcel icons from dist folder
import icons from 'url:../../img/icons.svg';

// Result view
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found, please try again.';
  _succsessMessage = '';

  _generateMarkup() {
    return this._data
      .map((result) => prviewView.render(result, false))
      .join('');
  }
}

export default new ResultView();
