# Time Elapsed Card by [@kirbo](https://www.github.com/kirbo)

Time Elapsed card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

[![Discord][discord-shield]][discord]
[![Community Forum][forum-shield]][forum]

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/kirbo)

## Options

| Name        | Type   | Requirement  | Description                | Default     |
| ----------- | ------ | ------------ | -------------------------- | ----------- |
| type        | string | **Required** | `custom:elapsed-time-card` |
| time_today  | string | **Required** | Home Assistant entity ID.  | `none`      |
| max_today   | string | **Required** | Home Assistant entity ID.  | `none`      |
| format      | string | **Required** | Format for the card        | `Time Left` |
| time_format | string | **Required** | Card name                  | `1h 5m`     |
| name        | string | **Optional** | Name to show on card       | `none`      |
| icon        | string | **Optional** | Icon to show on card       | `none`      |

## Format Options

### `Time Elapsed`

Show time in `<time elapsed> / <time maximum>` format, e.g.: `01:54 / 02:00` or `1h 54m / 2h`, depending on `time_format` setting.

### `Time Left`

Show time in `<time remaining>` format, e.g.: `00:06` or `6m`, depending on `time_format` setting.

## Examples

![Cartoons Watched](./screenshots/cartoons-watched.png)

```yaml
type: 'custom:elapsed-time-card'
format: Time Elapsed
time_format: 1h 5m
time_today: sensor.ps4_playing_game
max_today: input_datetime.ps4_game_time
name: Cartoons watched
icon: netflix
```

![Game time left](./screenshots/game-time-left.png)

```yaml
type: 'custom:elapsed-time-card'
format: Time Left
time_format: 1h 5m
time_today: sensor.ps4_playing_game
max_today: input_datetime.ps4_game_time
name: Game time left
icon: sony-playstation
```

![Game time left - Editor 1](./screenshots/game-time-left-editor-1.png)
![Game time left - Editor 2](./screenshots/game-time-left-editor-2.png)

[commits-shield]: https://img.shields.io/github/commit-activity/y/kirbo/ha-lovelace-elapsed-time-card.svg?style=for-the-badge
[commits]: https://github.com/kirbo/ha-lovelace-elapsed-time-card/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[discord]: https://discord.gg/5e9yvq
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/c/projects/frontend
[license-shield]: https://img.shields.io/github/license/kirbo/ha-lovelace-elapsed-time-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2020.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/kirbo/ha-lovelace-elapsed-time-card.svg?style=for-the-badge
[releases]: https://github.com/kirbo/ha-lovelace-elapsed-time-card/releases
