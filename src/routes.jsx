import React from "react";
import { Route } from "react-router-dom";
import { Auth, Onboarding, ForgotPassword, ResetPassword } from "./index";
import { CustomRoutes } from "react-admin";

export const routes = [
	<CustomRoutes noLayout>
		<Route path="/accept_invitation" element={<Auth />} />
		<Route path="/signup" element={<Auth />} />
		<Route path="/sso" element={<Auth />} />
		<Route path="/forgot_password" element={<ForgotPassword />} />
		<Route path="/reset_password" element={<ResetPassword />} />
		<Route path="/onboarding" element={<Onboarding />} />
	</CustomRoutes>
];
