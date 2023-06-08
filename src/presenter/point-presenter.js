import {render, replace, remove, RenderPosition} from '../framework/render.js';
import RoutePointView from '../view/route-point-view';
import FormEditingView from '../view/form-editing-view';

export default class PointPresenter{
  #listContainer = null;
  #routePoint = null;
  #pointComponent = null;
  #formComponent = null;

  constructor({listContainer}){
    this.#listContainer = listContainer;
  }

  init(routePoint) {
    this.#routePoint = routePoint;

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#formComponent;

    this.#pointComponent = new RoutePointView({
      routePoint: this.#routePoint,
      onEditClick: this.#handleEditClick
    });

    this.#formComponent = new FormEditingView({
      routePoint: this.#routePoint,
      onSubmit: this.#handleSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onRollUpClick: this.#handleRollUpClick
    });

    if (prevPointComponent === null || prevFormComponent === null) {
      render(this.#pointComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this.#listContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#listContainer.contains(prevFormComponent.element)) {
      replace(this.#formComponent, prevFormComponent);
    }

    remove(prevPointComponent);
    remove(prevFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formComponent);
  }

  #replacePointToForm() {
    this.#pointComponent.element.replaceWith(this.#formComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    this.#formComponent.element.replaceWith(this.#pointComponent.element);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #deletePoint() {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = () => {
    this.#deletePoint();
  };

  #handleRollUpClick = () => {
    this.#replaceFormToPoint();
  };

}

