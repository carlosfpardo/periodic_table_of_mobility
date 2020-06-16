import React, { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Divider } from 'semantic-ui-react'
import Header from './components/Header'
import Footer from './components/Footer'
import InputPanel from './components/InputPanel/InputPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'
import './App.css'

// page uses the hook
function Page () {
  const [vehicle, setVehicle] = useState({})
  const { t, i18n } = useTranslation()

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="App">
      <div className="App-header">
        <button onClick={() => changeLanguage('es')}>es</button>
        <button onClick={() => changeLanguage('en')}>en</button>
      </div>
      <div className="App-intro" />
      <div>{t('description.part2')}</div>
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
      <Page />
    </Suspense>
  )
}
