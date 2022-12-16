import { useState } from "react";

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';


const InputList=(props)=>{
    const {setInput,setResult}=props;
    const [inputWord,setInputWord]=useState('');
    const [resList,setResList]=useState([])

    const getAnimes=()=>{
        if (inputWord!==''){
            let base_url='http://127.0.0.1:5000/search/';
            const inputWord1=inputWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
            // console.log(inputWord1)
            let postData={
                query:inputWord1
        }
        fetch(base_url,
            {
                method:'POST',
                mode:"cors",
                body:JSON.stringify(postData)
            }).then((response)=>{
                // console.log(response)
                if (response.status==500){
                    return ['error']
                }else{
                    return response.json()
                }
            })
            .then((json)=>{
                console.log('json: ',json)
                setResult(json);
            })
        }
        updateResult();
    }
    
    const updateResult=()=>{
        if (resList.length===0){
            setInput("");
            setResult([])
        }
        else {
            setInput(inputWord);
        }
        setInput(inputWord);
    }

    const keyDownHandler = (e) => {
        
        if (e.key === 'Enter') {
            e.preventDefault()
            getAnimes();
        }
    }

    return(
        <div>
            {/* <input className="form-control" type="text" placeholder="Enter query" id="word_input"
                   value={inputWord}
                   onChange={(e) => setInputWord(e.target.value)}
                   onKeyDown={keyDownHandler}
            /> */}

            <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
            
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Enter query" 
                // id="word_input"
                // inputProps={{ 'aria-label': 'enter a query' }}
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                onKeyDown={keyDownHandler}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                id="show_animes" className="btn btn-primary" onClick={getAnimes}
            >
                <SearchIcon />
            </IconButton>
            </Paper>



            {/* <button id="show_animes" type="button" className="btn btn-primary" onClick={getAnimes}>Search Animes</button> */}
        </div>
    )
}

export default InputList;