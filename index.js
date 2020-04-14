/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class DDSketch {
  constructor(opts) {
    this.alpha = opts.alpha;
    this.bins = {};

    this.maxNumBins = opts.maxNumBins || 2048;
    this.n = 0;
    this.gamma = (1 + this.alpha) / (1 - this.alpha);

    this.numBins = 0;
  }

  collapseBins() {
    // Collapse two smallest bins if needed
    const bucketIndices = Object.keys(this.bins).sort((a, b) => a - b);

    if (bucketIndices.length > this.maxNumBins) {
      const i0 = bucketIndices.find((i) => this.bins[i] > 0);
      const i1 = bucketIndices.find((i) => this.bins[i] > 0 && i > i0);
      this.bins[i1] += this.bins[i0];
      this.bins[i0] = 0;
    }
  }

  add(x) {
    const i = Math.ceil(Math.log10(x) / Math.log10(this.gamma));
    if (!this.bins[i]) {
      this.bins[i] = 0;
      this.numBins++;
    }
    this.bins[i]++;
    this.n++;

    if (this.numBins > this.maxNumBins) {
      this.collapseBins();
    }
  }

  quantile(q) {
    const binIndices = Object.keys(this.bins).sort((a, b) => a - b);
    let count = 0;
    let i = 0;

    const rankX = q * (this.n - 1);
    while(count <= rankX) {
      count += this.bins[binIndices[i]];
      i++;
    }

    i--;

    return (2 * Math.pow(this.gamma, binIndices[i])) / (this.gamma + 1);
  }

  merge(other) {
    if (this.alpha !== other.alpha) {
      throw new Error('Alpha values must be the same to merge two sketches');
    }

    Object.keys(other.bins).forEach((i) => {
      if (this.bins[i]) {
        this.bins[i] += other.bins[i];
      } else {
        this.numBins++;
        this.bins[i] = other.bins[i];
      }
      this.n += other.bins[i];
    });

    if (this.numBins > this.maxNumBins) {
      this.collapseBins();
    }
  }
}

module.exports = { DDSketch };
