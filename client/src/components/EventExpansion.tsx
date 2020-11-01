import React, { FunctionComponent, useEffect, useState } from 'react';
import useStyles from '../css';
import Event from '../domain/Event';
import Comment from "../domain/Comment";
import { Collapse, Card, CardContent, CardHeader, Typography, Divider,
  Link, IconButton, TextField, Button } from '@material-ui/core';
import { AccessTime, RoomOutlined, LinkOutlined, Close } from '@material-ui/icons';

interface Props {
  event: Event;
  isEventExpanded: boolean;
  closeEvent: () => void;
  comments: Comment[];
  addComment: (text: string) => void;
  signedIn: boolean;
}

const EventExpansion: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [commentText, setCommentText] = useState<string>("");

  // unfortunate hackery is required here, since forcing the Collapse component to be 40% wide (width: '40% !important')
  // breaks the collapsing animation. hopefully we can fix this
  const width: number  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const fortyPercent: string = (width * 0.4).toString() + 'px';

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  }

  const clearComment = () => {
    setCommentText("");
  }

  const addComment = (text: string) => {
    props.addComment(text);
    clearComment();
  }

  useEffect(() => {
    setCommentText("");
  },[props.event]);

  return (
    <Collapse
      orientation="horizontal"
      in={props.isEventExpanded}
      className={classes.collapse}
    >
      <Card style={{width: fortyPercent, height: '100%', overflow: 'auto'}} >
        <CardHeader
          title={props.event?.name}
          action={
            <IconButton onClick={() => props.closeEvent()}>
              <Close/>
            </IconButton>
          }
        />
        <CardContent>
          <div style={{marginTop: -18}} />
          <Divider/>
          <div style={{display: 'flex', flexDirection: 'column', paddingTop: 15, paddingBottom: 15}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <AccessTime style={{marginRight: 10}} />
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="body1" component="p">
                  {props.event?.date.toDateString()}
                </Typography>
                <Typography variant="body1" component="p">
                  {props.event?.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true})}
                </Typography>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', paddingTop: 15, paddingBottom: 15}}>
              <RoomOutlined style={{marginRight: 10}}/>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="body1" component="p">
                  {props.event?.location}
                </Typography>
                <Typography variant="body1" component="p">
                  {props.event?.address}
                </Typography>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <LinkOutlined style={{marginRight: 10}}/>
              <Typography variant="body1" component="p">
                <Link target="_blank" rel="noopener noreferrer" href={props.event?.link}>
                  {props.event?.link}
                </Link>
              </Typography>
            </div>
          </div>
          <Divider/>
          {props.event?.desc &&
            <div>
              <div style={{paddingBottom: 15}} />
              <Typography variant="body2" component="p">
                {props.event?.desc}
              </Typography>
              <div style={{paddingTop: 15}} />
              <Divider/>
            </div>
          }
          <div style={{paddingBottom: 10}} />
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h6" component="h6">
              Comments
            </Typography>
            <div style={{paddingBottom: 7}} />
            <div>
              <TextField
                rows={2}
                multiline
                fullWidth
                variant="filled"
                placeholder={props.signedIn ? "Add a comment" : "Sign in to add a comment"}
                value={commentText}
                onChange={handleCommentChange}
                disabled={!props.signedIn}
              />
              {props.signedIn &&
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 5}}>
                  <Button
                    color="primary"
                    disabled={!commentText}
                    onClick={() => clearComment()}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!commentText}
                    className={classes.commentButton}
                    onClick={() => addComment(commentText)}
                  >
                    Comment
                  </Button>
                </div>
              }
            </div>
            {props.comments.slice(0).reverse().map((comment: Comment, index: number) => {
              return (
                <div key={index}>
                  <div style={{marginTop: 5}}/>
                  <Divider/>
                  <div style={{marginBottom: 5}}/>
                  <div style={{display: 'flex'}}>
                    <Typography variant="subtitle2" component="p" style={{marginRight: 'auto'}}>
                      {comment.username}
                    </Typography>
                    <Typography variant="body2" color={'textSecondary'} component="p" style={{marginLeft: 'auto'}}>
                      {comment.timestamp.toDateString() + ' ' + comment.timestamp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true})}
                    </Typography>
                  </div>
                  <Typography variant="body1" component="p">
                    {comment.text}
                  </Typography>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </Collapse>
  );
}

export default EventExpansion;
