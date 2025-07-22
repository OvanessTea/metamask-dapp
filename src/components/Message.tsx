import { useState } from "react";
import { signMessage } from "../lib/signMessage";
import { Web3 } from "web3";
import { recoverAccount } from "../lib/recoverAccount";

type MessageProps = {
    web3: Web3 | null;
    currentAccount: string | null;
}

export const Message = ({ web3, currentAccount }: MessageProps) => {

    const [signature, setSignature] = useState<string | null>(null);
    const [signedMessage, setSignedMessage] = useState<string | null>(null);
    const [signedAccount, setSignedAccount] = useState<string | null>(null);
    const [originalMessage, setOriginalMessage] = useState<string | null>(null);

    const handleSignMessage = async () => {
        const signature = await signMessage(web3, currentAccount, signedMessage);
        setSignature(signature || null);
    }

    const handleRecoverAccount = async () => {
        const account = await recoverAccount(web3, originalMessage, signature);
        setSignedAccount(account || null);
    }

    return (
        <>
            <div>
                <input
                    onChange={e => {
                        setSignedMessage(e.target.value);
                    }}
                    id="messageToSign"
                    placeholder="Message to Sign"
                    disabled={currentAccount === null}
                />
                <button
                    onClick={handleSignMessage}
                    id="signMessage"
                    disabled={currentAccount === null}
                >
                    Sign Message
                </button>
                <div id="signingResult">{signature}</div>
            </div>
            <div>
                <input
                    onChange={e => {
                        setOriginalMessage(e.target.value);
                    }}
                    id="originalMessage"
                    placeholder="Original Message"
                    disabled={currentAccount === null}
                />
                <input
                    onChange={e => {
                        setSignedMessage(e.target.value);
                    }}
                    id="signedMessage"
                    placeholder="Signed Message"
                    disabled={currentAccount === null}
                />
                <button
                    onClick={handleRecoverAccount}
                    id="recoverAccount"
                    disabled={currentAccount === null}
                >
                    Recover Account
                </button>
                <div id="signingAccount">{signedAccount}</div>
            </div>
        </>
    );
}