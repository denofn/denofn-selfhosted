import { Auth0Provider } from "@auth0/auth0-react";
import { Provider as FetchProvider, CachePolicies } from "use-http";
import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ViewsProvider } from "./components/Views";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="denofn.eu.auth0.com"
      clientId="b43779wH6t2S4r7TXXWDWQzC56kg5voI"
      redirectUri={window.location.origin}
    >
      <ViewsProvider>
        <FetchProvider
          options={{
            cachePolicy: CachePolicies.NO_CACHE,
          }}
        >
          <App />
        </FetchProvider>
      </ViewsProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
