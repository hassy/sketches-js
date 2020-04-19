# sketches-js

![build status](https://circleci.com/gh/hassy/sketches-js.svg?style=svg)

An implementation of [DDSketch](https://www.datadoghq.com/blog/engineering/computing-accurate-percentiles-with-ddsketch/) for Node.js.

DDSketch is a data structure for recording large amounts of numeric data and calculating quantiles over that data. It's designed to be fast, fully-mergeable and provide guarantees that a quantile value is within a configurable percentage threshold of the real value.

## Implementation

The implementation is based on the official paper: [DDSketch: A Fast and Fully-Mergeable Quantile Sketch with Relative-Error Guarantees](http://www.vldb.org/pvldb/vol12/p2195-masson.pdf) (PDF)

## Usage

```sh
npm install sketches-js
```

```js
const { DDSketch } = require('sketches-js');

const sketch = new DDSketch({
  alpha: 0.005 // compute quantiles with precision of 1/2 of a percent
});

for (let i = 0; i < 1000; i++) {
  sketch.add(Math.random() * 1000);
}

[0.5, 0.75, 0.9, 0.95, 0.99].forEach(function(q) {
  console.log(`p${q * 100}: ${sketch.quantile(q)}`);
});
```

## License

The source code is distributed under the terms of MPL 2.0 license.
