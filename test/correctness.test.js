const test = require('ava');

const fs = require('fs');
const path = require('path');

const { DDSketch } = require('../index');

// Expected quantile values computed with the official sketches-go
// implementation.
const DATA = [
  {
    // 1000 numbers that follow a lognormal distribution
    fn: 'lognormal-n1000-1.txt',
    qs: {
      0.5: 55552,
      0.75: 119980,
      0.9: 220817,
      0.99: 650241
    }
  }
]


test('Correctness', t => {
  DATA.forEach(function(o) {
    const xs = fs.readFileSync(path.resolve(__dirname, 'data', o.fn), 'utf8')
          .split(',')
          .map((x) => parseInt(x));

    const sketch = new DDSketch({ alpha: 0.005 });

    xs.forEach((x) => {
      sketch.add(x);
    });

    Object.keys(o.qs).forEach((q) => {
      const v = Math.floor(sketch.quantile(q));
      t.true(v === o.qs[q]);
    });
  });
});
