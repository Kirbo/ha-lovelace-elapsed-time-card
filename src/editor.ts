/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { ActionConfig, fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import {
  css,
  CSSResult,
  customElement,
  html,
  internalProperty,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { ElapsedTimeCardConfig } from './types';

const options = {
  required: {
    icon: 'tune',
    name: 'Required',
    secondary: 'Required options for this card to function',
    show: true,
  },
  appearance: {
    icon: 'palette',
    name: 'Appearance',
    secondary: 'Customize the name, icon, etc',
    show: false,
  },
};

const formats = ['Time Elapsed', 'Time Left'].sort();
const time_formats = ['01:05', '1h 5m'].sort();

@customElement('elapsed-time-card-editor')
export class ElapsedTimeCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @internalProperty() private _config?: ElapsedTimeCardConfig;
  @internalProperty() private _toggle?: boolean;
  @internalProperty() private _helpers?: any;
  private _initialized = false;

  public setConfig(config: ElapsedTimeCardConfig): void {
    this._config = {
      format: 'Time Left',
      time_format: '1h 5m',
      ...config,
    };

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _name(): string {
    return this._config?.name || '';
  }

  get _time_today(): string {
    return this._config?.time_today || '';
  }

  get _max_today(): string {
    return this._config?.max_today || '';
  }

  get _format(): string {
    return this._config?.format || '';
  }

  get _time_format(): string {
    return this._config?.time_format || '';
  }

  get _icon(): string {
    return this._config?.icon || '';
  }

  get _show_warning(): boolean {
    return this._config?.show_warning || false;
  }

  get _show_error(): boolean {
    return this._config?.show_error || false;
  }

  get _tap_action(): ActionConfig {
    return this._config?.tap_action || { action: 'more-info' };
  }

  get _hold_action(): ActionConfig {
    return this._config?.hold_action || { action: 'none' };
  }

  get _double_tap_action(): ActionConfig {
    return this._config?.double_tap_action || { action: 'none' };
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    const entities = Object.keys(this.hass.states).filter(entity_id => {
      const entity = this.hass?.states[entity_id];

      if (entity?.attributes.unit_of_measurement && ['h', 'm', 's'].includes(entity.attributes.unit_of_measurement)) {
        return true;
      }

      if (entity?.attributes.has_time && entity.attributes.has_time) {
        return true;
      }

      if (entity?.attributes.has_date && entity.attributes.has_date) {
        return true;
      }

      return false;
    });

    entities.sort();

    return html`
      <div class="card-config">
        <div class="values">
          <paper-input
            label="Name (Optional)"
            .value=${this._name}
            .configValue=${'name'}
            @value-changed=${this._valueChanged}
          ></paper-input>
          <br />
          <paper-input
            label="Icon (Optional)"
            .value=${this._icon}
            .configValue=${'icon'}
            @value-changed=${this._valueChanged}
          ></paper-input>
          <br />
          <paper-dropdown-menu label="Format (Required)" @value-changed=${this._valueChanged} .configValue=${'format'}>
            <paper-listbox slot="dropdown-content" .selected=${formats.indexOf(this._format)}>
              ${formats.map(entity => {
                return html`
                  <paper-item>${entity}</paper-item>
                `;
              })}
            </paper-listbox>
          </paper-dropdown-menu>
          <paper-dropdown-menu label="Time Format" @value-changed=${this._valueChanged} .configValue=${'time_format'}>
            <paper-listbox slot="dropdown-content" .selected=${time_formats.indexOf(this._time_format)}>
              ${time_formats.map(entity => {
                return html`
                  <paper-item>${entity}</paper-item>
                `;
              })}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div class="values">
          <paper-dropdown-menu label="Time elapsed" @value-changed=${this._valueChanged} .configValue=${'time_today'}>
            <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._time_today)}>
              ${entities.map(entity => {
                return html`
                  <paper-item>${entity}</paper-item>
                `;
              })}
            </paper-listbox>
          </paper-dropdown-menu>
          <paper-dropdown-menu label="Maximum allowed" @value-changed=${this._valueChanged} .configValue=${'max_today'}>
            <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._max_today)}>
              ${entities.map(entity => {
                return html`
                  <paper-item>${entity}</paper-item>
                `;
              })}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
      </div>
    `;
    /*
        <ha-formfield .label=${`Toggle warning ${this._show_warning ? 'off' : 'on'}`}>
          <ha-switch
            .checked=${this._show_warning !== false}
            .configValue=${'show_warning'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>
        <ha-formfield .label=${`Toggle error ${this._show_error ? 'off' : 'on'}`}>
          <ha-switch
            .checked=${this._show_error !== false}
            .configValue=${'show_error'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>
    */
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _toggleOption(ev): void {
    this._toggleThing(ev, options);
  }

  private _toggleThing(ev, optionList): void {
    const show = !optionList[ev.target.option].show;
    for (const [key] of Object.entries(optionList)) {
      optionList[key].show = false;
    }
    optionList[ev.target.option].show = show;
    this._toggle = !this._toggle;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
      }
      ha-formfield {
        padding-bottom: 8px;
      }
    `;
  }
}
