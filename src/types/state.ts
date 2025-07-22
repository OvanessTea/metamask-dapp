import { Web3 } from "web3";

export type StateType = {
    web3: Web3 | null;
    warning: string | null;
    provider: string | null;
    chainId: string | null;
    latestBlock: string | null;
}