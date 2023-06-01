import {ListView} from '../view/list-view';
import {FormCreatingView} from '../view/form-creating-view';
import {FormEditingView} from '../view/form-editing-view';
import {RoutePointView} from '../view/route-point-view';
import {SortingView} from '../view/sorting-view';
import {render} from '../render.js';

export class BoardPresenter {
  ListComponent = new ListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortingView(), this.boardContainer);
    render(this.ListComponent, this.boardContainer);

    render(new FormEditingView, this.ListComponent.getElement());
    render(new FormCreatingView, this.ListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.ListComponent.getElement());
    }
  }
}
