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
    <div className="App">
      <Container style={{ margin: 20 }}>
        <Segment attached="top">
          <Grid>
            <Grid.Row centered>
              <Header as="h1">
                {t('home.title')}
                <Header.Subheader>{t('home.subtitle')}</Header.Subheader>
              </Header>
              <p>
                {t('home.part1')}
                <a
                  href="https://docs.google.com/document/d/12ScqqGQSCZSE1zgaixuP0Bmj3tuMna_z6HjODMeJiIE/edit#heading=h.7eer7omi37fl"
                  rel="noreferrer"
                >
                  {t('home.link')}
                </a>
              </p>
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
              {/* <Grid.Column centered="true">
                <Link to="/city">
                  <Button fluid>{t('home.button2')}</Button>
                </Link>
              </Grid.Column> */}
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    </div>
  )
}

export default Home
