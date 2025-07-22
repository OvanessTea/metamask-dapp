import { Web3 } from "web3";

export const requestAccounts = async (web3: Web3) => {
    if (web3 == null) {
        return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    document.getElementById('requestAccounts')?.remove();

    const allAccounts = await web3.eth.getAccounts();
    return allAccounts;
}