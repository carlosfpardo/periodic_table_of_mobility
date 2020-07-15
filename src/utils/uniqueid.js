export function getNewVehicleId () {
  return (
    'vehicle_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

export function getNewGoalsId () {
  return (
    'goal_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}
