# directions-icons

### [Download zip of icons](https://github.com/mapbox/directions-icons/raw/master/src/icons.zip)

Standard set icons used for the v5 Mapbox Directions API.

On every directions API response there is a `maneuver` object on each step. Within the maneuver object, there are `modifier` and `type` keys. These keys are concatenated together with a `_`  and prefixed with `direction_` to form an icon string that maps 1:1 with the icons in this repository.

```
{
    "maneuver": {
        "type": "turn",
        "location": {
            "type": "Point",
            "coordinates": [
                -122.447702,
                37.791708
            ]
        },
        "modifier": "left",
        "instruction": "Turn left onto Presidio Avenue"
    },
    "distance": 558,
    "duration": 53,
    "way_name": "Presidio Avenue",
    "direction": "S",
    "heading": 171,
    "mode": "driving"
}
```

> The icons for this step would be `direction_turn_left.png`.

In cases where there is not a `modifier` the icon would be the `type` + `.png`. Example:

```
{
    "maneuver": {
        "type": "continue",
        "location": {
            "type": "Point",
            "coordinates": [
                -122.447702,
                37.791708
            ]
        },
        "instruction": "Continue onto Presidio Avenue"
    },
    "distance": 558,
    "duration": 53,
    "way_name": "Presidio Avenue",
    "direction": "S",
    "heading": 171,
    "mode": "driving"
}
```

> The-icons for this step would be `direction_continue.png`.

### Icons

To see available icons, see [icons.md](./icons.md)

### Install and Usage

```
git clone https://github.com/mapbox/directions-icons.git
cd directions-icons
npm install
npm start
```

### Custom colors

In [`index.js`](./index.js) you can add to the `colors` object:

```
var colors = [{
    name: 'dark',
    color: '#000'
}, {
    name: 'light',
    color: '#fff'
}];
```

Simply add a new `name` and and new `color` and re-run with `npm start`. This will create a new folder color name and an updated zip.


### Adding a new icon

To add a new icon:

1. Create an svg
1. Name it `type_modifier` and save it to `src/svg/`. Example: `turn_left.svg`
1. run `node index.js`
