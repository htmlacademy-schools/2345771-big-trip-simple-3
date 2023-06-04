import ListView from '../view/list-view';
import EmptyView from '../view/empty-view';
import FormEditingView from '../view/form-editing-view';
import FormCreatingView from '../view/form-creating-view';
import RoutePointView from '../view/route-point-view';
import SortingView from '../view/sorting-view';
import AddNewButtonView from '../view/add-new-button-view';
import {render, RenderPosition} from '../framework/render.js';

export default class BoardPresenter {
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

    this.#renderBoard();
  }

  #renderPoint(routePoint, formEditing) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new RoutePointView({
      routePoint,
      onEditClick: () => {
        replacePointToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const formComponent = new FormEditingView({
      formEditing,
      onSubmit: () => {
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onDeleteClick: () => {
        deletePoint.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onRollUpClick: () => {
        replaceFormToPoint.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      pointComponent.element.replaceWith(formComponent.element);
    }

    function replaceFormToPoint() {
      formComponent.element.replaceWith(pointComponent.element);
    }

    function deletePoint() {
      formComponent.element.remove();
      pointComponent.element.remove();
      formComponent.removeElement();
      pointComponent.removeElement();
      this.#numberOfPoints--;
      if (this.#numberOfPoints <= 0) {
        while (this.#boardContainer.firstChild) {
          this.#boardContainer.removeChild(this.#boardContainer.firstChild);
        }
        render(new EmptyView(),this.#boardContainer);
      }
    }

    render(pointComponent, this.#ListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    render(new SortingView(), this.#boardContainer);
    render(this.#ListComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardPoits.length; i++) {
      this.#renderPoint(this.#boardPoits[i], this.#boardEditingForms[i]);
    }

    new AddNewButtonView({
      onClick: () => {
        if (this.#numberOfPoints === 0){
          addNewPointRemoveEmptyBanner.call(this);
        } else {
          addNewPoint.call(this);
        }
      }
    });

    function addNewPointRemoveEmptyBanner() {
      while (this.#boardContainer.firstChild) {
        this.#boardContainer.removeChild(this.#boardContainer.firstChild);
      }
      render(new SortingView(), this.#boardContainer);
      render(this.#ListComponent, this.#boardContainer);
      addNewPoint.call(this);
    }

    function addNewPoint() {
      const escKeyDownHandlerEdit = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          deleteForm.call(this);
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        }
      };

      document.addEventListener('keydown', escKeyDownHandlerEdit);

      const formCreating = new FormCreatingView({
        onSubmit: () => {
          deleteForm.call(this);
          this.#renderPoint(this.#boardPoits[0], this.#boardEditingForms[0]);
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        },
        onDeleteClick: () => {
          this.#numberOfPoints--;
          deleteForm.call(this);
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        }
      });

      render(formCreating, this.#ListComponent.element, RenderPosition.AFTERBEGIN);
      this.#numberOfPoints++;

      function deleteForm() {
        this.#ListComponent.element.removeChild(formCreating.element);
        formCreating.removeElement();
        if (this.#numberOfPoints <= 0) {
          while (this.#boardContainer.firstChild) {
            this.#boardContainer.removeChild(this.#boardContainer.firstChild);
          }
          render(new EmptyView(),this.#boardContainer);
        }
      }

    }

  }

}
