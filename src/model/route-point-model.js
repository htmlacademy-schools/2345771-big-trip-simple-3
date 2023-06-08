import Observable from '../framework/observable';

export default class RoutePointModel extends Observable {
  #pointsApiService = null;
  #routePoints = [];

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.init();
  }

  async init() {
    let routePoints = null;
    try {
      routePoints = await this.#pointsApiService.routePoints;
      for (const point of routePoints){
        this.#routePoints.push({
          basePrice: point.base_price,
          dateFrom: point.date_from,
          dateTo: point.date_to,
          destination: point.destination,
          id: point.id,
          offers: point.offers,
          type: point.type
        });
      }
    } catch(err) {
      this.#routePoints = [];
    }
  }

  get routePoints() {
    return this.#routePoints;
  }

}
