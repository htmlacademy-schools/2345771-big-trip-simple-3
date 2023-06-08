import ListView from '../view/list-view';
import EmptyView from '../view/empty-view';
import FormEditingView from '../view/form-editing-view';
import FormCreatingView from '../view/form-creating-view';
import RoutePointView from '../view/route-point-view';
import SortingView from '../view/sorting-view';
import FilterView from '../view/filter-view';
import AddNewButtonView from '../view/add-new-button-view';
import {render, RenderPosition} from '../framework/render.js';

import {getRoutePoint,
  comparePointsByPriceHihgLow, comparePointsByDateLowHigh } from '../mock/route-point-mock';

export default class BoardPresenter {
  #boardContainer = null;
  #routePointsModel = null;
  #destinationModel = null;
  #offersModel = null;

  #listComponent = new ListView();

  #boardPoints = [];
  #boardDestinations = [];
  #boardOffers = [];
  #boardFuturePoints = [];

  #filterContainer = document.querySelector('.trip-controls__filters');
  #isFuture = false;
  #wasEmptyView = false;

  constructor({boardContainer, routePointsModel, destinationModel, offersModel}) {
    this.#boardContainer = boardContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#boardPoints = [...this.#routePointsModel.routePoints];
    this.#boardDestinations = [...this.#destinationModel.destinations];
    this.#boardOffers = [...this.#offersModel.offers];

    this.#renderBoard();
  }

  #isEmpty() {
    return ((this.#boardPoints.length <= 0 && !this.#isFuture) ||
    (this.#boardFuturePoints.length <= 0 && this.#isFuture));
  }

  #renderEmptyView() {
    if (this.#boardPoints.length <= 0 && !this.#isFuture) {
      while (this.#boardContainer.firstChild) {
        this.#boardContainer.removeChild(this.#boardContainer.firstChild);
      }
      render(new EmptyView('Click New Event to create your first point'),this.#boardContainer);
      this.#wasEmptyView = true;
    }
    if (this.#boardFuturePoints.length <= 0 && this.#isFuture) {
      while (this.#boardContainer.firstChild) {
        this.#boardContainer.removeChild(this.#boardContainer.firstChild);
      }
      render(new EmptyView('There are no future events now'),this.#boardContainer);
      this.#wasEmptyView = true;
    }
  }

  #renderBoard() {
    //Рендер кнопки
    const renderPoint = (routePoint) => {
      const escKeyDownHandler = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          replaceFormToPoint.call(this);
          document.removeEventListener('keydown', escKeyDownHandler);
        }
      };

      const pointComponent = new RoutePointView({
        routePoint,
        destinations: this.#boardDestinations,
        offersArray: this.#boardOffers,
        onEditClick: () => {
          replaceAllFormsToPoints.call(this);
          replacePointToForm.call(this);
          document.addEventListener('keydown', escKeyDownHandler);
        }
      });

      const formComponent = new FormEditingView({
        routePoint,
        destinations: this.#boardDestinations,
        offersArray: this.#boardOffers,
        onSubmit: () => {
          pointComponent.routePoint = formComponent.routePoint;
          replaceFormToPoint.call(this);
          document.removeEventListener('keydown', escKeyDownHandler);
        },
        onDeleteClick: () => {
          deletePoint.call(this);
          document.removeEventListener('keydown', escKeyDownHandler);
        },
        onRollUpClick: () => {
          replaceFormToPoint.call(this);
          document.removeEventListener('keydown', escKeyDownHandler);
        }
      });

      function replaceAllFormsToPoints() {
        const buttons = document.querySelectorAll('.event__cancel__form');
        for (const button of buttons) {
          button.click();
        }
      }

      function replacePointToForm() {
        pointComponent.element.replaceWith(formComponent.element);
      }

      function replaceFormToPoint() {
        renderPoints.call(this);
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
        this.#renderEmptyView();
      }

      render(pointComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
    };

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
        this.#renderEmptyView();
      },
      onFutureChange: () => {
        this.#isFuture = true;
        renderPoints.call(this);
        newSortingView.element[0].checked = true;
        sortByDateLowHigh.call(this);
        this.#renderEmptyView();
      }
    });

    render(newFilterView, this.#filterContainer);

    //Кнопка создания новой точки
    new AddNewButtonView({
      onClick: () => {
        if (this.#isEmpty()){
          closeAllForms.call(this);
          addNewPointRemoveEmptyBanner.call(this);
        } else {
          closeAllForms.call(this);
          addNewPoint.call(this);
        }
      }
    });

    function closeAllForms() {
      const buttons = document.querySelectorAll('.event__cancel__form');
      for (const button of buttons) {
        button.click();
      }
    }

    function addNewPointRemoveEmptyBanner() {
      while (this.#boardContainer.firstChild) {
        this.#boardContainer.removeChild(this.#boardContainer.firstChild);
      }
      addNewSortingView.call(this);
      render(this.#listComponent, this.#boardContainer);
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
        destinations: this.#boardDestinations,
        offersArray: this.#boardOffers,
        onSubmit: () => {
          const newRoutePoint = getRoutePoint();
          this.#boardPoints = [...this.#boardPoints,newRoutePoint];
          deleteForm.call(this);
          renderPoint(newRoutePoint);
          if (newSortingView.element[0].checked) {
            sortByDateLowHigh.call(this);
          } else {
            sortByPriceHighLow.call(this);
          }
          this.#renderEmptyView();
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        },
        onDeleteClick: () => {
          deleteForm.call(this);
          this.#renderEmptyView();
          document.removeEventListener('keydown', escKeyDownHandlerEdit);
        }
      });

      render(formCreating, this.#listComponent.element, RenderPosition.AFTERBEGIN);

      function deleteForm() {
        formCreating.element.remove();
        formCreating.removeElement();
      }
    }

    //Начальный рендер
    render(this.#listComponent, this.#boardContainer);
    addNewSortingView.call(this);
    this.#boardPoints.sort(comparePointsByDateLowHigh);
    renderPoints.call(this);

    function renderPoints() {
      if (this.#wasEmptyView) {
        while (this.#boardContainer.firstChild) {
          this.#boardContainer.removeChild(this.#boardContainer.firstChild);
        }
        render(this.#listComponent, this.#boardContainer);
        addNewSortingView.call(this);
        this.#wasEmptyView = false;
      }
      while (this.#listComponent.element.firstChild) {
        this.#listComponent.element.removeChild(this.#listComponent.element.firstChild);
      }
      if (!this.#isFuture) {
        for (let i = 0; i < this.#boardPoints.length; i++) {
          renderPoint(this.#boardPoints[i]);
        }
      } else {
        const currentDate = new Date().toJSON();
        this.#boardFuturePoints = this.#boardPoints.filter((point) => point.dateFrom >= currentDate);
        for (let i = 0; i < this.#boardFuturePoints.length; i++) {
          renderPoint(this.#boardFuturePoints[i]);
        }
      }
    }
  }
}
