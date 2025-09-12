import React, { useState } from "react";
import { useTranslate, useAuthProvider } from "react-admin";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AuthLayout } from "./AuthLayout";
import styles from "./ResetPassword.module.scss";

export const ResetPassword = ({
    loginUrl = "#/login",
    resetTokenParam = "reset_password_token",
    redirectUrlParam = "redirect_url",
    className = ""
}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("idle"); // 'idle' | 'success' | 'error' | 'mismatch'
    const [redirectUrl, setRedirectUrl] = useState(loginUrl);
    const authProvider = useAuthProvider();
    const translate = useTranslate();

    const getParam = (name) => {
        if (typeof window === "undefined") return undefined;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(name);
    };

    const submit = (e) => {
        e.preventDefault();
        const resetToken = getParam(resetTokenParam);
        const redirectUrlQuery = getParam(redirectUrlParam);
        if (newPassword !== confirmPassword) {
            setStatus("mismatch");
        } else {
            authProvider
                .resetPassword({ newPassword, confirmPassword, resetToken })
                .then((response) => {
                    if (response.data) {
                        if (redirectUrlQuery) {
                            setRedirectUrl(redirectUrlQuery);
                        }
                        setStatus("success");
                    } else {
                        setStatus("error");
                    }
                })
                .catch(() => {
                    setStatus("error");
                });
        }
    };

    return (
        <AuthLayout
            title={translate("auth.reset_password.title")}
            className={className}
        >
            {status === "idle" || status === "mismatch" ? (
                <form className={styles.container} onSubmit={submit} aria-label={translate("auth.reset_password.title")}
                    autoComplete="on"
                >
                    <TextField
                        required
                        type="password"
                        className={styles.formInput}
                        id="newPassword"
                        label={translate("auth.reset_password.labels.new_password")}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        inputProps={{
                            "aria-required": true,
                            "aria-label": translate("auth.reset_password.labels.new_password"),
                            "autoComplete": "new-password"
                        }}
                    />
                    <TextField
                        required
                        type="password"
                        className={styles.formInput}
                        id="confirmPassword"
                        label={translate("auth.reset_password.labels.new_password_confirmation")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{
                            "aria-required": true,
                            "aria-label": translate("auth.reset_password.labels.new_password_confirmation"),
                            "autoComplete": "new-password"
                        }}
                    />
                    {status === "mismatch" && (
                        <div style={{ color: "red" }} role="alert" aria-live="assertive" tabIndex={0}>
                            {translate("auth.reset_password.notifications.mismatch")}
                        </div>
                    )}
                    <Button type="submit" variant="contained" className={styles.submitButton} aria-label={translate("auth.reset_password.submit")}
                    >
                        {translate("auth.reset_password.submit")}
                    </Button>
                </form>
            ) : (
                <div className={styles.container}>
                    <div role="status" aria-live="polite" tabIndex={0} style={{ outline: "none" }}>
                        {status === "success"
                            ? translate("auth.reset_password.success")
                            : translate("auth.reset_password.notifications.error")}
                    </div>
                    <Button
                        href={decodeURIComponent(redirectUrl)}
                        variant="contained"
                        className={styles.submitButton}
                        aria-label={translate("auth.reset_password.redirect_to_login")}
                        autoFocus
                    >
                        {translate("auth.reset_password.redirect_to_login")}
                    </Button>
                </div>
            )}
        </AuthLayout>
    );
};
