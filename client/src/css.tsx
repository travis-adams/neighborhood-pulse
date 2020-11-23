import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const buttonColor = '#444444';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      position: 'absolute',
      right: 0,
      width: '60%',
      height: '100%',
      zIndex: 1
    },
    mapContainerOnline: {
      position: 'absolute',
      right: 0,
      width: '50%',
      height: '100%',
      zIndex: 1
    },
    mapGrayCover: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute',
      right: 0,
      width: '50%',
      height: '100%',
      zIndex: 2
    },
    event: {
      display: 'flex',
      height: '100%',
      flex: 1
    },
    collapse: {
      zIndex: 3
    },
    commentButton: {
      marginLeft: 10,
      marginBottom: 1
    },
    eventGrid: {
      backgroundColor: "#dddddd",
      overflow: "auto",
      gridGap: theme.spacing(0.5),
      width: '40%',
      zIndex: 2,
    },
    eventGridOnline: {
      backgroundColor: "#dddddd",
      overflow: "auto",
      gridGap: theme.spacing(0.5),
      width: '50%',
      zIndex: 2,
    },
    flexColumn: {
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    },
    mainBox: {
      flex: 1,
      display: "flex",
      flexFlow: "row nowrap",
      position: 'relative',
      overflow: "hidden",
      zIndex: 1
    },
    navBar: {
      flex: 0,
      backgroundColor: theme.palette.common.white,
      boxShadow: 'none'
    },
    beginDiv: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start'
    },
    logoImg: {
      flex: 1,
      maxWidth: '25%',
      maxHeight: '25%'
    },
    gap: {
      flex: 1
    },
    filterButton: {
      color: buttonColor,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    middleDiv: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column'
    },
    filterMenu: {
      margin: theme.spacing(1, 2),
      width: 300
    },
    filterMenuElement: {
      margin: theme.spacing(1)
    },
    userMenu: {
      display: 'flex',
      flexDirection: 'column',
      margin: theme.spacing(1),
      width: 130
    },
    manageAccountButton: {
      margin: theme.spacing(0, 1, 1, 1),
    },
    signOutButton: {
      margin: theme.spacing(1, 1, 0, 1),
    },
    search: {
      flex: 1,
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    searchIcon: {
      color: buttonColor
    },
    searchInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: 10,
      color: theme.palette.common.black,
      width: "100%"
    },
    endDiv: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    createNavButton: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    createButton: {
      marginLeft: 10
    },
    noTabIndicator: {
      backgroundColor: 'transparent'
    },
    tabRoot: {
      backgroundColor: theme.palette.grey[300],
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0.5)
    },
    selectedTab: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    addressPinIcon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(2),
    },
    userButton: {
      color: buttonColor
    },
    accountFieldDisabled: {
      color: theme.palette.text.primary
    },
    accountFieldLabelDisabled: {
      color: theme.palette.text.primary + " !important",
      fontWeight: 'bold'
    }
  })
);

export default useStyles;
