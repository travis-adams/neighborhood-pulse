import React, { FunctionComponent, useEffect, useState } from "react";
import useStyles from "../css";
import Event from "../domain/Event";
import Comment from "../domain/Comment";
import Filters from "../domain/Filters";
import { Collapse, Card, CardContent, CardHeader, Typography, Divider,
  Link, IconButton, TextField, Button } from "@material-ui/core";
import { AccessTime, RoomOutlined, LinkOutlined, Close } from "@material-ui/icons";

interface Props {
  filters: Filters;
  event: Event;
  isEventExpanded: boolean;
  closeEvent: () => void;
  comments: Comment[];
  addComment: (eventId: number, text: string) => void;
  isSignedIn: boolean;
}

const EventExpansion: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [commentText, setCommentText] = useState<string>("");

  // unfortunate hackery is required here, since forcing the Collapse component to be 40% wide (width: "40% !important")
  // breaks the collapsing animation.
  const width: number  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const fortyPercent: string = (width * 0.4).toString() + "px";
  const fiftyPercent: string = (width * 0.5).toString() + "px";

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  }

  const clearComment = () => {
    setCommentText("");
  }

  const addComment = (text: string) => {
    props.addComment(props.event.id, text);
    clearComment();
  }

  useEffect(() => {
    if (props.isEventExpanded) {
      clearComment();
    }
  },[props.event, props.isEventExpanded]);

  return (
    <Collapse
      orientation="horizontal"
      in={props.isEventExpanded}
      className={classes.collapse}
    >
      <Card style={{width: props.filters.online ? fiftyPercent : fortyPercent, height: "100%", overflow: "auto"}}>
        <CardHeader
          title={props.event?.name}
          action={
            <IconButton onClick={() => props.closeEvent()}>
              <Close/>
            </IconButton>
          }
        />
        <CardContent>
          <Divider className={classes.marginTopMinus20}/>
          <div className={classes.eventFields}>
            <div className={classes.expandDate}>
              <AccessTime className={classes.marginRight10}/>
              <div className={classes.flexColumn}>
                <Typography variant="body1" component="p">
                  {props.event?.date.toString("D")}
                </Typography>
                <Typography variant="body1" component="p">
                  {props.event?.date.toString("t")}
                </Typography>
              </div>
            </div>
            {!props.filters.online &&
              <div className={classes.expandAddressAndLink}>
                <RoomOutlined className={classes.marginRight10}/>
                <div className={classes.flexColumn}>
                  <Typography variant="body1" component="p">
                    {props.event?.location}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {props.event?.address}
                  </Typography>
                </div>
              </div>
            }
            <div className={classes.expandAddressAndLink}>
              <LinkOutlined className={classes.marginRight10}/>
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
              <Typography className={classes.expandDesc} variant="body2" component="p">
                {props.event?.desc}
              </Typography>
              <Divider/>
            </div>
          }
          <div className={classes.commentSection}>
            <Typography variant="h6" component="h6">
              Comments
            </Typography>
            <div className={classes.marginTop10}>
              <TextField
                rows={2}
                multiline
                fullWidth
                variant="filled"
                placeholder={props.isSignedIn ? "Add a comment" : "Sign in to add a comment"}
                value={commentText}
                onChange={handleCommentChange}
                disabled={!props.isSignedIn}
              />
              {props.isSignedIn &&
                <div className={classes.commentActions}>
                  <Button
                    color="primary"
                    disabled={!commentText}
                    onClick={clearComment}
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
            {props?.comments.slice(0).reverse().map((comment: Comment, index: number) => {
              return (
                <div key={index}>
                  <Divider className={classes.marginTopBottom5}/>
                  <div className={classes.flexWithGap}>
                    <Typography variant="subtitle2" component="p">
                      {comment.username}
                    </Typography>
                    <Typography variant="body2" color={"textSecondary"} component="p">
                      {comment.timestamp.toString("F")}
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
