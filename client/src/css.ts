import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const buttonColor = "#444444";
const eventGridBackground = "#dddddd";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // AddressField
    pinIcon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(2),
    },
    textBold: {
      fontWeight: 700
    },
    textNormal: {
      fontWeight: 400
    },
    // CreateEventWindow
    createAddressOnline: {
      display: "flex",
      alignItems: "center",
      marginTop: 15,
      marginBottom: 15
    },
    createCat: {
      display: "flex",
      alignItems: "center",
      marginBottom: 15
    },
    createCatWidth: {
      width: 300
    },
    createDateAndLink: {
      display: "flex",
      alignItems: "center"
    },
    createToast: {
      zIndex: 4
    },
    marginTop15: {
      marginTop: 15
    },
    // EventExpansion
    collapse: {
      zIndex: 3
    },
    commentActions: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 5
    },
    commentButton: {
      marginLeft: 10,
      marginBottom: 1
    },
    commentSection: {
      display: "flex",
      flexDirection: "column",
      marginTop: 10
    },
    expandAddressAndLink: {
      display: "flex",
      alignItems: "center",
      marginTop: 15
    },
    expandDate: {
      display: "flex",
      alignItems: "center"
    },
    expandDesc: {
      marginTop: 15,
      marginBottom: 15
    },
    flexWithGap: {
      display: "flex",
      justifyContent: "space-between"
    },
    marginTopMinus20: {
      marginTop: -20
    },
    // EventGrid
    eventGrid: {
      backgroundColor: eventGridBackground,
      overflow: "auto",
      gridGap: theme.spacing(0.5),
      width: "40%",
      zIndex: 2,
    },
    eventGridOnline: {
      backgroundColor: eventGridBackground,
      overflow: "auto",
      gridGap: theme.spacing(0.5),
      width: "50%",
      zIndex: 2,
    },
    flex: {
      display: "flex"
    },
    gridCard: {
      display: "flex",
      height: "100%",
      flex: 1
    },
    gridDateAndSave: {
      textAlign: "center",
      backgroundColor: "#eeeeff"
    },
    // FilterMenu
    filterMenu: {
      margin: theme.spacing(1, 2),
      width: 300
    },
    filterMenuElement: {
      margin: theme.spacing(1)
    },
    // MainPage
    mainBox: {
      flex: 1,
      display: "flex",
      flexFlow: "row nowrap",
      position: "relative",
      overflow: "hidden",
      zIndex: 1
    },
    mainFlexColumn: {
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    },
    // MapComponent
    mapContainer: {
      position: "absolute",
      right: 0,
      width: "60%",
      height: "100%",
      zIndex: 1
    },
    mapContainerOnline: {
      position: "absolute",
      right: 0,
      width: "50%",
      height: "100%",
      zIndex: 1
    },
    mapGrayCover: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      position: "absolute",
      right: 0,
      width: "50%",
      height: "100%",
      zIndex: 2
    },
    moreDetails: {
      marginLeft: -4
    },
    poiLink: {
      marginBottom: 5
    },
    // NavBar
    beginDiv: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-start"
    },
    createNavButton: {
      marginLeft: "auto",
      marginRight: "auto"
    },
    filterButton: {
      color: buttonColor,
      marginLeft: "auto",
      marginRight: "auto"
    },
    middleDiv: {
      flex: 2,
      display: "flex",
      flexDirection: "column"
    },
    navBar: {
      flex: 0,
      backgroundColor: theme.palette.common.white,
      boxShadow: "none"
    },
    navLogoImg: {
      flex: 1,
      maxWidth: "25%",
      maxHeight: "25%"
    },
    userButton: {
      color: buttonColor
    },
    // SearchBar
    search: {
      flex: 1,
      height: "100%",
      display: "flex",
      alignItems: "center"
    },
    searchIcon: {
      color: buttonColor
    },
    searchInput: {
      margin: theme.spacing(1, 1, 1, 2),
      color: theme.palette.common.black,
      width: "100%"
    },
    // SignInWindow
    gap: {
      flex: 1
    },
    logoAndClose: {
      display: "flex",
      alignItems: "flex-start"
    },
    marginTop1Percent: {
      marginTop: "1%"
    },
    signInLogoImg: {
      flex: 1,
      maxWidth: "25%",
      maxHeight: "25%",
      marginTop: "3%"
    },
    // TabBar
    noTabIndicator: {
      backgroundColor: "transparent"
    },
    selectedTab: {
      backgroundColor: theme.palette.primary.main + " !important",
      color: theme.palette.common.white
    },
    tabRoot: {
      backgroundColor: theme.palette.grey[300],
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0.5)
    },
    // UserInfoWindow
    accountFieldDisabled: {
      color: theme.palette.text.primary
    },
    accountFieldLabelDisabled: {
      color: theme.palette.text.primary + " !important",
      fontWeight: "bold"
    },
    // UserMenu
    manageAccountButton: {
      margin: theme.spacing(0, 1, 1, 1),
    },
    signOutButton: {
      margin: theme.spacing(1, 1, 0, 1),
    },
    userMenu: {
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(1),
      width: 130
    },
    /* ----- SHARED CLASSES ----- */
    // CreateEventWindow, EventExpansion
    eventFields: {
      display: "flex",
      flexDirection: "column",
      marginTop: 15,
      marginBottom: 15
    },
    marginRight10: {
      marginRight: 10
    },
    // CreateEventWindow, UserInfoWindow
    buttonsRight: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 25,
      marginBottom: -10
    },
    cardHeader: {
      marginTop: -10,
      marginBottom: -15
    },
    submitButton: {
      marginLeft: 10
    },
    // EventExpansion, EventGrid, SignInWindow
    flexColumn: {
      display: "flex",
      flexDirection: "column"
    },
    // EventExpansion, MapComponent
    marginTopBottom5: {
      marginTop: 5,
      marginBottom: 5
    },
    // EventExpansion, SignInWindow
    marginTop10: {
      marginTop: 10
    },
    // NavBar, SignInWindow
    endDiv: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end"
    },
    // SignInWindow, UserInfoWindow
    groupField: {
      marginTop: "1%",
      marginBottom: "1%"
    },
    nameField: {
      width: 275
    }
  })
);

export default useStyles;
