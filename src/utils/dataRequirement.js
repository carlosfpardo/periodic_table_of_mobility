/**
 * This is the method used to determine if the vehicle needs a to give more data, meeting
 * more requirements increase the data that needs to be provided.
 * IF weight > 2 OR speed > 2 AND elevation = 1 THEN “Strict”
 * IF weight > 1 OR speed > 1 AND elevation = 0 THEN “Loose”
 * IF weight <= 1 OR speed <= 1  AND elevation = 0 THEN “None”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
export function calculateDataLevelRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight' || element === 'speed') {
        if (levels[element] > 2) {
          counter = 2
        } else if (levels[element] > 1) {
          counter = 1
        } else {
          counter = 0
        }
      }
    }
  }
  return counter
}
