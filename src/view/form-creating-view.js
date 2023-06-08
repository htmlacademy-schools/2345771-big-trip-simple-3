import AbstractView from '../framework/view/abstract-view.js';
import {getRoutePoint} from '../mock/route-point-mock.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const getPictures = (pictures) => pictures.map((picture) => `
'<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const getOffers = (offers, offersId) => {
  const newOffers = [];
  for (const offer of offers){
    if (offer.id in offersId) {
      newOffers.push(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" checked="">
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`);
    } else {
      newOffers.push(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage">
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`);
    }
  }
  return newOffers.join(' ');
};

const DATE_FORMAT = 'DD/MM/YY';
const TIME_FORMAT = 'H:mm';

const convertToDateTime = (date) => dayjs(date).format(DATE_FORMAT);
const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
const convertToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const createNewFormCreatingTemplate = (destinations, offersArray) =>{

  const {basePrice, dateFrom, dateTo, destination, offers, type} = getRoutePoint();
  const startDate = convertToDateTime(dateFrom);
  const startTime = convertToTime(dateFrom);
  const endDate = convertToDateTime(dateTo);
  const endTime = convertToTime(dateTo);
  const description = destinations[destination - 1].description;
  const allOffers = offersArray.filter(((el) => el.type === type))[0].offers;
  const offersOfPoint = getOffers(allOffers, offers);

  const picturesOfDestination = getPictures(destinations[destination - 1].pictures);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked="">
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${convertToUpperCase(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[destination - 1].name}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${startTime}">
        —
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn event__cancel__form" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offersOfPoint}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${picturesOfDestination}
          </div>
        </div>
      </section>
    </section>
  </form>
  </li>`;
};
export default class FormCreatingView extends AbstractView {
  #destinations = null;
  #offersArray = null;
  #handleSubmit = null;
  #handleDeleteClick = null;
  #datepicker = null;

  constructor({destinations, offersArray, onSubmit, onDeleteClick}){
    super();
    this.#destinations = destinations;
    this.#offersArray = offersArray;
    this.#handleSubmit = onSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#submitHandler); //заменить на submit
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.#setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker = null;
    }
  }

  #setDatepicker() {
    this.#datepicker = flatpickr(
      this.element.querySelectorAll('.event__input--time'),
      {
        dateFormat: 'd/m/y h:i',
      },
    );
  }

  get template() {
    return createNewFormCreatingTemplate(this.#destinations, this.#offersArray);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick();
  };

}
