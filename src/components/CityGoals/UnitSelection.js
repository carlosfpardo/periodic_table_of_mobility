import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Segment, Grid } from 'semantic-ui-react'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from 'react-i18next'
import { fetchSingleAttribute, fetchUnits } from '../../utils/city'
import '../InputPanel/DataInput.css'

UnitSelection.propTypes = {
  attribId: PropTypes.number,
  cityId: PropTypes.number
}

function UnitSelection (props) {
  const { attribId, cityId } = props
  const [isLoadingProfiles, setLoadingProfiles] = useState(true)
  const [attribute, setAttribute] = useState({})
  const [units, setUnits] = useState('')
  useEffect(() => {
    async function fetchAttributes () {
      setLoadingProfiles(true)

      try {
        const profiles = await fetchSingleAttribute(attribId, cityId)
        if (profiles !== null) {
          const data = profiles[0]
          const unitid = data.units_id
          const profiles1 = await fetchUnits(unitid)
          setUnits(profiles1)
        }
        setAttribute(profiles)
      } catch (err) {
        console.error(err)
      }

      setLoadingProfiles(false)
    }
    fetchAttributes()
  }, [attribId, cityId])

  const { t } = useTranslation(['translation', 'attributes'])

  const htmlId = uniqueId('data-input_')

  return (
    <div className="box">
      <Grid>
        {isLoadingProfiles ? (
          ''
        ) : (
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment
                id={htmlId}
                content={t('translation:attributes.' + attribute[0].name)}
              />
            </Grid.Column>
            <Grid.Column>
              {units[0].value === '' ? (
                ''
              ) : (
                <Segment id={htmlId} content={units[0].value} />
              )}{' '}
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </div>
  )
}

export default UnitSelection
