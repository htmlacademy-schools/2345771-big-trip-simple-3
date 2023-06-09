import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = () => `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
     <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked="">      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #handleEverythingChange = null;
  #handleFutureChange = null;

  constructor({onEverythingChange, onFutureChange}){
    super();
    this.#handleEverythingChange = onEverythingChange;
    this.#handleFutureChange = onFutureChange;

    this.element.querySelector('input[value=everything]')
      .addEventListener('change', this.#everythingChangeHandler);
    this.element.querySelector('input[value=future]')
      .addEventListener('change', this.#futureChangeHandler);
  }

  get template() {
    return createFilterTemplate();
  }

  #everythingChangeHandler = () => {
    this.#handleEverythingChange();
  };

  #futureChangeHandler = () => {
    this.#handleFutureChange();
  };
}
