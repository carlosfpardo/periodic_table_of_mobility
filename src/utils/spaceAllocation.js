/**
 * This is the method used to determine where the vehicle should move, meeting
 * more requirements changed the space that needs to be provided.
 * IF weight = 1 AND speed = 1 AND space efficiency = 1 AND exhaust-emissions efficiency = 1 AND ILL-Health = 1 AND Automation = 0 NOT elevation = 1 THEN position A
 * IF (speed <= 2 AND space efficiency <=2 AND exhaust-emissions efficiency <=2) AND (state of movement = at the curb doing PUDO) AND Automation = ALL OR elevation = 1 THEN position B
 * IF speed = 2 AND space efficiency = 2 AND exhaust-emissions efficiency = 2 AND Automation  <= 2 NOT elevation = 1 THEN position C
 * IF speed >=3 OR space efficiency >=3 OR exhaust-emissions efficiency >=3 AND Automation = ALL OR elevation = 1 THEN position D
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import React from 'react'
import i18n from '../i18n'
import { Grid, Segment, Modal, Header } from 'semantic-ui-react'
export function calculateSpaceRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counterA = false
  let counterC = false
  let counterD = false
  let elevation = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (element === 'weight') {
        if (levels[element] === 1) {
          counterA = true
        } else {
          counterA = false
        }
      }
      if (element === 'elevation') {
        elevation = levels[element]
      }
      if (element === 'health') {
        if (levels[element] === 1) {
          counterA = true
        } else {
          counterA = false
        }
      } else if (element === 'speed') {
        if (levels[element] === 1) {
          counterA = true
          counterC = false
          counterD = false
        } else if (levels[element] === 2) {
          counterA = false
          counterC = true
          counterD = false
        } else {
          counterA = false
          counterC = false
          counterD = true
        }
      } else if (element === 'footprint') {
        if (levels[element] === 1) {
          counterA = true
          counterC = false
          counterD = false
        } else if (levels[element] === 2) {
          counterA = false
          counterC = true
          counterD = false
        } else {
          counterA = false
          counterC = false
          counterD = true
        }
      } else if (element === 'automation') {
        if (levels[element] !== 0) {
          counterA = false
        }
        if (levels[element] > 2) {
          counterC = false
        }
      } else if (element === 'emissions') {
        if (levels[element] === 1) {
          counterA = true
          counterC = false
          counterD = false
        } else if (levels[element] === 2) {
          counterA = false
          counterC = true
          counterD = false
        } else {
          counterA = false
          counterC = false
          counterD = true
        }
      }
    }
  }

  return (
    <Grid.Row columns={4}>
      <Grid.Column textAlign="center">
        {counterA && elevation !== 1 ? (
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        ) : (
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        )}
      </Grid.Column>
      <Grid.Column textAlign="center">
        <Modal
          trigger={
            <Segment basic textAlign="center">
              {i18n.t('resultOptions.nextPUDO')}
            </Segment>
          }
        >
          <Modal.Header>Has caveats</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>
                Most vehicles only have PUDO (pick-up dropoff) privilages in
                this area
              </Header>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Grid.Column>
      <Grid.Column textAlign="center">
        {counterC && elevation !== 1 ? (
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        ) : (
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        )}
      </Grid.Column>
      <Grid.Column textAlign="center">
        {elevation === 1 || counterD ? (
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        ) : (
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        )}
      </Grid.Column>
    </Grid.Row>
  )
}
