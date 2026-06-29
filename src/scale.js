export function pxPerMmFromCalibration(pixelDistance, realMm) {
  if (!(realMm > 0)) return 0;
  return pixelDistance / realMm;
}

export function pxToMm(px, pxPerMm) {
  if (!(pxPerMm > 0)) return 0;
  return px / pxPerMm;
}

export function mmToPx(mm, pxPerMm) {
  return mm * pxPerMm;
}
