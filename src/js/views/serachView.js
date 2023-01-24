// Search view
class SearchView {
  _parentEl = document.querySelector('.search');

  // Get search input value
  getQuerry() {
    const querry = this._parentEl.querySelector('.search__field').value;
    // Call clear
    this._clearInputField();
    return querry;
  }

  // Clear input field
  _clearInputField() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // Handle submit on click
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
