import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const GenreList=(props)=>{
    const {genres}=props
    let genres1=genres.substring(1,genres.length-1)
    genres1=genres1.split(',')
    // console.log(genres1,typeof(genres1))
    // genres1[0].substring(1,-1)
    let genres2=[genres1[0].substring(1,genres1[0].length-1)]
    for (let i=1;i<genres1.length;i++){
        genres2.push(genres1[i].substring(2,genres1[i].length-1));
    }
    const genre_clips=[]
    for (let i=0;i<genres1.length;i++){
        genre_clips.push(<Chip label={genres2[i]}/>)
    }

    return (
    <div 
        sx={{justifyContent:'center',maxWidth:"300",overflow:'scroll'}}
    >
      {genre_clips}
    </div>
  );
}

export default GenreList;