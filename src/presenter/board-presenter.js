import {ListView} from '../view/list-view';
import {FormCreatingView} from '../view/form-creating-view';
import {RoutePointView} from '../view/route-point-view';
import {SortingView} from '../view/sorting-view';
import {render} from '../render.js';

export class BoardPresenter {
  ListComponent = new ListView();

  constructor({boardContainer, routePointsModel, destinationModel}) {
    this.boardContainer = boardContainer;
    this.routePointsModel = routePointsModel;
    this.destinationModel = destinationModel;
  }

  init() {
    this.boardPoits = [...this.routePointsModel.getRoutePoints()];
    this.boardEditingForms = [...this.destinationModel.getDestinations()];

    render(new SortingView(), this.boardContainer);
    render(this.ListComponent, this.boardContainer);

    for (let i = 0; i < this.boardEditingForms.length; i++) {
      render(new FormCreatingView({Destination: this.boardEditingForms[i]}), this.ListComponent.getElement());
    }

    for (let i = 0; i < this.boardPoits.length; i++) {
      render(new RoutePointView({RoutePoint: this.boardPoits[i]}), this.ListComponent.getElement());
    }
  }
}
