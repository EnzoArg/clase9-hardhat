const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let NFTMarketplace;
  let nftMarketplace;
  let NFTContract;
  let nftContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy NFTContract
    NFTContract = await ethers.getContractFactory("NFTContract");
    nftContract = await NFTContract.deploy();
    await nftContract.deployed();

    // Mint an NFT for addr1
    await nftContract.mint(addr1.address, 1);

    // Deploy NFTMarketplace
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    // Approve NFTMarketplace to transfer the NFT
    await nftContract.connect(addr1).approve(nftMarketplace.address, 1);

  });

  it("Should List an NFT for Sale", async function () {
    // List NFT for sale
    const listingPrice = ethers.utils.parseEther("0.1"); // Example listing price
    await nftMarketplace.connect(addr1).listNFT(nftContract.address, 1, listingPrice);

    // Verify NFT is listed
    const nftInfo = await nftMarketplace.getNFTInfo(nftContract.address, 1);
    expect(nftInfo.price).to.equal(listingPrice);
    expect(nftInfo.seller).to.equal(addr1.address);
  });


  it("Should Cancel from the list", async function () {

    // List NFT for sale
    const listingPrice = ethers.utils.parseEther("0.1"); // Example listing price
    await nftMarketplace.connect(addr1).listNFT(nftContract.address, 1, listingPrice);
    
    // Verify NFT is listed
    const nftInfo = await nftMarketplace.getNFTInfo(nftContract.address, 1);
    // Cancel NFT listing
    await nftMarketplace.connect(addr1).cancelNFT(nftContract.address, 1);

    // Verify NFT is no longer listed
    const canceledNFTInfo = await nftMarketplace.getNFTInfo(nftContract.address, 1);
    expect(canceledNFTInfo.price).to.equal(0);
    expect(canceledNFTInfo.seller).to.equal("0x0000000000000000000000000000000000000000");
  });
  

  it("Should List and buy", async function () {
    // List NFT for sale
    const listingPrice = ethers.utils.parseEther("0.1"); // Example listing price

    await nftMarketplace.connect(addr1).listNFT(nftContract.address, 1, listingPrice);
 
    // Buy the NFT from addr2
    await nftMarketplace.connect(addr2).buyNFT(nftContract.address, 1, { value: listingPrice });
 
    // Verify the new owner of the NFT is addr2
    const newOwner = await nftContract.ownerOf(1);
    expect(newOwner).to.equal(addr2.address);
 
    // Verify proceeds are updated for addr1
    const proceeds = await nftMarketplace.connect(addr1).getProceeds();
    expect(proceeds).to.equal(listingPrice);
  });

  it("Should list, buy and withdraw proceeds", async function () {
    // List NFT for sale
    const listingPrice = ethers.utils.parseEther("0.1"); // Example listing price

    await nftMarketplace.connect(addr1).listNFT(nftContract.address, 1, listingPrice);
 
    // Buy the NFT from addr2
    await nftMarketplace.connect(addr2).buyNFT(nftContract.address, 1, { value: listingPrice });
 
    // Verify the new owner of the NFT is addr2
    const newOwner = await nftContract.ownerOf(1);
    expect(newOwner).to.equal(addr2.address);
    
    // Withdraw proceeds from addr1
    const initialBalance = await ethers.provider.getBalance(addr1.address);
    const tx = await nftMarketplace.connect(addr1).withdrawProceeds();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    const finalBalance = await ethers.provider.getBalance(addr1.address);

    expect(finalBalance).to.equal(initialBalance.add(listingPrice).sub(gasUsed));
  });
});

