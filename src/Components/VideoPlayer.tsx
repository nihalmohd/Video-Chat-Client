import React, { useContext, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Paper } from '@material-ui/core';
import { socketContext} from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const VideoPlayer: React.FC = () => {
  const context = useContext(socketContext);
  const classes = useStyles();
  // const videoRef = useRef <any>(null);

  
  


  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = context;
  console.log(stream,"VideoPlaye");
  
  if (!context) {
    return <div></div>;
  }

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant='h5' gutterBottom>
              {name || "Name"}
            </Typography>
            <video playsInline muted ref={myVideo} id='kunjaappu' autoPlay className={classes.video} />
          </Grid> 
        </Paper>
      )}

      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant='h5' gutterBottom>
              {call.name || "Name"}
            </Typography>
            <video playsInline ref={userVideo} className={classes.video} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
