import {useState} from 'react'
import './App.css';
import InputList from './components/InputList/InputList';
import EventsListing from './components/EventsListing/EventListing';

import Stack from '@mui/material/Stack';

function App() {
  const [wordInput, setWordInput]=useState('')
  const [resList,setResList]=useState([]);

  // console.log(resList)
  return (
    <main className="container">
      <h1 className="row">Anime Search</h1>
        
      <div className="row-content">
        <InputList
              // setInput,setWordType,setLoading,setResult
          setInput={setWordInput}
          setResult={setResList}
        />
      </div>
      <Stack spacing={2} className="row-content">
        <EventsListing
              // word,searchType,wordList,setSavedList
            word={wordInput}
            resultList={resList}
        />
      </Stack>
    </main>
  );
}

export default App;
