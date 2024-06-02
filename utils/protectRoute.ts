import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const protectRoute = async () => {
    const session = await getServerSession();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }
};
