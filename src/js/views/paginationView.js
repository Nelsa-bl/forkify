// Import parent class
import View from './View';

// Import Parcel icons from dist folder
import icons from 'url:../../img/icons.svg';

// Pagination view
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Render button icon
  _generateButtonIcon(arrow) {
    return `
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${arrow}"></use>
      </svg>
    `;
  }

  // Render Html
  _generateButton(type) {
    const [page, style] = type;
    if (style === 'next') {
      return `
        <button data-goto="${page}" class="btn--inline pagination__btn--next">
          <span>Page ${page}</span>
          ${this._generateButtonIcon('right')}
        </button>
    `;
    }
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--prev">
        ${this._generateButtonIcon('left')}
        <span>Page ${page}</span>
      </button>
      `;
  }

  // Handle button clicks (!important)
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      // Guard
      if (!btn) return;

      // Get button data set
      const goToPage = Number(btn.dataset.goto);
      // console.log(goToPage);

      handler(goToPage);
    });
  }

  // Render Buttons
  _generateMarkup() {
    // Current page
    const currentPage = this._data.page;
    const nextPage = [currentPage + 1, 'next'];
    const prevPage = [currentPage - 1, 'prev'];

    // Number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // console.log(numPages); // Get pages amount
    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateButton(nextPage);
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateButton(prevPage);
    }
    // Other page
    if (currentPage < numPages) {
      return this._generateButton(nextPage) + this._generateButton(prevPage);
    }
    // Page 1, and there are no other pages
    return ``;
  }
}

export default new PaginationView();
