import { GoogleLoginButton } from "@logora/debate.auth.google_login_button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useTranslate } from "react-admin";
import styles from "./SignUp.module.scss";

const isPasswordValid = (password, minLength) => {
    return password.length >= minLength;
};

export const SignUp = ({ 
    isLoading, 
    onSubmit, 
    onAuth,
    googleClientId, 
    callbackUrl, 
    passwordMinLength = 7,
    className = ""
}) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const translate = useTranslate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [userFirstName, setUserFirstName] = useState(
        urlParams.get("first_name") || "",
    );
    const [userLastName, setUserLastName] = useState(
        urlParams.get("last_name") || "",
    );
    const [userEmail, setUserEmail] = useState(urlParams.get("email"));
    const [error, setError] = useState("");

    const handleSubmit = (event, code = null) => {
        event?.preventDefault();

        if (!isPasswordValid(password, passwordMinLength)) {
            setError(
                translate("auth.signup.invalid_password", {
                    minLength: passwordMinLength,
                }),
            );
            return;
        }

        if (code) {
            const userParams = {
                grant_type: "assertion",
                assertion_type: "google",
                assertion: code,
            };
            onAuth && onAuth({ type: "signup", method: "google" });
            onSubmit(userParams);
        } else {
            const userParams = {
                uid: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
                email: userEmail,
                first_name: userFirstName,
                last_name: userLastName,
                password: password,
                is_admin: true,
            };
            const assertion = window.btoa(JSON.stringify(userParams));
            const assertionParams = {
                grant_type: "assertion",
                assertion: assertion,
                assertion_type: "form",
            };
            onAuth && onAuth({ type: "signup", method: "form"    });
            onSubmit(assertionParams);
        }
    };

    return (
        <div className={`${styles.container} ${className}`.trim()}>
            {googleClientId && callbackUrl &&
                <>
                    <GoogleLoginButton
                        text={translate("auth.signup.google_signup")}
                        googleClientId={googleClientId}
                        redirectUri={callbackUrl}
                        onCode={(code) => handleSubmit(null, code)}
                    />
                    <div className={styles.separator}>{translate("auth.signup.separator")}</div>
                </>
            }
            <form className={styles.form} onSubmit={(event) => handleSubmit(event)} aria-label={translate("auth.signup.title")}
                autoComplete="on"
            >
                {error && <div className={styles.error} role="alert" aria-live="assertive" tabIndex={0}>{error}</div>}

                <div className={styles.nameContainer}>
                    <TextField
                        required
                        type="text"
                        className={styles.formInput}
                        id="firstName"
                        label={translate("auth.signup.labels.first_name")}
                        value={userFirstName}
                        onChange={(e) => setUserFirstName(e.target.value)}
                        inputProps={{
                            "aria-required": true,
                            "aria-label": translate("auth.signup.labels.first_name"),
                            "autoComplete": "given-name"
                        }}
                    />
                    <TextField
                        required
                        type="text"
                        className={styles.formInput}
                        id="lastName"
                        label={translate("auth.signup.labels.last_name")}
                        value={userLastName}
                        onChange={(e) => setUserLastName(e.target.value)}
                        inputProps={{
                            "aria-required": true,
                            "aria-label": translate("auth.signup.labels.last_name"),
                            "autoComplete": "family-name"
                        }}
                    />
                </div>
                <TextField
                    required
                    className={styles.formInput}
                    id="email"
                    type="email"
                    label={translate("auth.signup.labels.email")}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    inputProps={{
                        "aria-required": true,
                        "aria-label": translate("auth.signup.labels.email"),
                        "autoComplete": "email"
                    }}
                />
                <TextField
                    required
                    type={showPassword ? "text" : "password"}
                    className={styles.formInput}
                    id="password"
                    label={translate("auth.signup.labels.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{
                        "aria-required": true,
                        "aria-label": translate("auth.signup.labels.password"),
                        "autoComplete": "new-password"
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? translate("auth.signup.hide_password") : translate("auth.signup.show_password")}
                                    title={showPassword ? translate("auth.signup.hide_password") : translate("auth.signup.show_password")}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Button type="submit" className={styles.submitButton} aria-label={translate("auth.signup.submit")}>
                        {translate("auth.signup.submit")}
                    </Button>
                )}
            </form>
        </div>
    );
};
