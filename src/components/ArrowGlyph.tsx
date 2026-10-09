import React from 'react';
import Svg, { G, Polygon } from 'react-native-svg';
import { Dir, DIR_ROTATION } from '../utils/grid';

type Props = {
  dir: Dir;
  size: number;
  color: string;
};

/**
 * rule #15 — every arrow in this app is drawn, never typed. The Roboto
 * fallback renders the arrow codepoints as ":" or tofu on Android.
 */
function ArrowGlyphImpl({ dir, size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G rotation={DIR_ROTATION[dir]} origin="12, 12">
        <Polygon
          points="12,2.5 20.5,13 15,13 15,21.5 9,21.5 9,13 3.5,13"
          fill={color}
        />
      </G>
    </Svg>
  );
}

export const ArrowGlyph = React.memo(ArrowGlyphImpl);
export default ArrowGlyph;
