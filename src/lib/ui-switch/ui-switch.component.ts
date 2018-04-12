import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line: no-use-before-declare */
  useExisting: forwardRef(() => UiSwitchComponent),
  multi: true,
};

@Component({
  selector: 'ui-switch',
  template: `
    <span class="switch"
    [class.checked]="checked"
    [class.disabled]="disabled"
    [class.switch-large]="size === 'large'"
    [class.switch-medium]="size === 'medium'"
    [class.switch-small]="size === 'small'"
    [style.background-color]="getColor()"
    [style.border-color]="getColor('borderColor')"
    >
    <small [style.background]="getColor('switchColor')">
    </small>
    </span>
  `,
  styles: [
    `
    .switch {
    background: #f00;
    border: 1px solid #dfdfdf;
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    overflow: visible;
    padding: 0;
    margin: 0;
    cursor: pointer;
    box-shadow: rgb(223, 223, 223) 0 0 0 0 inset;
    transition: 0.3s ease-out all;
    -webkit-transition: 0.3s ease-out all;
    }

    small {
    border-radius: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.3s ease-out all;
    -webkit-transition: 0.3s ease-out all;
    }

    .switch-large {
    width: 66px;
    height: 40px;
    border-radius: 40px;
    }

    .switch-large small {
    width: 40px;
    height: 40px;
    }

    .switch-medium {
    width: 50px;
    height: 30px;
    border-radius: 30px;
    }

    .switch-medium small {
    width: 30px;
    height: 30px;
    }

    .switch-small {
    width: 33px;
    height: 20px;
    border-radius: 20px;
    }

    .switch-small small {
    width: 20px;
    height: 20px;
    }

    .checked {
    background: rgb(100, 189, 99);
    border-color: rgb(100, 189, 99);
    }

    .switch-large.checked small {
    left: 26px;
    }

    .switch-medium.checked small {
    left: 20px;
    }

    .switch-small.checked small {
    left: 13px;
    }

    .disabled {
    opacity: .50;
    cursor: not-allowed;
    }
    `,
  ],
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR],
})
export class UiSwitchComponent implements ControlValueAccessor {
  private _checked: boolean;
  private _disabled: boolean;
  private _reverse: boolean;

  @Input() size = 'medium';
  @Input() color = 'rgb(100, 189, 99)';
  @Input() switchOffColor = '';
  @Input() switchColor = '#fff';
  @Input() defaultBgColor = '#fff';
  @Input() defaultBoColor = '#dfdfdf';

  @Input()
  set checked(v: boolean) {
    this._checked = v !== false;
  }

  get checked() {
    return this._checked;
  }

  @Input()
  set disabled(v: boolean) {
    this._disabled = v !== false;
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  set reverse(v: boolean) {
    this._reverse = v !== false;
  }

  get reverse() {
    return this._reverse;
  }

  /**
   * Emits changed value
   */
  @Output() change = new EventEmitter<boolean>();

  /**
   * Emits DOM event
   */
  @Output() changeEvent = new EventEmitter<MouseEvent>();

  /**
   * Emits changed value
   */
  @Output() valueChange = new EventEmitter<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  getColor(flag = '') {
    if (flag === 'borderColor') {
      return this.defaultBoColor;
    }
    if (flag === 'switchColor') {
      if (this.reverse) {
        return !this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
      }
      return this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
    }
    if (this.reverse) {
      return !this.checked ? this.color : this.defaultBgColor;
    }
    return this.checked ? this.color : this.defaultBgColor;
  }

  @HostListener('click', ['$event'])
  onToggle(event: MouseEvent) {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;

    // Component events
    this.change.emit(this.checked);
    this.valueChange.emit(this.checked);
    this.changeEvent.emit(event);

    // value accessor callbacks
    this.onChangeCallback(this.checked);
    this.onTouchedCallback(this.checked);
    this.cdr.markForCheck();
  }

  writeValue(obj: any): void {
    if (obj !== this.checked) {
      this.checked = !!obj;
    }
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  private onTouchedCallback = (v: any) => {};
  private onChangeCallback = (v: any) => {};
}
