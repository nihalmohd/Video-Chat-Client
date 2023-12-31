import React from 'react'
import VideoPlayer from './Components/VideoPlayer'
import Options from './Components/Options'
import Notification from './Components/Notification'
import { Typography ,AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyles=makeStyles((theme)=>({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));
const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper} >
     <AppBar className={classes.appBar} position='static' color='inherit'>
        <Typography variant='h2' align='center' >video chat</Typography>
     </AppBar>
     <VideoPlayer/>
     <Options childern={<Notification/>}/>
    </div>
  )
}

export default App
