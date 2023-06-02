import {getDestination} from '../mock/destination-mock';

const DESTINATION_COUNT = 1;

export class DestinationModel {
  destinations = Array.from({length: DESTINATION_COUNT}, getDestination);

  getDestinations() {
    return this.destinations;
  }
}
