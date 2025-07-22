import { Web3 } from "web3";

export const recoverAccount = async (web3: Web3 | null, originalMessage: string | null, signedMessage: string | null) => {
    if (web3 == null || originalMessage == null || signedMessage == null) {
        return;
    }

    const account = await web3.eth.personal.ecRecover(originalMessage, signedMessage);
    return account;
}