// Parent Class

// Import Parcel icons from dist folder
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string insted of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Sanel Babij
   * @todo Finish implementation
   */
  render(data, render = true) {
    // Check for data & data not empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // Get data
    this._data = data;
    // Set markup to _generateMarkup
    const markup = this._generateMarkup();
    // Check for render then render
    if (!render) return markup;
    // Clear the Html
    this._clear();
    // Insert HTML into DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render elements
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    // Get data
    this._data = data;
    // Comapre markup
    const newMarkup = this._generateMarkup();

    // Convert to DOM object (Virtual DOM)
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // New DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Current DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);

    // Loop troght array
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Check if the elements are equal
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Change only text content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((atrr) =>
          curEl.setAttribute(atrr.name, atrr.value)
        );
    });
  }

  // Clear the Html
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Render spinner
  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render Error
  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render Succsses
  renderSuccsessMessage(message = this._succsessMessage) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
