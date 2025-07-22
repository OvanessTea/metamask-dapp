import { Web3 } from "web3";

export const getLatestBlock = async (web3: Web3) => {
    if (web3 == null) {
        return;
    }

    const latestBlock = await web3.eth.getBlockNumber();
    return latestBlock;
}