import {ListView} from '../view/list-view';
import {EmptyView} from '../view/empty-view';
import {FormEditingView} from '../view/form-editing-view';
import {RoutePointView} from '../view/route-point-view';
import {SortingView} from '../view/sorting-view';
import {render} from '../render.js';

export class BoardPresenter {
  #numberOfPoints = 0;
  #boardContainer = null;
  #routePointsModel = null;
  #destinationModel = null;

  #ListComponent = new ListView();

  #boardPoits = [];
  #boardEditingForms = [];

  constructor({boardContainer, routePointsModel, destinationModel}) {
    this.#boardContainer = boardContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.#boardPoits = [...this.#routePointsModel.routePoints];
    this.#boardEditingForms = [...this.#destinationModel.destinations];
    this.#numberOfPoints = this.#boardPoits.length;

    render(new SortingView(), this.#boardContainer);
    render(this.#ListComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardPoits.length; i++) {
      this.#renderPoint(this.#boardPoits[i]);
    }
  }

  #renderPoint(point, destination) {
    const pointComponent = new RoutePointView({point});
    const formComponent = new FormEditingView({destination});

    const replacePointToForm = () => {
      this.#ListComponent.element.replaceChild(formComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#ListComponent.element.replaceChild(pointComponent.element, formComponent.element);
    };

    const deletePoint = () => {
      this.#ListComponent.element.removeChild(formComponent.element);
      formComponent.removeElement();
      pointComponent.removeElement();
      this.#numberOfPoints--;
      if (this.#numberOfPoints <= 0) {
        while (this.#boardContainer.firstChild) {
          this.#boardContainer.removeChild(this.#boardContainer.firstChild);
        }
        render(new EmptyView(),this.#boardContainer);
      }
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    formComponent.element.querySelector('.event__reset-btn').addEventListener('click', () => {
      deletePoint();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    formComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    formComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#ListComponent.element);
  }
}
