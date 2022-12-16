import { useState } from "react";
import './EventListing.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';

import GenreList from "../genreList/genreList";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const EventsListing=(props)=>{
    const {word,resultList}=props;

    const generateList=()=>{
        let returned_list=[]
        // console.log(resultList)
    
        if (resultList[0]=='error'){
            returned_list.push(<h2>Sorry we couldn't find any related anime</h2>)
        }
        else{
            resultList.map((element,idx)=>{
                returned_list.push(
                    <Item className="search-result-item" key={idx}>
                        <div className="search-result-text">
                            <h1>{element.title}</h1>
                            <GenreList genres={element.genre} />
                            <div className="search-result-content">{element.synopsis}</div>
                        </div>
                        <div className="search-result-img">
                            <img src={element.img_url}></img>
                        </div>
                        
                    </Item>
                )
            })
        }
        return returned_list;
        
    }
    return(
        <div>
            <ul>
                {generateList()}
            </ul>
        </div>
    )
}
export default EventsListing;