import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/Splash";
import NotFound from "./components/NotFound/NotFound";
import PinDetails from "./components/Pins/PinDetails";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import BoardDetails from "./components/Boards/BoardDetails"
import SearchPage from "./components/Splash/SearchPage";

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
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/search">
            <SearchPage />
          </Route>
          <Route exact path="/pins/:id">
            <PinDetails />
          </Route>
          <Route exact path={"/boards/:id"}>
            <BoardDetails />
          </Route>
          <Route exact path={`/${user?.username}/profile`}>
            <ProfilePage />
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
