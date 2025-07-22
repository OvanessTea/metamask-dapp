import { Web3 } from "web3";

export const signMessage = async (web3: Web3 | null, account: string | null, message: string | null) => {
    if (web3 == null || account == null || message == null) {
        return; 
    }

    const signature = await web3.eth.personal.sign(message, account, '');
    return signature;
}