import {useEffect} from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import {SessionContextValue} from "next-auth/react";
import axios from "axios";

type Output = SessionContextValue & {
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
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
        await signIn("keycloak");
    }

    return {
       ...sessionData,
        signIn: handleLogin,
        signOut: handleLogout,
    };
};
