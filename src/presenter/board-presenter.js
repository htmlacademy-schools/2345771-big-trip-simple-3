import ListView from '../view/list-view';
import EmptyView from '../view/empty-view';
import FormEditingView from '../view/form-editing-view';
import FormCreatingView from '../view/form-creating-view';
import RoutePointView from '../view/route-point-view';
import SortingView from '../view/sorting-view';
import FilterView from '../view/filter-view';
import AddNewButtonView from '../view/add-new-button-view';
import {render, RenderPosition} from '../framework/render.js';

import {getDestination} from '../mock/destination-mock';
import {getRoutePoint,
  comparePointsByPriceHihgLow, comparePointsByDateLowHigh } from '../mock/route-point-mock';

export default class BoardPresenter {
  #boardContainer = null;
  #routePointsModel = null;
  #destinationModel = null;

  #ListComponent = new ListView();

  #boardPoints = [];
  #boardEditingForms = [];

  #filterContainer = document.querySelector('.trip-controls__filters');
  #currentDate = new Date().toJSON();
  #boardFuturePoints = [];
  #isFuture = false;

  constructor({boardContainer, routePointsModel, destinationModel}) {
    this.#boardContainer = boardContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.#boardPoints = [...this.#routePointsModel.routePoints];
    this.#boardEditingForms = [...this.#destinationModel.destinations];

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
      for (const point of this.#boardPoints){
        if (point.id === pointComponent.routePoint.id) {
          this.#boardPoints = this.#boardPoints.filter((el) => el.id !== point.id);
        }
      }
      formComponent.element.remove();
      pointComponent.element.remove();
      formComponent.removeElement();
      pointComponent.removeElement();
      if (this.#boardPoints.length <= 0) {
        while (this.#boardContainer.firstChild) {
          this.#boardContainer.removeChild(this.#boardContainer.firstChild);
        }
        render(new EmptyView(),this.#boardContainer);
      }
    }

    render(pointComponent, this.#ListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    //Кнопки сортировки
    const newSortingView = new SortingView({
      onDateChange: () => {
        sortByDateLowHigh.call(this);
      },
      onPriceChange: () => {
        sortByPriceHighLow.call(this);
      }
    });

    function addNewSortingView(){
      render(newSortingView, this.#boardContainer, RenderPosition.AFTERBEGIN);
    }

    function sortByPriceHighLow() {
      if (!this.#isFuture){
        this.#boardPoints.sort(comparePointsByPriceHihgLow);
        renderPoints.call(this);
      } else {
        this.#boardFuturePoints.sort(comparePointsByPriceHihgLow);
        renderPoints.call(this);
      }
    }

    function sortByDateLowHigh() {
      if (!this.#isFuture){
        this.#boardPoints.sort(comparePointsByDateLowHigh);
        renderPoints.call(this);
      } else {
        this.#boardFuturePoints.sort(comparePointsByDateLowHigh);
        renderPoints.call(this);
      }
    }

    //Кнопки фильтра
    const newFilterView = new FilterView({
      onEverythingChange: () => {
        this.#isFuture = false;
        renderPoints.call(this);
        newSortingView.element[0].checked = true;
        sortByDateLowHigh.call(this);
      },
      onFutureChange: () => {
        this.#isFuture = true;
        renderPoints.call(this);
        newSortingView.element[0].checked = true;
        sortByDateLowHigh.call(this);
      }
    });

    render(newFilterView, this.#filterContainer);

    //Кнопка создания новой точки
    new AddNewButtonView({
      onClick: () => {
        if (this.#boardPoints.length === 0){
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
      addNewSortingView.call(this);
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
          const newRoutePoint = getRoutePoint();
          const newEditingForm = getDestination();
          this.#boardPoints = [...this.#boardPoints,newRoutePoint];
          this.#boardEditingForms = [...this.#boardEditingForms,newEditingForm];
          deleteForm.call(this);
          this.#renderPoint(newRoutePoint, newEditingForm);
          if (newSortingView.element[0].checked) {
            sortByDateLowHigh.call(this);
          } else {
            sortByPriceHighLow.call(this);
          }
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        },
        onDeleteClick: () => {
          deleteForm.call(this);
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        }
      });

      render(formCreating, this.#ListComponent.element, RenderPosition.AFTERBEGIN);

      function deleteForm() {
        formCreating.element.remove();
        formCreating.removeElement();
        if (this.#boardPoints.length <= 0) {
          while (this.#boardContainer.firstChild) {
            this.#boardContainer.removeChild(this.#boardContainer.firstChild);
          }
          render(new EmptyView(),this.#boardContainer);
        }
      }
    }

    //Начальный рендер
    render(this.#ListComponent, this.#boardContainer);
    addNewSortingView.call(this);
    this.#boardPoints.sort(comparePointsByDateLowHigh);
    renderPoints.call(this);

    function renderPoints() {
      while (this.#ListComponent.element.firstChild) {
        this.#ListComponent.element.removeChild(this.#ListComponent.element.firstChild);
      }
      if (!this.#isFuture) {
        for (let i = 0; i < this.#boardPoints.length; i++) {
          this.#renderPoint(this.#boardPoints[i], this.#boardEditingForms[i]);
        }
      } else {
        this.#boardFuturePoints = this.#boardFuturePoints.filter((point) => point.dateFrom >= this.#currentDate);
        for (let i = 0; i < this.#boardFuturePoints.length; i++) {
          this.#renderPoint(this.#boardFuturePoints[i], this.#boardEditingForms[i]);
        }
      }
    }
  }
}
