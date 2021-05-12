import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  // when there are changes to files and browser notices a new SW waiting
  // register it, ask user if they want to reload to update
  // if they say yes, reload
  onUpdate: registration => {
    //console.log('registration', registration);
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        if (event.target.state === "activated") {
          // alert the user to reload for updates
          //console.log('Asking for permission to reload and update...');
          //window.location.reload()
          confirmReload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }
});

const confirmReload = () => {
  const yesReload = window.confirm("Updates are available, reload to apply them. Do you want to do it now?");
  console.log(yesReload);
  if (yesReload) {
    window.location.reload();
  }
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();