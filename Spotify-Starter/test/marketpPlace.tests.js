const { expect } = require("chai"); 

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketPlace", function () {

  let NFT;
  let nft;
  let MarketPlace;
  let marketPlace
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let feePercent = 1;
  let URI = "sample URI"

  beforeEach(async function () {
    // Get the ContractFactories and Signers here.
    NFT = await ethers.getContractFactory("NFT");
    MarketPlace = await ethers.getContractFactory("MarketPlace");
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contracts
    nft = await NFT.deploy();
    marketPlace = await MarketPlace.deploy(feePercent);
  });

  describe("Deployment", function () {

    it("Should track name and symbol of the nft collection", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const nftName = "918dcx"
      const nftSymbol = "dcX"
      expect(await nft.name()).to.equal(nftName);
      expect(await nft.symbol()).to.equal(nftSymbol);
    });

    it("Should track feeAccount and feePercent of the marketPlace", async function () {
      expect(await marketPlace.feeAccount()).to.equal(deployer.address);
      expect(await marketPlace.feePercent()).to.equal(feePercent);
    });
  });

  describe("Minting NFTs", function () {

    it("Should track each minted NFT", async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI)
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      // addr2 mints an nft
      await nft.connect(addr2).mint(URI)
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  })

  describe("Making marketPlace items", function () {
    let price = 1
    let result 
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI)
      // addr1 approves marketPlace to spend nft
      await nft.connect(addr1).setApprovalForAll(marketPlace.address, true)
    })


    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      // addr1 offers their nft at a price of 1 ether
      await expect(marketPlace.connect(addr1).makeItem(nft.address, 1 , toWei(1)))
        .to.emit(marketPlace, "Offered")
        .withArgs(
          1,
          nft.address,
          1,
          toWei(1),
          addr1.address
        )
      // Owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketPlace.address);
      // Item count should now equal 1
      expect(await marketPlace.itemCount()).to.equal(1)
      // Get item from items mapping then check fields to ensure they are correct
      const item = await marketPlace.items(1)
      expect(item.itemId).to.equal(1)
      expect(item.nft).to.equal(nft.address)
      expect(item.tokenId).to.equal(1)
      expect(item.price).to.equal(toWei(1))
      expect(item.sold).to.equal(false)
    });

    
    it("Should fail if price is set to zero", async function () {
      await expect(
        marketPlace.connect(addr1).makeItem(nft.address, 1, 0)
      ).to.be.revertedWith("You gota set a price Bruh");
    });
  });

  describe("Purchasing marketPlace items", function () {
    let price = 2
    let totalPriceInWei
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI)
      // addr1 approves marketPlace to spend tokens
      await nft.connect(addr1).setApprovalForAll(marketPlace.address, true)
      // addr1 makes their nft a marketPlace item.
      await marketPlace.connect(addr1).makeItem(nft.address, 1 , toWei(price))
    })
    it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
      // call .getBalance() method to get the initial balances
      const sellerInitalEthBal = await addr1.getBalance()
      const feeAccountInitialEthBal = await deployer.getBalance()
      
      // fetch items total price (market fees + item price)
      totalPriceInWei = await marketPlace.getTotalPrice(1);
      // addr 2 purchases item.
      await expect(marketPlace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
      .to.emit(marketPlace, "Bought")
      .withArgs(
        1,
        nft.address,
        1,
        toWei(price),
        addr1.address,
        addr2.address
        )
        const sellerFinalEthBal = await addr1.getBalance()
        const feeAccountFinalEthBal = await deployer.getBalance()
      // Seller should receive payment for the price of the NFT sold.
      expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitalEthBal))
      // calculate fee
      let fee = (feePercent/100)*price
      // feeAccount should receive fee
      expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal))
      // The buyer should now own the nft
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      // Item should be marked as sold
      expect((await marketPlace.items(1)).sold).to.equal(true)
    })
    it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
      // fails for invalid item ids
      await expect(
        marketPlace.connect(addr2).purchaseItem(2, {value: totalPriceInWei})
      ).to.be.revertedWith("item doesn't exist");
      await expect(
        marketPlace.connect(addr2).purchaseItem(0, {value: totalPriceInWei})
      ).to.be.revertedWith("item doesn't exist");
      // Fails when not enough ether is paid with the transaction. 
      // In this instance, fails when buyer only sends enough ether to cover the price of the nft
      // not the additional market fee.
      await expect(
        marketPlace.connect(addr2).purchaseItem(1, {value: toWei(price)})
      ).to.be.revertedWith("not enough ether to cover item price and market fee"); 
      // addr2 purchases item 1
      await marketPlace.connect(addr2).purchaseItem(1, {value: totalPriceInWei})
      // addr3 tries purchasing item 1 after its been sold 
      const addr3 = addrs[0]
      await expect(
        marketPlace.connect(addr3).purchaseItem(1, {value: totalPriceInWei})
      ).to.be.revertedWith("item already sold");
    });
  })
})
