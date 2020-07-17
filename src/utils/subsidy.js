/**
 * This is the method used to determine if the vehicle needs for a price to be set for use, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * IF exhaust-emissions efficiency = 1 OR ILL-Health = 1 OR company = local NOT elevation = 1 THEN “YES”
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */

import React from 'react'
import i18n from '../i18n'
import { Grid, Segment, Button, Icon } from 'semantic-ui-react'
export function calculateSubsidyRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = false
  let elevation = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'emissions' || element === 'health') {
        if (levels[element] === 1) {
          counter = true
        }
      }
      if (element === 'elevation') {
        elevation = levels[element]
      }
      if (element === 'company' && levels[element] === 'local') counter = true
    }
  }

  return (
    <Grid.Row columns={2}>
      <Grid.Column>
        {counter && elevation !== 1 ? (
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.subsidy')} <Icon name="check" />
          </Segment>
        ) : (
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.subsidy')} <Icon name="check" />
          </Segment>
        )}
      </Grid.Column>
      <Grid.Column>
        {counter && elevation !== 1 ? (
          <Button fluid>{i18n.t('resultOptions.formRequest')}</Button>
        ) : (
          <Button disabled fluid>
            {i18n.t('resultOptions.none')}
          </Button>
        )}
      </Grid.Column>
    </Grid.Row>
  )
}
