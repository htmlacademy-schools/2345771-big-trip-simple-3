import BoardPresenter from './presenter/board-presenter';
import RoutePointsModel from './model/route-point-model';
import DestinationModel from './model/destination-model';
import OffersModel from './model/offers-model';
import PointsApiService from './points-api-server';

const pointsApiService = new PointsApiService('https://18.ecmascript.pages.academy/big-trip', 'Basic maximLol1984');
const mainContainer = document.querySelector('.trip-events');
const routePointsModel = new RoutePointsModel({pointsApiService});
const destinationModel = new DestinationModel({pointsApiService});
const offersModel = new OffersModel({pointsApiService});

try {
  await pointsApiService.destinations;
} catch(err) {
  void(0);
}

const boardPresenter = new BoardPresenter({
  boardContainer: mainContainer,
  routePointsModel: routePointsModel,
  destinationModel: destinationModel,
  offersModel: offersModel
});

boardPresenter.init();

//m8-t2
