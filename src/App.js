import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import BookingStore from "./store/BookingStore";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import Booking from "./components/Booking/Booking";
import ProgressPage from "./components/ProgressPage/ProgressPage";
import Admin from "./components/Admin/Admin";

import styles from "./App.module.scss";

const App = () => {
  // ScrollToTop helps with scroll position when navigating around with router
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        <main className={styles.page}>
          <Switch>
            <Route exact path="/" render={() => <BookingStore> <Booking /> </BookingStore>} />
            <Route path="/progress-tracker/:bookingId" component={ProgressPage} />
            <Route path="/very/secret/admin" component={Admin} />
          </Switch>
        </main>
      </Router>
    </>
  );
};

export default App;