import React from "react";
import { Route } from "react-router-dom";
import { Auth, Onboarding } from "./index";
import { CustomRoutes } from "react-admin";

export const routes = [
	<CustomRoutes noLayout>
		<Route path="/accept_invitation" element={<Auth />} />
		<Route path="/signup" element={<Auth />} />
		<Route path="/sso" element={<Auth />} />
		<Route path="/onboarding" element={<Onboarding />} />
	</CustomRoutes>,
];
