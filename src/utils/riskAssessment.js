/**
 * This is the method used to determine if the vehicle needs risk assessment to use, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * IF use = commercial OR weight > 2 OR speed > 2  OR exhaust-emissions efficiency > 2 OR elevation = 1 THEN “Required”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
export function calculateRisk (levels, elevation, charge) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = false
  if (array.length > 0) {
    for (const element of keys) {
      if (
        element === 'weight' ||
        element === 'emissions' ||
        element === 'speed'
      ) {
        if (levels[element] > 2) {
          counter = true
        }
      }
    }
  }
  return counter || elevation === 1 || charge
}
