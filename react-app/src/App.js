import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/Splash";
import NotFound from "./components/NotFound/NotFound";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import BoardDetails from "./components/Boards/BoardDetails"
import SearchPage from "./components/Splash/SearchPage";
import Splash from "./components/Splash/Splash";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(state=> state?.session?.user)
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <Splash />
          </Route>
          {/* <Route path="/login" >
            <LoginFormPage />
          </Route> */}
          {/* <Route path="/signup">
            <SignupFormPage />
          </Route> */}
          <Route exact path="/home">
            {user ? <HomePage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/search">
            {user ? <SearchPage /> : <Redirect to="/" />}
          </Route>
          <Route exact path={"/boards/:id"}>
            {user ? <BoardDetails /> : <Redirect to="/" />}
          </Route>
          <Route exact path={`/:username/profile`}>
            {user ? <ProfilePage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/notfound">
            <NotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
