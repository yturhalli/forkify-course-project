import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render recieved object to the DOM
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe) 
   * @param {boolean} [render = true] if false, create markup string instead of rendering to the DOM
   * @returns {undefined | string } A markup string is returned if render = false 
   * @this {Object} View instance 
   * @author Yusuf Turhalli
   * @todo Finish implementation: Display number of pages
   *  Ability to sort earch results by duration or number of ingredients
   * perform ingredient validation in view, before submitting the from
   * improve recipe ingredient input: separate in multiple fields and allow more than 6 ingredients
   * Shopping list feature: button on recipe to add ingredients to a list
   * weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calendar
   * get nutrition data on each ingredient from spoonacular API (https://spoonacular.com/food-api) and calculate total calories of recipe. 
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      };

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value)
        });
      };
    });
  };

  _clear() {
    this._parentElement.innerHTML = '';
  };

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
  };

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

}