import FilterView from './view/filter-view';
import BoardPresenter from './presenter/board-presenter';
import RoutePointsModel from './model/route-point-model';
import DestinationModel from './model/destination-model';
import {render} from './framework/render.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const routePointsModel = new RoutePointsModel();
const destinationModel = new DestinationModel();
const boardPresenter = new BoardPresenter({
  boardContainer: mainContainer,
  routePointsModel: routePointsModel,
  destinationModel: destinationModel
});

render(new FilterView(), filterContainer);
boardPresenter.init();
