import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class PointsApiService extends ApiService {
  get routePoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateRoutePoint(routePoint) {
    const response = await this._load({
      url: `points/${routePoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(routePoint) {
    const adaptedTripPoint = {...routePoint,
      'date_from': new Date(routePoint.dateFrom).toISOString(),
      'date_to': new Date(routePoint.dateTo).toISOString(),
      'base_price': Number(routePoint.basePrice),
      'offers': routePoint.offersIDs
    };

    delete adaptedTripPoint.dateFrom;
    delete adaptedTripPoint.dateTo;
    delete adaptedTripPoint.basePrice;
    delete adaptedTripPoint.offersIDs;
    return adaptedTripPoint;
  }
}
