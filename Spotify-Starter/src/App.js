import React from "react";
import { Button, Spin } from "antd";
import { useState } from "react";
import { Routes, Route, Link,  BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Album from "./pages/Album";
import "./App.css";
import Spotify from "./images/Spotify.png";
import AudioPlayer from "./components/AudioPlayer";
import { SearchOutlined, DownCircleOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { ethers } from "ethers";
import MarketPlaceAbi from "./backend/contractsData/MarketPlace.json";
import MarketPlaceAddress from "./backend/contractsData/MarketPlace-address.json";
import NFTAbi from "./backend/contractsData/NFT.json";
import NFTAddress from "./backend/contractsData/NFT-address.json";
import Navigation from "./Navbar.js";
import Create from "./Create.js";
import MyListedItems from "./MyListedItems.js";
import MyPurchases from "./MyPurchases.js";
import Home2 from "./Home2.js";
// import { video} from "react-video-player"
const { Header, Footer, Sider, Content } = Layout;

{/* <Video controls src={item.image}  autoplay>
Audio content cannot be played
</Video> */}
<video id="background-video" loop autoPlay>
<source src="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4" type="video/mp4" />
Your browser does not support the video tag.
</video>
function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = await provider.getSigner();
    console.log("provider is", provider);
 


    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketPlaceAddress.address,
      MarketPlaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  };

  // This state is used to keap track of what nft should be playing in th mp
  const [nftAlbum, setNftAlbum] = useState();

  return (
    <Layout>
      <Header>
        <Navigation web3Handler={web3Handler} account={account} />
      </Header>
      <Layout>
        <Sider element={(web3Handler, account)} width={300}>
          <img src={Spotify} alt="Logo" className="logo"></img>
          <div className="searchBar">
            <span> Search </span>
            <SearchOutlined style={{ fontSize: "30px" }} />
          </div>
          <Link to="/">
            <p style={{ color: "#1DB954" }}> Home </p>
          </Link>
          <p>Your music</p>
          <div className="recentPlayed">
            <p className="recentTitle">RECENTLY PLAYED</p>
          </div>
        </Sider>
        <Content>
    
          <div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "80vh",
                }}
              >
                <Spin />
                <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/album"
                  element={<Album setNftAlbum={setNftAlbum} />}
                />
                <Route
                  path="/"
                  element={<Home marketplace={marketplace} nft={nft} />}
                />
                <Route
                  path="/create"
                  element={<Create marketplace={marketplace} nft={nft} />}
                />
                <Route
                  path="/home2"
                  element={<Home2 marketplace={marketplace} nft={nft} />}
                />
                <Route
                  path="/my-listed-items"
                  element={
                    <MyListedItems
                      marketplace={marketplace}
                      nft={nft}
                      account={account}
                    />
                  }
                />
                <Route
                  path="/my-purchases"
                  element={
                    <MyPurchases
                      marketplace={marketplace}
                      nft={nft}
                      account={account}
                    />
                  }
                />
              </Routes>
            )}
          </div>
        </Content>
      </Layout>
      <Footer className="footer">
        {nftAlbum && <AudioPlayer url={nftAlbum} />}
      </Footer>
    </Layout>
  );
}

export default App;
