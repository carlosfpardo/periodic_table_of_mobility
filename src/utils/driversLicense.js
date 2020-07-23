/**
 * This is the method used to determine if the vehicle needs a drivers licence, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import './utils.css'

export function calculateDriverLevelRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight' && levels[element] > 1) {
        counter++
      } else if (element === 'speed' && levels[element] > 2) {
        counter++
      }
    }
  }
  return counter
}
