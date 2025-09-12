import * as React from "react";
import { Admin, Resource, ListGuesser, resolveBrowserLocale, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import polyglotI18nProvider from "ra-i18n-polyglot";
import authProvider from "./authProvider";
import { Auth, Onboarding, ForgotPassword, ResetPassword } from "react-admin-auth";
import fakeDataProvider from "ra-data-fakerest";
import { theme } from "./theme";
import locales from "./i18n";
import 'react-admin-auth/dist/react-admin-auth.css';

const messages = {
  fr: locales.french,
  en: locales.english,
};

const i18nProvider = polyglotI18nProvider(
  (locale) => (messages[locale] ? messages[locale] : messages.en),
  resolveBrowserLocale(),
);

const dataProvider = fakeDataProvider({
  users: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" }
  ]
});

const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      loginPage={() => <Auth enableSSO={true} />}
      theme={theme}
    >
      <Resource name="users" list={ListGuesser} />
      <CustomRoutes noLayout>
        <Route path="/accept_invitation" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/sso" element={<Auth />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
