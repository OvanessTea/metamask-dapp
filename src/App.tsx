import { useLayoutEffect, useState } from "react";
import Web3 from "web3";
import { StateType } from "./types/state";
import { getChainId } from "./lib/getChainId";
import { getLatestBlock } from "./lib/getLatestBlock";
import { requestAccounts } from "./lib/requestAccounts";
import { signMessage } from "./lib/signMessage";

const App = () => {

	const [state, setState] = useState<StateType>({
		web3: null,
		warning: null,
		provider: null,
		chainId: null,
		latestBlock: null
	});

	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [currentAccount, setCurrentAccount] = useState<string | null>(null);

	const [message, setMessage] = useState<string | null>(null);
	const [signature, setSignature] = useState<string | null>(null);

	const handleConnect = async () => {
		if (state.web3) {
			const accounts = await requestAccounts(state.web3);
			if (accounts) {
				setCurrentAccount(accounts[0]);
			}
		}
	}

	useLayoutEffect(() => {
		if (window.ethereum) {
			const web3 = new Web3(window.ethereum);
			if (window.ethereum.isMetaMask) {
				setState({ ...state, web3, provider: "Connected to Ethereum with MetaMask" });
			} else {
				setState({ ...state, web3, provider: "Non-MetaMask Ethereum provider detected" });
			}
		} else {
			setState({ ...state, warning: 'Please install MetaMask!' });
			setButtonDisabled(true);
		}
	}, []);

	useLayoutEffect(() => {
		const fetchData = async () => {
			if (state.web3) {
				const chainId = await getChainId(state.web3);
				const latestBlock = await getLatestBlock(state.web3);

				// Set both values in a single setState call
				setState(prevState => ({
					...prevState,
					chainId: `Chain ID: ${chainId}`,
					latestBlock: `Latest Block: ${latestBlock}`
				}));

				const blockSubscription = await state.web3.eth.subscribe('newBlockHeaders');
				blockSubscription.on('data', (blockHeader) => {
					setState(prevState => ({
						...prevState,
						latestBlock: `Latest Block: ${blockHeader.number}`
					}));
				});

				return () => {
					blockSubscription.unsubscribe();
				};
			}
		};
		fetchData();
	}, [state.web3]);

	return (
		<div className="App">
			<>
				<div id="warn" style={{ color: 'red' }}>
					{state.warning}
				</div>
				<div id="provider">{state.provider}</div>
				<div id="chainId">{state.chainId}</div>
				<div id="latestBlock">{state.latestBlock}</div>
				<div id="currentAccount">{currentAccount}</div>
				<div>
					<button
						id="requestAccounts"
						disabled={buttonDisabled}
						onClick={handleConnect}
					>
						Connect to Ethereum
					</button>
				</div>
				<div>
					<input
						onChange={e => {
							setMessage(e.target.value);
						}}
						id="messageToSign"
						placeholder="Message to Sign"
						disabled={currentAccount === null}
					/>
					<button
						onClick={() => signMessage(state.web3, currentAccount, message)}
						id="signMessage"
						disabled={currentAccount === null}
					>
						Sign Message
					</button>
					<div id="signingResult">{signature}</div>
				</div>
			</>
		</div>
	);
};

export default App;