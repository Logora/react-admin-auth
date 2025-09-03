import React, { useState, useEffect } from "react";
import {
	Notification,
	useAuthProvider,
	useDataProvider,
	useNotify,
	useRedirect,
	useTranslate,
} from "react-admin";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Login } from "./Login";
import { SSOAuth } from "./SSOAuth";
import { SignUp } from "./SignUp";
import { AuthLayout } from "./AuthLayout";
import styles from "./Auth.module.scss";

export const Auth = () => {
	const [invitationId, setInvitationId] = useState("");
	const [currentAuth, setCurrentAuth] = useState("LOGIN");
	const [isLoading, setIsLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const authProvider = useAuthProvider();
	const dataProvider = useDataProvider();
	const redirectTo = useRedirect();
	const notify = useNotify();
	const translate = useTranslate();
	const navigate = useNavigate();

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const invitationId = urlParams.get("invitation_id");
		const existingUser = urlParams.get("existing_user");
		const isSignUp =
			location.pathname === "/signup" || (invitationId && !existingUser);
		const isSSO = location.pathname === "/sso" || urlParams.get("sso_domain");
		if (isSignUp) {
			setCurrentAuth("SIGNUP");
		}
		if (isSSO) {
			setCurrentAuth("SSO");
		}
		setInvitationId(invitationId);
	}, [location.pathname]);

	const handleInvitation = () => {
		dataProvider
			.create("application_invitations", {
				invitation_id: invitationId,
			})
			.then(() => {
				authProvider.getIdentity().then(() => {
					setIsLoading(false);
					redirectTo("/#");
				});
			})
			.catch(() => {
				// Erreur mauvais mail 401
				// Rediriger vers onboarding
			});
	};

	const submit = (authParams) => {
		setIsLoading(true);
		authProvider
			.authenticate(authParams)
			.then(() => {
				if (invitationId) {
					handleInvitation();
				} else {
					setIsLoading(false);
					navigate({
						pathname: "/",
						search: searchParams.toString(),
					});
				}
			})
			.catch((error) => {
				setIsLoading(false);
				if (error.response.status === 400) {
					notify(
						translate(
							"resources.update_password.notifications.error_credentials",
						),
						{ type: "warning" },
					);
				} else {
					notify(translate("resources.update_password.notifications.error"), {
						type: "info",
					});
				}
			});
	};

	return (
		<AuthLayout 
			title={
				currentAuth === "LOGIN"
					? translate("pos.login.login")
					: currentAuth === "SIGNUP"
						? translate("pos.login.signup")
						: ""
			}
		>
			{currentAuth === "LOGIN" ? (
				<Login isLoading={isLoading} onSubmit={submit} />
			) : currentAuth === "SSO" ? (
				<SSOAuth isLoading={isLoading} onSubmit={submit} />
			) : currentAuth === "SIGNUP" ? (
				<SignUp isLoading={isLoading} onSubmit={submit} />
			) : null}
			{currentAuth !== "SSO" ? (
				<>
					<div className={styles.separationContainer}>
						<div>{translate("pos.login.or")}</div>
					</div>
					<a href={"/#/sso"} className={styles.ssoContainer}>
						{translate("pos.login.use_sso")}
					</a>
					<div className={styles.footerLinks}>
						<a
							href={currentAuth === "LOGIN" ? "/#/signup" : "/#/login"}
							className={styles.infoText}
						>
							{currentAuth === "LOGIN"
								? translate("pos.login.no_account")
								: translate("pos.login.has_account")}
						</a>
						{currentAuth !== "SIGNUP" && (
							<a href="/#/forgot_password" className={styles.infoText}>
								{translate("pos.login.forgot_password")}
							</a>
						)}
					</div>
				</>
			) : (
				<div className={styles.footerLinks}>
					<a href={"/#/login"} className={styles.infoText}>
						{translate("pos.login.more_login")}
					</a>
				</div>
			)}
			<Notification />
		</AuthLayout>
	);
};
