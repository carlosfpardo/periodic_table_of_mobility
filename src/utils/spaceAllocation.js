/**
 * This is the method used to determine where the vehicle should move, meeting
 * more requirements changed the space that needs to be provided.
 * IF NOT elevation = 1 AND weight = 1 AND speed = 1 AND space efficiency = 1 AND exhaust-emissions efficiency = 1 AND ILL-Health = 1 AND automation = 0 THEN Position A
 * IF NOT elevation = 1 AND speed <= 2 AND space efficiency <= 2 AND exhaust-emissions efficiency <= 2 AND automation <= 2 THEN position C
 * IF speed >2 OR space efficiency >2 OR exhaust-emissions efficiency >2 OR automation >2 OR elevation = 1 THEN position D

 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
export function calculateSpaceRequired (levels, elevation, automation) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counterA = 0
  let counterC = 0
  let counterD = false
  const space = {}
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight') {
        if (levels[element] !== 1) {
          counterA++
        }
      } else if (element === 'health') {
        if (levels[element] !== 1) {
          counterA++
        }
      } else if (element === 'speed') {
        if (levels[element] === 1) {
        } else if (levels[element] === 2) {
          counterA++
        } else {
          counterA++
          counterC++
          counterD = true
        }
      } else if (element === 'footprint') {
        if (levels[element] === 1) {
        } else if (levels[element] === 2) {
          counterA++
        } else {
          counterA++
          counterC++
          counterD = true
        }
      } else if (element === 'emissions') {
        if (levels[element] === 1) {
        } else if (levels[element] === 2) {
          counterA++
        } else {
          counterA++
          counterC++
          counterD = true
        }
      }
    }
  }
  if (automation !== 0) {
    counterA++
  }
  if (automation > 2) {
    counterC++
    counterD = true
  }
  if (counterA === 0 && elevation !== 1) {
    space[0] = true
  } else space[0] = false
  if (counterC === 0 && elevation !== 1 && counterA !== 0) {
    space[1] = true
  } else space[1] = false
  space[2] = counterD || elevation === 1

  return space
}
