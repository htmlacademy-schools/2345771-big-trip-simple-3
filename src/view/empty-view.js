import AbstractView from '../framework/view/abstract-view.js';

function createEmptyTemplate(text) {
  //Click New Event to create your first point
  //There are no future events now
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class EmptyView extends AbstractView{
  #text = null;

  constructor(text){
    super();
    this.#text = text;
  }

  get template() {
    return createEmptyTemplate(this.#text);
  }
}
