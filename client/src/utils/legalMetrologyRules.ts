/**
 * Calculates Principal Display Panel (PDP) Surface Area under Legal Metrology Rules, 2011.
 */
export function calculatePDPArea(
  shape: 'box' | 'cylinder' | 'pouch' | 'custom',
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  diameterCm: number
): { areaCm2: number; ruleCitation: string } {
  switch (shape) {
    case 'box': {
      const area = lengthCm * widthCm;
      return {
        areaCm2: Math.round(area * 100) / 100,
        ruleCitation: 'Rule 5(1): Rectangular PDP surface area (Length x Height)',
      };
    }
    case 'cylinder': {
      const area = 0.40 * Math.PI * diameterCm * heightCm;
      return {
        areaCm2: Math.round(area * 100) / 100,
        ruleCitation: 'Rule 5(2): Cylindrical package PDP (40% of total side surface area)',
      };
    }
    case 'pouch': {
      const area = 0.80 * lengthCm * widthCm;
      return {
        areaCm2: Math.round(area * 100) / 100,
        ruleCitation: 'Rule 5(3): Flexible pouch PDP (80% of length x width boundary)',
      };
    }
    case 'custom':
    default: {
      const area = lengthCm * widthCm;
      return {
        areaCm2: Math.round(area * 100) / 100,
        ruleCitation: 'Rule 5(4): Custom container PDP area specification',
      };
    }
  }
}

/**
 * Looks up Table I of Legal Metrology (Packaged Commodities) Rules, 2011
 * for minimum required font height of numerals & letters (in mm).
 */
export function getRequiredFontHeightMm(pdpAreaCm2: number): number {
  if (pdpAreaCm2 <= 50) return 1.0;
  if (pdpAreaCm2 <= 100) return 1.5;
  if (pdpAreaCm2 <= 500) return 2.5;
  if (pdpAreaCm2 <= 2500) return 4.0;
  return 6.0;
}
