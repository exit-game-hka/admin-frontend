import Cryptr from "cryptr";

export const encrypt = (text: string) => {
    const secretKey = process.env.NEXTAUTH_SECRET as string;
    const cryptr = new Cryptr(secretKey);

    return cryptr.encrypt(text);
}

export const decrypt = (encryptedString: string) => {
    const secretKey = process.env.NEXTAUTH_SECRET as string;
    const cryptr = new Cryptr(secretKey);

    return cryptr.decrypt(encryptedString);
}