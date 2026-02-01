import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import type Mithril from 'mithril';

// Extend KeyboardEvent to include Mithril's redraw property
interface MithrilKeyboardEvent extends KeyboardEvent {
  redraw?: boolean;
}

// Type for pagination state
interface PaginationState {
  page: () => { number: number; items: any[] };
  totalPages: () => number;
  ctrl: {
    toPage: (page: number) => void;
    pageList: () => number[];
  };
}

interface ToolbarAttrs {
  state: PaginationState;
}

export default class Toolbar extends Component<ToolbarAttrs> {
  view(vnode: Mithril.Vnode<ToolbarAttrs>) {
    const state = this.attrs.state;
    return (
      <div className="Pagination">
        <ul class="IndexPage-toolbar-view">
          <li>{this.buttonFirst()}</li>
          <li>{this.buttonBack()}</li>
          {state.ctrl.pageList().map((page: any) => {
            return (
              <li>
                <Button
                  title={page}
                  className={state.page().number == page ? 'Button Button--primary Button--active' : 'Button'}
                  onclick={() => {
                    state.ctrl.toPage(page);
                  }}
                >
                  {page}
                </Button>
              </li>
            );
          })}
          <li>{this.buttonNext()}</li>
          <li>{this.buttonLast()}</li>
          <li>{this.inputJump()}</li>
          <li>{this.buttonJump()}</li>
        </ul>
      </div>
    );
  }

  buttonFirst() {
    const state = this.attrs.state;
    return Button.component({
      title: 'First',
      icon: 'fa fa-angle-double-left fas fa-angles-left',
      className: 'Button Button--icon',
      onclick: () => {
        state.ctrl.toPage(1);
      },
      disabled: state.page().number === 1,
    });
  }

  buttonBack() {
    const state = this.attrs.state;
    return Button.component({
      title: 'Back',
      icon: 'fa fa-angle-left fas',
      className: 'Button Button--icon',
      onclick: () => {
        const page = state.page().number;
        state.ctrl.toPage(page - 1);
      },
      disabled: state.page().number === 1,
    });
  }

  buttonNext() {
    const state = this.attrs.state;
    return Button.component({
      title: 'Next',
      icon: 'fa fa-angle-right fas',
      className: 'Button Button--icon',
      onclick: () => {
        const page = state.page().number;
        state.ctrl.toPage(page + 1);
      },
      disabled: state.page().number === state.totalPages(),
    });
  }

  buttonLast() {
    const state = this.attrs.state;
    return Button.component({
      title: 'Last',
      icon: 'fa fa-angle-double-right fas fa-angles-right',
      className: 'Button Button--icon',
      onclick: () => {
        state.ctrl.toPage(state.totalPages());
      },
      disabled: state.page().number === state.totalPages(),
    });
  }

  JumpFunc() {
    const state = this.attrs.state;
    const inputElement = document.getElementById('pagination-inputJump') as HTMLInputElement | null;
    const inputValue = inputElement?.value;
    const input = inputValue ? parseInt(inputValue, 10) : NaN;

    if (Number.isFinite(input) && Number.isSafeInteger(input)) {
      if (input !== state.page().number && input >= 1 && input <= state.totalPages()) {
        state.ctrl.toPage(input);
      }
    }
  }

  inputJump() {
    const state = this.attrs.state;
    return m('input.FormControl', {
      id: 'pagination-inputJump',
      type: 'number',
      min: 1,
      max: state.totalPages(),
      placeholder: state.page().number === undefined ? '' : `${state.page().number}`,
      onkeydown: (event: MithrilKeyboardEvent) => {
        event.redraw = false;
        if (event.key === 'Enter' || event.keyCode === 13) {
          event.redraw = true;
          this.JumpFunc();
        }
      },
    });
  }

  buttonJump() {
    return Button.component({
      title: 'Jump',
      icon: 'fa fa-paper-plane fas',
      className: 'Button Button--icon',
      onclick: this.JumpFunc.bind(this),
    });
  }
}
