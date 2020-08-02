/**
 * This is the method used to determine if the vehicle needs a drivers licence, at the moment it uses this formula
 * IF use = commercial OR automation > 2 OR elevation = 1 OR (weight > 1 AND speed > 2) THEN “Required”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import './utils.css'

export function calculateDriverLevelRequired (
  levels,
  charge,
  automation,
  elevation
) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  let res = false
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight' && levels[element] > 1) {
        counter++
      } else if (element === 'speed' && levels[element] > 2) {
        counter++
      }
    }
  }
  if (charge || automation > 2 || elevation === 1 || counter > 1) {
    res = true
  }
  return res
}
