# react-admin-auth

Reusable authentication components for [React-admin](https://marmelab.com/react-admin/).

## Features

- Plug-and-play authentication screens for React-admin apps
- Components for login, signup, SSO, password reset, onboarding, and more
- Easy integration with React-admin routing
- Built with Material-UI and React-admin hooks


## Installation

```bash
npm install react-admin-auth
# or
pnpm add react-admin-auth
```

**Peer dependencies:**  
You must have `react`, `react-dom`, `react-admin`, `react-router-dom`, and `@mui/material` installed in your project.

## Components

- `Auth`: Main authentication component (handles login, signup, SSO, etc.)
- `Login`: Login form
- `SignUp`: Signup form
- `ForgotPassword`: Password recovery form
- `ResetPassword`: Password reset form
- `Onboarding`: Onboarding flow
- `SSOAuth`: SSO authentication
- `routes`: Predefined React-admin routes for all auth screens

## Usage

### 1. Add Auth Routes to React-admin

Add the `<Auth>` component as your loginPage.
Import the `routes` array and add it to your React-admin `<Admin>` component using the `customRoutes` prop.
Import the library CSS in your main entry file (e.g., `index.js` or `App.js`):

```jsx
import { Admin } from "react-admin";
import { Auth, routes as authRoutes } from "react-admin-auth";
import 'react-admin-auth/dist/style.css';

export const App = () => (
  <Admin
    // ...other props
    loginPage={Auth}
    customRoutes={authRoutes}
  >
    {/* resources */}
  </Admin>
);
```

This will add the following routes :

- `/login`
- `/signup`
- `/accept_invitation`
- `/sso`
- `/forgot_password`
- `/reset_password`
- `/onboarding`

### 2. Use Components Directly

You can also use the components individually:

```jsx
import {
  Auth,
  Login,
  SignUp,
  ForgotPassword,
  ResetPassword,
  Onboarding,
  SSOAuth
} from "react-admin-auth";

// Example usage in a custom route or page
<Login onSubmit={...} googleClientId="..." callbackUrl="..." />
```

### 3. Customization

All components accept props for customization (e.g., URLs, callbacks, Google client ID, etc.).  
See the source code for each component for available props.

#### Example: Custom Auth Component

```jsx
<Auth
  loginUrl="#/login"
  signupUrl="#/signup"
  forgotPasswordUrl="#/forgot_password"
  ssoUrl="#/sso"
  googleClientId="YOUR_GOOGLE_CLIENT_ID"
  callbackUrl="YOUR_CALLBACK_URL"
  enableSSO={true}
/>
```

## Auth Provider

These components expect a compatible `authProvider` to be set up in your React-admin app, supporting methods like `login`, `logout`, `recoverPassword`, `resetPassword`, etc.

## Theme

All authentication components share a common layout (`AuthLayout`) that can be themed using two variables:

- `background`: Sets the background image, color, or gradient for the layout.
- `logo`: Sets the logo displayed at the top of the authentication screens.

You can provide these variables to customize the look and feel of your authentication pages. For a practical example of how to use these theme variables, see the demo app included in this repository:

[`/demo/src/theme.js`](./demo/src/theme.js)

The demo shows how to define and apply a custom background and logo to the authentication layout.

You can also pass a `className` prop to all components to further customize them.

## Internationalization (i18n)

All components use i18n keys compatible with React-admin's translation system. You can provide your own translations for authentication-related messages by extending your i18n provider with the following key structure:

- `auth.login.*` (e.g., `auth.login.title`, `auth.login.labels.email`, `auth.login.errors.invalid_credentials`)
- `auth.signup.*`
- `auth.forgot_password.*`
- `auth.reset_password.*`
- `auth.onboarding.*`
- `auth.sso.*`

This allows you to fully localize all texts, labels, errors, and button messages. See the source code for the full list of keys used in each component.

For a practical example of i18n integration and translation keys, see the demo app included in this repository. The demo provides a working setup with translations you can use as a reference for your own project.

You can find an example locale file here:
[`/demo/src/i18n/en.json`](./demo/src/i18n/en.json)

## License

GPL-3.0-only
