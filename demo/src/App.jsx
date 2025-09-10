import * as React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import { BrowserRouter } from "react-router-dom";
import authProvider from "./authProvider";
import { Auth, routes as authenticationRoutes } from "react-admin-auth";
import fakeDataProvider from "ra-data-fakerest";

const dataProvider = fakeDataProvider({
    users: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]
});

const LoginPage = (props) => (
  <BrowserRouter>
    <Auth {...props} />
  </BrowserRouter>
);

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={LoginPage}>
        <Resource name="users" list={ListGuesser} />
    </Admin>
);

export default App;
