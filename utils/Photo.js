class Photo {
  constructor(w, l) {
    this.w = w;
    this.l = l;
  }

  ratio() {
    return this.w / this.l;
  }

  isBetween(n, a, b) {
    return parseFloat(n - a) * parseFloat(n - b) <= 0;
  }

  get orientation() {
    if (this.isBetween(this.ratio(), 1.4, 1.8)) return 'landscape';
    if (this.isBetween(this.ratio(), 0.3, 0.8)) return 'portrait';
    if (this.isBetween(this.ratio(), 0.9, 1.3)) return 'square';
  }
}

export { Photo };
