import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScrollReveal from "./utils/ScrollReveal";
import ReactGA from "react-ga";
import Routes from "./routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from './libs/errorLib';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = (page) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add("is-loaded");
    childRef.current.init();
    trackPage(page);
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
      const user = await Auth.currentUserInfo()
      window.localStorage.setItem("user", user.username)
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  }

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      )}
    />
  );
};

export default App;
