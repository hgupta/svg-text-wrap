# SVG Text Wrap like Neo4j
SVG Text Wrapping of long labels inside SVG figures like Neo4j. Currently only for circles.

### [**Codepen Demo**][codepen]

An example is also added to the project.
- Clone the repository
- `npm install` or `yarn`.
- Run the server. `npm run serve` or `yarn serve`
- Open `localhost:8080/example/` in browser

## Usage
```javascript
window.SVGTextWrap('long label to be wrapped'[, settings])
```
### Settings
- `splitter` - text splitting method, default: splits by `space`
- `radius` - radius of circle, default: 40
- `fontName` - default: `sans-serif`
- `fontSize` - in pixels (px), default: 10
- `lineHeight` - default, 12

### Returns
**Array of objects**:
- `rule` - `y` value inside circle's `xy` space
- `remainingWidth` - width of rule remaining after text added to the rule
- `text` - part of original label that can be fit into the rule

You can add more labels to test by modifying the `labels.js` file in the
`example` directory.

![example png](https://raw.githubusercontent.com/hgupta/svg-text-wrap/master/example/example.png)

## TODO
- Support rectangles / squares
- Support triangles

[codepen]: https://codepen.io/hgupta/full/KNqEyz/
