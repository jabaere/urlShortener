import React, {useState} from 'react'
import {TextField,Button,CircularProgress } from '@material-ui/core'
import urlApi from '../api/urlApi'
import {RiFileCopyLine} from "react-icons/ri";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({

  snack: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  snackBarColor:{
    backgroundColor:'red'
  },
  bar: {
    position: 'relative',
    height: '2px',
    width: '500px',
    margin: '0 auto',
    background: '#fff',
    marginTop: '150px',
  },
  circle: {
    position: 'absolute',
    top: '-30px',
    marginLeft: '-30px',
    height: '60px',
    width: '60px',
    left: '0',
    background: '#fff',
    borderRadius: '30%',
    webkitAnimation: 'move 5s infinite'
  },
  p: {
    position: 'absolute',
    top: '-35px',
    right: '-85px',
    textTransform: 'uppercase',
    color: '#347fc3',
    fontFamily: 'helvetica, sans-serif',
    fontWeight: 'bold'
  }
  
      
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UrlGenerator = () => {
  const [link, setLink] = useState('')
  const [shortUrl,setShortUrl] = useState('')
  const [long,setLong] = useState('')
  const [loading,setLoading] = useState(false)
  const [openSnack, setOpenSnack] = React.useState(false);
  const [status,setStatus] = useState('')
  const regex =  /^(ftp|http|https):\/\/[^ "]+$/;
  const classes = useStyles();
  const [buttonStatus, setButtonStatus] = useState(true);
  const [searchText, setSearchText] = React.useState("Generate");
 
const handleInput = (e) => {
setLink(e.target.value)
if(!regex.test(e.target.value) && e.target.value.length !== 0){
  setSearchText(<span style={{color:'black'}}>Please enter valid URL</span>)
  setButtonStatus(true)
}else if(regex.test(e.target.value)){
  setButtonStatus(false)
}else{
  setSearchText('Generate')
  setButtonStatus(true)
}
}

const handleCloseSnack = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setOpenSnack(false);
};

const handleSubmit = (e)  => {
setShortUrl('')
e.preventDefault();
getData();
setLoading(!loading)
setLink('')
}

const getData = async () => {

await urlApi
.get(`shorten?url=${link}`)
.then((response) => {
  console.log(response)
setShortUrl(response.data.result.short_link)
setLong(response.data.result.original_link)
setLoading(false)
})
.catch((err) => {
  console.log(err)
})
}
async function copy(event){

  let copyText = await document.getElementById("myText").innerText;
   if(navigator.clipboard){
   navigator.clipboard.writeText(copyText).then(()=>{
     setOpenSnack(true);
   },(err)=>{
     console.log('failed to copy text', err)
   })
 }

 
 }

  return(
    <>
    <form style={{display:'flex', alignItems:'center'}} onSubmit={(e)=> handleSubmit(e)}>
      <TextField
      label='your link'
      variant='outlined'
      value={link}
      onChange={handleInput}
      color='secondary'
      style={{marginRight:'10px'}}
      />
      {!loading && (
        <Button  disabled = {buttonStatus} variant='contained' color='secondary' onClick={(e) => handleSubmit(e)} style={{height:'55px'}}>{searchText}</Button>
      )}

      {loading && <CircularProgress color="secondary"/>}
      
    </form>

    {loading && 



<div className="bar">
  <div className="circle"></div>
  <p className='pdd'>Please Wait...</p>
</div>



}
    {shortUrl && (
      <div style={{display:'flex', flexDirection:'column', marginTop:'50px'}}>
      <div style={{marginBottom:'10px', display:'flex'}}>
      Short Link :  
      <span style={{marginLeft:'10px',fontWeight:'bold'}}>
      <a
         rel="noopener noreferrer"
         href={shortUrl}
         target='_blank'
         id='myText'
         style={{
           color:'#E9D758',
           textDecoration:'none'
                }}
        >
                  
                  {shortUrl}
        </a>

      </span>
                
           <span style={{display:'flex', alignSelf:'end'}}><RiFileCopyLine 
                style={{marginLeft:'10px',color:'black',cursor:'pointer'}} 
                onClick={copy}/>
            </span>
      </div>
      <div>
           Original Url : <span style={{marginLeft:'10px',color:'#E9D758',cursor:'pointer',fontWeight:'bold'}}>{long}</span>
      </div>
      </div>
    )

    }
    <div className={classes.snack}>
     
     <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleCloseSnack} >
       <Alert onClose={handleCloseSnack} severity="success">
         URL Copied!
       </Alert>
     </Snackbar>
    </div>
    </>
  )
}

export default UrlGenerator