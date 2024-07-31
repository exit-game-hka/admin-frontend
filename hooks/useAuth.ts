"use client";
import {useEffect} from "react";
import {SessionContextValue, signIn, SignInOptions, signOut, useSession} from "next-auth/react";
import axios from "axios";

export const ADMIN_ROLE = "admin" as const;

type Output = SessionContextValue & {
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
};
export const useAuth = (): Output => {
    const sessionData = useSession();

    const { data: session, status } = sessionData;

    useEffect(() => {
        if (
            status != "loading" &&
            session &&
            // @ts-ignore
            session?.error === "RefreshAccessTokenError"
        ) {
            signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_PATH! });
        }
    }, [session, status]);

    const keycloakSessionLogOut = async () => {
        try {
            await axios.get(`${process.env.NEXTAUTH_URL}/api/auth/logout`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await keycloakSessionLogOut();
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_PATH! });
    };

    const handleLogin = async () => {
        const signInOptions: SignInOptions | undefined = {
            callbackUrl: process.env.NEXT_PUBLIC_BASE_PATH,
        };
        await signIn("keycloak", signInOptions);
    }

    return {
        ...sessionData,
        signIn: handleLogin,
        signOut: handleLogout,
        // @ts-ignore
        isAdmin: session?.roles?.includes(ADMIN_ROLE),
    };
};
