import {getRoutePoint} from '../mock/route-point-mock';

const ROUTE_POINTS_COUNT = 3;

export class RoutePointsModel {
  tasks = Array.from({length: ROUTE_POINTS_COUNT}, getRoutePoint);

  getRoutePoints() {
    return this.tasks;
  }
}
