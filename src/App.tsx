import { useLayoutEffect, useState } from "react";
import Web3 from "web3";
import { StateType } from "./types/state";
import { getChainId } from "./lib/getChainId";
import { getLatestBlock } from "./lib/getLatestBlock";

const App = () => {

	const [state, setState] = useState<StateType>({
		web3: null,
		warning: null,
		provider: null,
		chainId: null,
		latestBlock: null
	});

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
		</>
		</div>
	);
};

export default App;