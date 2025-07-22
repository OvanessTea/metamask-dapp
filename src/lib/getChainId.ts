import { Web3 } from "web3";

export const getChainId = async (web3: Web3) => {
    if (web3 == null) {
        return;
    }

    const chainId = await web3.eth.getChainId();
    return chainId;
}