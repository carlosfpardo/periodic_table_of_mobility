import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid, Divider, Menu, Dropdown /* Input */ } from 'semantic-ui-react'
// import { ReactComponent as NUMOLogo } from './images/logo_numo.svg'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import ResultPage from './components/ResultPanel/ResultPage'
import Attributes from './components/CityGoals/Attributes'
import Home from './components/Home/Home'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CityGoals from './components/CityGoals/CityGoals'
import Thresholds from './components/CityGoals/Thresholds'
Page.propTypes = {
  vehicle: PropTypes.any,
  setVehicle: PropTypes.any
}
// page uses the hook
function Page ({ vehicle, setVehicle }) {
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
      </Grid>
    </div>
  )
}
function AppRouter () {
  const [vehicle, setVehicle] = useState({})
  const [attributes, setAttributes] = useState([])
  const [city, setCity] = useState({})
  const [cityId, setCityid] = useState({})
  const { t, i18n } = useTranslation()
  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }
  return (
    <Router>
      <div>
        <Menu secondary>
          <Menu.Item>
            <Link to="/">{t('routing.home')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/vehicles">{t('routing.simpleModel')}</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/policyRecomendations">{t('routing.fullRecs')}</Link>
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
            <CityGoals city={city} setCity={setCity} setCityid={setCityid} />
          </Route>
          <Route path="/attributes">
            <Grid stackable>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Attributes
                    city={city}
                    cityId={cityId}
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
                  <Thresholds
                    attributes={attributes}
                    setAttributes={setAttributes}
                    cityId={cityId}
                    city={city}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Route>
          <Route exact path="/">
            <Home setVehicle={setVehicle} />
          </Route>
          <Route path="/vehicles">
            <Page vehicle={vehicle} setVehicle={setVehicle} />
          </Route>
          <Route
            path="/driversURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/driversNotURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/operatingURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/dataStrictURL"
            component={() => {
              window.location.replace('https://policydata.numo.global/')
              return null
            }}
          />
          <Route
            path="/dataLooseURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/dataNoneURL"
            component={() => {
              window.location.replace('https://policydata.numo.global/')
              return null
            }}
          />
          <Route
            path="/priceHighURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/priceLowURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/subsidyURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
          <Route
            path="/riskURL"
            component={() => {
              window.location.replace('https://www.numo.global/')
              return null
            }}
          />
        </Switch>
        {/* Branding / credits. Leave this at the bottom! */}
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Divider />
              <Footer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
