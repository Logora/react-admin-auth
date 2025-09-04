import * as React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import fakeDataProvider from "ra-data-fakerest";
import { Login } from "./auth/Login";

const dataProvider = fakeDataProvider({
    users: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]
});

const CustomLoginPage = (props) => (
    <Login
        isLoading={false}
        onSubmit={(params) => {
            alert("Login params: " + JSON.stringify(params));
        }}
        // Add other props here for testing
    />
);

const App = () => (
    <Admin dataProvider={dataProvider} loginPage={CustomLoginPage}>
        <Resource name="users" list={ListGuesser} />
    </Admin>
);

export default App;
