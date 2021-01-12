import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'elapsed-time-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface TimeElapsedCardConfig extends LovelaceCardConfig {
  type: string;
  format?: string;
  time_format?: string;
  time_today: string;
  max_today: string;
  icon?: string;
  name?: string;
}
