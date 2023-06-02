import {getDestination} from '../mock/destination-mock';

const DESTINATION_COUNT = 5;

export class DestinationModel {
  #destinations = Array.from({length: DESTINATION_COUNT}, getDestination);

  get destinations() {
    return this.#destinations;
  }
}
