import React, { FunctionComponent, useState, useEffect } from "react";
import { Button, TextField, Dialog, IconButton, Card, CardContent, CardHeader, Grid,
  Select, InputLabel, MenuItem, FormControl } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Close } from "@material-ui/icons";
import EventService from "../service/EventService";
import useStyles from "../css";
import User from "../domain/User";
import Group from "../domain/Group";

interface Props {
  open: boolean;
  setOpen: (bool: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  groups: Group[]
  token: string;
}

const eventService = new EventService();

const UserInfoWindow: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [group, setGroup] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  // validation
  const [firstNameValid, setFirstNameValid] = useState<boolean>(true);
  const [lastNameValid, setLastNameValid] = useState<boolean>(true);
  const [groupValid, setGroupValid] = useState<boolean>(true);
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
    setFirstNameValid(true);
  }

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
    setLastNameValid(true);
  }

  const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroup(event.target.value);
    setGroupValid(true);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setUsernameValid(true);
  }

  const resetFields = () => {
    // fields
    if (props.user) {
      setFirstName(props.user.firstName);
      setLastName(props.user.lastName);
      setGroup(props.user.groupId.toString());
      setUsername(props.user.username)
    }
    // validation
    setFirstNameValid(true);
    setLastNameValid(true);
    setGroupValid(true);
    setUsernameValid(true);
    setErrorMessage("");
 }

  const close = () => {
    props.setOpen(false);
    cancelEditing();
  }

  const startEditing = () => {
    setIsEditing(true);
  }

  const cancelEditing = () => {
    resetFields();
    setIsEditing(false);
  }

  // Handles modifying the user's info
  const submitUserEdit = async () => {
    try {
      let fieldsMissing = false;
      if (firstName == null || firstName == "") {
        fieldsMissing = true;
        setFirstNameValid(false);
      }
      if (lastName == null || lastName == "") {
        fieldsMissing = true;
        setLastNameValid(false);
      }
      if (group == null || group == "") {
        fieldsMissing = true;
        setGroupValid(false);
      }
      if (username == null || username == "") {
        fieldsMissing = true;
        setUsernameValid(false);
      }
      if (fieldsMissing) {
        throw new Error("All fields are required.");
      }
      let noChanges = (firstName == props.user.firstName
                    && lastName == props.user.lastName
                    && parseInt(group) == props.user.groupId
                    && username == props.user.username);
      if (noChanges) {
        throw new Error("No changes to submit.")
      }
      // Modify user info and set user
      const newUser: User = await eventService.userModify(props.user.id, firstName, lastName, parseInt(group), username, props.token);
      props.setUser(newUser);
      setErrorMessage("");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    if (props.user) {
      setFirstName(props.user.firstName);
      setLastName(props.user.lastName);
      setGroup(props.user.groupId.toString());
      setUsername(props.user.username)
    }
  }, [props.user])

  return (
    <Dialog open={props.open} onClose={close} scroll="paper" fullWidth maxWidth="sm">
      <Card>
        <CardHeader
          className={classes.cardHeader}
          title="Account Details"
          action={
            <IconButton onClick={close}>
              <Close/>
            </IconButton>
          }
        />
        <CardContent>
          <Grid container direction="row">
            <TextField
              disabled={!isEditing}
              id="firstName"
              label="First Name"
              className={classes.nameField}
              value={firstName}
              onChange={handleFirstNameChange}
              error={!firstNameValid}
              InputProps={{
                classes: {
                  disabled: classes.accountFieldDisabled 
                },
                disableUnderline: isEditing ? false : true
              }}
              InputLabelProps={{
                classes: {
                  disabled: classes.accountFieldLabelDisabled
                }
              }}
            />
            <TextField
              disabled={!isEditing}
              id="lastName"
              label="Last Name"
              className={classes.nameField}
              value={lastName}
              onChange={handleLastNameChange}
              error={!lastNameValid}
              InputProps={{
                classes: {
                  disabled: classes.accountFieldDisabled 
                },
                disableUnderline: isEditing ? false : true
              }}
              InputLabelProps={{
                classes: {
                  disabled: classes.accountFieldLabelDisabled
                }
              }}
            />
          </Grid>
          <FormControl fullWidth error={!groupValid} disabled={!isEditing} className={classes.groupField}>
            <InputLabel
              id="group"
              classes={{
                disabled: classes.accountFieldLabelDisabled
              }}
            >
              Group
            </InputLabel>
            <Select
              id="group"
              value={group}
              onChange={handleGroupChange}
              disableUnderline={isEditing ? false : true}
              inputProps={{
                classes: {
                  disabled: classes.accountFieldDisabled 
                }
              }}
            >
              {props.groups.map((group: Group, index: number) => <MenuItem key={index} value={group.id.toString()}>{group.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            disabled={!isEditing}
            fullWidth
            id="username"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            error={!usernameValid}
            InputProps={{
              classes: {
                disabled: classes.accountFieldDisabled 
              },
              disableUnderline: isEditing ? false : true
            }}
            InputLabelProps={{
              classes: {
                disabled: classes.accountFieldLabelDisabled
              }
            }}
          />
          <div className={classes.buttonsRight}>
            <Button
              color="primary"
              size="large"
              onClick={isEditing ? cancelEditing: startEditing}
            >
              {isEditing ? "Cancel" : "Edit Details"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.submitButton}
              onClick={isEditing ? submitUserEdit : close}
            >
              {isEditing ? "Submit Changes" : "Done"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {errorMessage && <Alert severity="error" variant="filled">{errorMessage}</Alert>}
    </Dialog>
  )
}

export default UserInfoWindow;
