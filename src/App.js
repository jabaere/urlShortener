import React from 'react';
import {Grid} from '@material-ui/core'
import './App.css';
import UrlGenerator from './components/urlGenerate'
function App() {
  return (
    <Grid className="App" container direction='column' justifyContent='center' alignItems='center' >
     <h1>URL shortener</h1>
     <UrlGenerator/>
    </Grid>
  );
}

export default App;
