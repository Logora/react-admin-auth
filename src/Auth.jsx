import React, { useState, useEffect } from "react";
import {
    Notification,
    useAuthProvider,
    useDataProvider,
    useNotify,
    useTranslate,
} from "react-admin";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Login } from "./Login";
import { SSOAuth } from "./SSOAuth";
import { SignUp } from "./SignUp";
import { AuthLayout } from "./AuthLayout";
import styles from "./Auth.module.scss";

const AuthMode = Object.freeze({
    LOGIN: "LOGIN",
    SIGNUP: "SIGNUP",
    SSO: "SSO",
});

export const Auth = ({
    loginUrl = "#/login",
    signupUrl = "#/signup",
    forgotPasswordUrl = "#/forgot_password",
    ssoUrl = "#/sso",
    onboardingUrl = "#/onboarding",
    googleClientId,
    callbackUrl,
    enableSSO = false,
    enableOnboarding = false,
    defaultRedirect = "/"
}) => {
    const [invitationId, setInvitationId] = useState("");
    const [currentAuth, setCurrentAuth] = useState(AuthMode.LOGIN);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const authProvider = useAuthProvider();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();
    const navigate = useNavigate();
    const redirectParam = searchParams.get("redirect") || defaultRedirect;

    useEffect(() => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentApplication");
    }, []);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const invitationId = urlParams.get("invitation_id");
        const existingUser = urlParams.get("existing_user");
        const isSignUp =
            location.pathname === "/signup" || (invitationId && !existingUser);
        const isSSO = location.pathname === "/sso" || urlParams.get("sso_domain");
        if (isSignUp) {
            setCurrentAuth(AuthMode.SIGNUP);
        }
        if (isSSO) {
            setCurrentAuth(AuthMode.SSO);
        }
        setInvitationId(invitationId);
    }, [location.pathname]);

    const navigateOut = () => {
        setIsLoading(false)
        if (enableOnboarding) {
            navigate(`${onboardingUrl}?redirect=${encodeURIComponent(redirectParam)}`, { replace: true });
        } else {
            navigate(redirectParam, { replace: true })
        }
    }

    const handleInvitation = () => {
        dataProvider
            .create("application_invitations", {
                invitation_id: invitationId,
            })
            .then(() => {
                authProvider.getIdentity().then(() => {
                    navigateOut();
                });
            })
            .catch(() => {
                // Erreur mauvais mail 401
                // Rediriger vers onboarding
            });
    };

    const submit = (authParams) => {
        setIsLoading(true)
        authProvider
            .authenticate(authParams)
            .then(() => {
                if (invitationId) {
                    handleInvitation()
                } else {
                    navigateOut()
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response?.status === 400) {
                    notify(
                        translate(
                            "auth.main.error_credentials",
                        ),
                        { type: "warning" },
                    );
                } else {
                    notify(translate("auth.main.error"), {
                        type: "info",
                    });
                }
            });
    };

    return (
        <AuthLayout
            title={
                currentAuth === AuthMode.LOGIN
                    ? translate("auth.login.title")
                    : currentAuth === AuthMode.SIGNUP
                        ? translate("auth.signup.title")
                        : ""
            }
        >
            <div className={styles.container}>
                {currentAuth === AuthMode.LOGIN ? (
                    <Login isLoading={isLoading} onSubmit={submit} googleClientId={googleClientId} callbackUrl={callbackUrl} />
                ) : currentAuth === AuthMode.SSO ? (
                    <SSOAuth isLoading={isLoading} onSubmit={submit} callbackUrl={callbackUrl} />
                ) : currentAuth === AuthMode.SIGNUP ? (
                    <SignUp isLoading={isLoading} onSubmit={submit} googleClientId={googleClientId} callbackUrl={callbackUrl} />
                ) : null}
                {currentAuth !== AuthMode.SSO ? (
                    <>
                        {enableSSO && (
                            <>
                                <div className={styles.separator}>{translate("auth.main.separator")}</div>
                                <Link to={`${ssoUrl}${window.location.search || ""}`} className={styles.ssoContainer}>
                                    {translate("auth.sso.use_sso")}
                                </Link>
                            </>
                        )}
                        <div className={styles.footerLinks}>
                            <Link
                                to={`${currentAuth === AuthMode.LOGIN ? signupUrl : loginUrl}${window.location.search || ""}`}
                                className={styles.footerLink}
                            >
                                {currentAuth === AuthMode.LOGIN
                                    ? translate("auth.signup.link")
                                    : translate("auth.login.link")}
                            </Link>
                            {currentAuth !== AuthMode.SIGNUP && (
                                <Link to={`${forgotPasswordUrl}${window.location.search || ""}`} className={styles.footerLink}>
                                    {translate("auth.forgot_password.link")}
                                </Link>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.footerLinks}>
                        <Link to={loginUrl} className={styles.footerLink}>
                            {translate("auth.main.more_login")}
                        </Link>
                    </div>
                )}
                <Notification />
            </div>
        </AuthLayout>
    );
};
