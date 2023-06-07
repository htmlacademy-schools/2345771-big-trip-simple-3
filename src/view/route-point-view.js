import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const EVENT_DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'H:mm';

const getOffers = (offers, offersId) => {
  const newOffers = [];
  for (const offer of offers){
    if (offer.id in offersId) {
      newOffers.push(`<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `);
    }
  }
  return newOffers.join('');
};

const convertToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const convertToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const convertToDateTime = (date) => date.substring(0, date.indexOf('.'));
const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
const convertToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const createNewRoutePointTemplate = (routePoint, destinations, offersArray) => {

  const {basePrice, dateFrom, dateTo, destination, offers, type} = routePoint;
  const eventDateTime = convertToEventDateTime(dateFrom);
  const eventDate = convertToEventDate(dateFrom);
  const startDate = convertToDateTime(dateFrom);
  const startTime = convertToTime(dateFrom);
  const endDate = convertToDateTime(dateTo);
  const endTime = convertToTime(dateTo);
  const allOffers = offersArray.filter(((el) => el.type === type))[0].offers;
  const offersOfPoint = getOffers(allOffers, offers);

  return `<li class="trip-events__item">
  <div class="event">
  <time class="event__date" datetime="${eventDateTime}">${eventDate}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${convertToUpperCase(type)} ${destinations[destination - 1].name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${startDate}">${startTime}</time>
      —
      <time class="event__end-time" datetime="${endDate}">${endTime}</time>
    </p>
  </div>
  <p class="event__price">
    €&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offersOfPoint}
  </ul>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;
};

export default class RoutePointView extends AbstractView {
  #routePoint = null;
  #destinations = null;
  #offersArray = null;
  #handleEditClick = null;

  constructor({routePoint, destinations, offersArray, onEditClick}) {
    super();
    this.#routePoint = routePoint;
    this.#destinations = destinations;
    this.#offersArray = offersArray;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createNewRoutePointTemplate(this.#routePoint, this.#destinations, this.#offersArray);
  }

  get routePoint() {
    return this.#routePoint;
  }

  set routePoint(routePoint) {
    this.#routePoint = routePoint;
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
