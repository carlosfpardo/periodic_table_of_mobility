/**
 * This is the method used to determine if the vehicle needs a drivers licence, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import { DEFAULT_USE_CASE } from '../constants'
import React from 'react'
import i18n from '../i18n'
import { Grid, Segment } from 'semantic-ui-react'
import './utils.css'

export function calculateDriverLevelRequired (levels, useCase) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (useCase !== DEFAULT_USE_CASE && typeof useCase !== 'undefined') {
    counter++
  }
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight' && levels[element] > 1) {
        counter++
      } else if (element === 'speed' && levels[element] > 2) {
        counter++
      }
    }
  }

  if (counter > 1) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.driverLicense')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment color="red" inverted textAlign="center">
            {i18n.t('resultOptions.seeRequirements')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
  return (
    <Grid.Row columns={2}>
      <Grid.Column>
        <Segment basic textAlign="center">
          {i18n.t('resultOptions.driverLicense')}
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment textAlign="center">
          {i18n.t('resultOptions.notNecessary')}
        </Segment>
      </Grid.Column>
    </Grid.Row>
  )
}
