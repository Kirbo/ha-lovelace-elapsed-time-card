/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLovelace, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types
import {
  css,
  CSSResult,
  customElement,
  html,
  internalProperty,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';
import { DateTime } from 'luxon';
import { CARD_VERSION } from './const';
import './editor';
import { localize } from './localize/localize';
import { TimeElapsedCardConfig } from './types';

const { TIME_24_SIMPLE } = DateTime;

/* eslint no-console: 0 */
console.info(
  `%c  ELAPSED-TIME-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'elapsed-time-card',
  name: 'Elapsed Time Card',
  description: 'A template custom card for you to create something awesome',
});

// TODO Name your custom element
@customElement('elapsed-time-card')
export class TimeElapsedCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('elapsed-time-card-editor');
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit-element.polymer-project.org/guide/properties
  @property({ attribute: false }) public hass!: HomeAssistant;
  @internalProperty() private config!: TimeElapsedCardConfig;

  // https://lit-element.polymer-project.org/guide/properties#accessors-custom
  public setConfig(config: TimeElapsedCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      ...config,
    };
  }

  protected propertyChanges(oldHass: HomeAssistant, element: any, name: string): boolean {
    return oldHass.states[element.config[name]] !== element.hass?.states[element.config[name]];
  }

  protected hasConfigOrEntityChanged(element: any, changedProps: PropertyValues, forceUpdate: boolean): boolean {
    if (changedProps.has('config') || forceUpdate) {
      return true;
    }

    if (element.config?.time_today && element.config?.max_today) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass) {
        return (
          this.propertyChanges(oldHass, element, 'time_today') || this.propertyChanges(oldHass, element, 'max_today')
        );
      }
      return true;
    } else {
      return false;
    }
  }

  // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return this.hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected parseTime(entity): number {
    if (entity?.attributes?.has_time || entity?.attributes?.has_date) {
      return entity.attributes.timestamp;
    }

    if (entity?.attributes?.unit_of_measurement === 's') {
      return parseFloat(entity.state);
    }

    if (entity?.attributes?.unit_of_measurement === 'm') {
      return parseFloat(entity.state) * 60;
    }

    if (entity?.attributes?.unit_of_measurement === 'h') {
      return parseFloat(entity.state) * 60 * 60;
    }

    return 0;
  }

  protected timeFormat(time: DateTime): string {
    switch (this.config.time_format) {
      case '1h 5m': {
        const values: string[] = [];
        if (time.hour > 0) {
          values.push(time.toFormat("H'h'"));
        }
        if (time.minute > 0) {
          values.push(time.toFormat("m'm'"));
        }

        if (values.length < 1) {
          values.push(time.toFormat("m'm'"));
        }

        return values.join(' ');
      }
      case '01:05':
      default: {
        return `${time.toLocaleString(TIME_24_SIMPLE)}`;
      }
    }
  }

  protected timeElapsed(): string {
    if (!this.config.max_today) {
      const today = this.hass.states[this.config.time_today];

      const timeToday = DateTime.fromSeconds(this.parseTime(today), { zone: 'utc' });

      return this.timeFormat(timeToday);
    }

    const today = this.hass.states[this.config.time_today];
    const max = this.hass.states[this.config.max_today];

    const timeToday = DateTime.fromSeconds(this.parseTime(today), { zone: 'utc' });
    const timeMax = DateTime.fromSeconds(this.parseTime(max), { zone: 'utc' });

    return `${this.timeFormat(timeToday)} / ${this.timeFormat(timeMax)}`;
  }

  protected timeLeft(): string {
    const today = this.hass.states[this.config.time_today];
    const max = this.hass.states[this.config.max_today];

    const timeLeft = this.parseTime(max) - this.parseTime(today);
    const negative = timeLeft < 0 ? true : false;
    const timeLeftToday = DateTime.fromSeconds(negative ? Math.abs(timeLeft) : timeLeft, { zone: 'utc' });

    return `${negative ? '-' : ''}${this.timeFormat(timeLeftToday)}`;
  }

  protected renderTime(): string {
    switch (this.config.format) {
      case 'Time Elapsed': {
        return this.timeElapsed();
      }
      case 'Time Left':
      default: {
        return this.timeLeft();
      }
    }
  }

  // https://lit-element.polymer-project.org/guide/templates
  protected render(): TemplateResult | void {
    return html`
      <ha-card tabindex="0" class="elapsed-time-card">
        <div class="elapsed-time-card__container">
          ${this.config.icon
            ? html`
                <ha-icon class="elapsed-time-card__container__icon" .icon=${`mdi:${this.config.icon}`}></ha-icon>
              `
            : ''}
          ${this.config.name
            ? html`
                <div class="elapsed-time-card__container__header">${this.config.name}</div>
              `
            : ''}
          ${this.renderTime()}
        </div>
      </ha-card>
    `;
  }

  // https://lit-element.polymer-project.org/guide/styles
  static get styles(): CSSResult {
    return css`
      .elapsed-time-card {
        height: 100%;
        display: grid;
        justify-content: center;
        align-items: center;
      }

      .elapsed-time-card__container {
        --mdc-icon-size: 64px;
        display: grid;
        font-family: var(--paper-font-caption_-_font-family);
        font-size: 26px;
        font-weight: 700;
        grid-gap: 10px;
        justify-items: center;
        padding: 25px;
      }

      .elapsed-time-card__container__header {
        display: grid;
        font-family: var(--paper-font-caption_-_font-family);
        font-size: 16px;
        font-weight: normal;
        justify-items: center;
      }
    `;
  }
}
