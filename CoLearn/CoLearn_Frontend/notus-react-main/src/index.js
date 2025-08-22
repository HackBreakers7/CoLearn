import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import VerifyOtp from "views/auth/verify_otp.js";

// Google OAuth
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "10328066839-dbecv3ou60eirrl0f7ir86khmu2hb10g.apps.googleusercontent.com";

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <Switch>
        {/* add routes with layouts */}
        <Route path="/admin" component={Admin} />
        <Route path="/auth" component={Auth} />
        {/* add routes without layouts */}
        <Route path="/landing" exact component={Landing} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/" exact component={Index} />
        <Route path="/verify-otp" exact component={VerifyOtp}/>
        {/* add redirect for first page */}
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
