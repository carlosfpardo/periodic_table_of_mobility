import React, { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Divider, Menu, Dropdown /* Input */ } from 'semantic-ui-react'
// import { ReactComponent as NUMOLogo } from './images/logo_numo.svg'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import ResultPage from './components/ResultPanel/ResultPage'
import Attributes from './components/CityGoals/Attributes'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CityGoals from './components/CityGoals/CityGoals'
import Thresholds from './components/CityGoals/Thresholds'

// page uses the hook
function Page () {
  const [vehicle, setVehicle] = useState({})
  return (
    <div className="App">
      <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <InputPanel vehicle={vehicle} setVehicle={setVehicle} />
          </Grid.Column>
          <Grid.Column width={7}>
            <ResultPanel vehicle={vehicle} />
          </Grid.Column>
        </Grid.Row>

        {/* Branding / credits. Leave this at the bottom! */}
        <Grid.Row columns={1}>
          <Grid.Column>
            <Divider />
            <Footer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}
function AppRouter () {
  const [vehicle, setVehicle] = useState({})
  const [attributes, setAttributes] = useState({})
  const [city, setCity] = useState({})
  const { t, i18n } = useTranslation()
  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }
  return (
    <Router>
      <div>
        <Menu huge secondary>
          <Menu.Item href="/">
            {/* <NUMOLogo
              style={{
                height: '2.5em'
              }}
            /> */}
          </Menu.Item>
          <Menu.Item>
            <Link to="/">{t('routing.profiles')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/policyRecomendations">{t('routing.results')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/city">{t('routing.city')}</Link>
          </Menu.Item>
          <Dropdown item text={t('language')}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => changeLanguage('en')}>
                English
              </Dropdown.Item>
              <Dropdown.Item onClick={() => changeLanguage('es')}>
                Español
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/*
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
            <Menu.Item name="logout" />
          </Menu.Menu> */}
        </Menu>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/policyRecomendations">
            <Grid stackable>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <ResultPage vehicle={vehicle} setVehicle={setVehicle} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Route>
          <Route path="/city">
            <CityGoals setCity={setCity} />
          </Route>
          <Route path="/attributes">
            <Grid stackable>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Attributes
                    city={city}
                    attributes={attributes}
                    setAttributes={setAttributes}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Route>
          <Route path="/thresholds">
            <Grid stackable>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Thresholds attributes={attributes} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Route>
          <Route exact path="/">
            <Page />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
)

// here app catches the suspense from page in case translations are not yet loaded
export default function App () {
  return (
    <Suspense fallback={<Loader />}>
      <AppRouter />
    </Suspense>
  )
}
