import React, {useState } from "react";
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import "./App.css";
import EventTicketSystem from "./contracts/EventTicketSystem.json";
import EventTicketSystemAddress from "./contracts/EventTicketSystemAddress.json";
import Navigation from "./components/NavBar";
import {Spinner} from 'react-bootstrap';
import CreateEvent from "./components/CreateEvent";
import { ethers } from "ethers";
import MyEvents from "./components/MyEvents";
import Home from "./components/Home";
import ViewTickets from "./components/ViewTickets";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    })
    loadContracts(signer);
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const _contract = new ethers.Contract(EventTicketSystemAddress.address, EventTicketSystem.abi, signer);
    setContract(_contract);
    setLoading(false);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home nft={contract} account={account}/>
              } />
              <Route path="/create-event" element={
                <CreateEvent nft={contract} />
              } />
              <Route path="/my-events" element={
                <MyEvents nft={contract} account={account} />
              } />
              <Route path="/view-tickets" element={
                <ViewTickets eventId={0} nft={contract} price={0.0} imagePath={""}  />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
);
}

export default App;
