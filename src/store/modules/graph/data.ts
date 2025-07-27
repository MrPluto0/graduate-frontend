import { Circle } from '@antv/g';
import { CubicHorizontal, subStyleProps } from '@antv/g6';

export class FlyMarkerCubic extends CubicHorizontal {
  getMarkerStyle(attributes: any) {
    return { r: 5, fill: '#c3d5f9', offsetPath: this.shapeMap.key, ...subStyleProps(attributes, 'marker') };
  }

  onCreate() {
    const marker = this.upsert('marker', Circle, this.getMarkerStyle(this.attributes), this);
    marker?.animate([{ offsetDistance: 0 }, { offsetDistance: 1 }], {
      duration: 2000,
      iterations: Infinity
    });
  }
}
