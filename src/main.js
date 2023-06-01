import {FilterView} from './view/filter-view';
import {BoardPresenter} from './presenter/board-presenter';
import {render} from './render.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer:mainContainer});

render(new FilterView(), filterContainer);
boardPresenter.init();
