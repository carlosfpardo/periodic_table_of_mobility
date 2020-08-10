import React from 'react'
import { Container, Header, Segment, Grid, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import CardCarousel from './CardCarousel'
import { Link } from 'react-router-dom'

Home.propTypes = {
  setVehicle: PropTypes.func
}
function Home ({ setVehicle }) {
  const { t } = useTranslation()
  return (
    <Container style={{ margin: 20 }}>
      <Segment attached="top">
        <Grid>
          <Grid.Row centered>
            <Header as="h1">{t('home.title')}</Header>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment attached="bottom">
        <Grid>
          <Grid.Row centered>
            <CardCarousel setVehicle={setVehicle} />
          </Grid.Row>
          <Grid.Row centered>
            <Header>{t('home.question')}</Header>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Link to="/policyRecomendations">
                <Button fluid>{t('home.button1')}</Button>
              </Link>
            </Grid.Column>
            <Grid.Column centered="true">
              <Link to="/city">
                <Button fluid>{t('home.button2')}</Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  )
}

export default Home
