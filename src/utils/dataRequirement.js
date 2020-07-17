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
import React from 'react'
import i18n from '../i18n'
import { Grid, Button, Segment } from 'semantic-ui-react'
export function calculateDataLevelRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  let elev = 0
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
      if (element === 'elevation') {
        if (levels[element] === 1) {
          elev = 1
        } else if (levels[element] === -1) {
          elev = -1
        }
      }
    }
  }

  if (counter > 1 && elev === 0) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Segment basic>{i18n.t('resultOptions.dataRequirements')}</Segment>
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.loose')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 2 && elev === 1) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Segment basic>{i18n.t('resultOptions.dataRequirements')}</Segment>
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.strict')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  } else {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Segment basic disabled>
            {i18n.t('resultOptions.dataRequirements')}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Button disabled fluid>
            {i18n.t('resultOptions.none')}
          </Button>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
