import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Collaborator from "./pages/Collaborator";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/collaborator/:id" component={Collaborator} />
      </Switch>
    </BrowserRouter>
  );
}
