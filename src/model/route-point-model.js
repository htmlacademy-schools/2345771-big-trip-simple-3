import {getRoutePoint} from '../mock/route-point-mock';

const ROUTE_POINTS_COUNT = 5;

export default class RoutePointsModel {
  #points = Array.from({length: ROUTE_POINTS_COUNT}, getRoutePoint);

  get routePoints() {
    return this.#points;
  }
}
