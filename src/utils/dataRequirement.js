/**
 * This is the method used to determine if the vehicle needs a to give more data, meeting
 * more requirements increase the data that needs to be provided.
 * IF elevation NOT 0 AND (weight > 2 OR speed > 2) THEN “Strict”
 * IF elevation = 0 AND (weight <= 2 OR speed <= 2) OR use = commercial THEN “Less strict”
 * IF elevation = 0 AND weight <= 1 AND speed <= 1 AND use = personal THEN “None”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
export function calculateDataLevelRequired (levels, charge, elevation) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight' || element === 'speed') {
        if (levels[element] > 2) {
          counter = 2
          break
        } else if (levels[element] > 1) {
          counter = 1
          break
        } else {
          counter = 0
        }
      }
    }
  }
  if (counter === 2 || elevation !== 0) {
    counter = 2
  } else if (charge && elevation === 0) {
    counter = 1
  }
  return counter
}
