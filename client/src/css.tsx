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
    event: {
      display: 'flex',
      height: '18vh',
      flex: 1
    },
    collapse: {
      zIndex: 2
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
    logoDiv: {
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
      marginRight: '2%'
    },
    filterAndSearch: {
      flex: 2,
      display: 'flex',
      alignItems: 'center'
    },
    filterElement: {
      margin: theme.spacing(1),
      maxWidth: 300,
    },
    categories: {
      width: "fit-to-content"
    },
    categoryFilter: {
      margin: theme.spacing(1),
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      maxWidth: 300
    },
    search: {
      flex: 1,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      marginRight: 0,
      marginLeft: 0,
      width: '100%'
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: buttonColor
    },
    inputRoot: {
      width: '100%'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: 50,
      transition: theme.transitions.create('width'),
      color: theme.palette.common.black
    },
    endDiv: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    userButton: {
      color: buttonColor
    }
  })
);

export default useStyles;
