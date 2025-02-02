// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {

    error NotOwner();
    error NoProceeds();
    error PriceMustBeAboveZero();
    error NotApprovedForMarketplace();
    error AlreadyListed(address nftAddress, uint tokenId);
    error NotListed(address nftAddress, uint tokenId);
    error PriceNotMet(address nftAddress, uint tokenId, uint price);

    event NFTListed(
        address indexed seller,
        address indexed nftAddress,
        uint indexed tokenId,
        uint price
    );

    event NFTCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint indexed tokenId
    );

    event NFTBought(
        address indexed buyer,
        address indexed nftAddress,
        uint indexed tokenId,
        uint price
    );

    struct NFTInfo {
        uint price;
        address seller;
    }

    mapping(address seller => uint balance) private _sellersProceeds;
    mapping(address nftAddress => mapping(uint tokenId => NFTInfo)) private _nftList;

    modifier notListed(address nftAddress, uint tokenId) {
        if (_nftList[nftAddress][tokenId].price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint tokenId) {
        if (_nftList[nftAddress][tokenId].price == 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(address nftAddress, uint tokenId, address spender) {
        if (spender != IERC721(nftAddress).ownerOf(tokenId)) {
            revert NotOwner();
        }
        _;
    }

    function listNFT(address nftAddress, uint tokenId, uint price) 
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        if (IERC721(nftAddress).getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        _nftList[nftAddress][tokenId] = NFTInfo(price, msg.sender);
        emit NFTListed(msg.sender, nftAddress, tokenId, price);
    }

    function cancelNFT(address nftAddress, uint tokenId) 
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete _nftList[nftAddress][tokenId];
        emit NFTCanceled(msg.sender, nftAddress, tokenId);
    }

    function buyNFT(address nftAddress, uint tokenId) 
        external 
        payable
        isListed(nftAddress, tokenId)
    {
        NFTInfo memory listedNFT = _nftList[nftAddress][tokenId];
        if (msg.value < listedNFT.price) {
            revert PriceNotMet(nftAddress, tokenId, listedNFT.price);
        }
        _sellersProceeds[listedNFT.seller] += msg.value;
        delete _nftList[nftAddress][tokenId];
        IERC721(nftAddress).safeTransferFrom(listedNFT.seller, msg.sender, tokenId);
        emit NFTBought(msg.sender, nftAddress, tokenId, listedNFT.price);
    }

    function withdrawProceeds() external {
        uint proceeds = _sellersProceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        _sellersProceeds[msg.sender] = 0;
        (bool success,) = msg.sender.call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    function getNFTInfo(address nftContract, uint tokenId) external view returns(NFTInfo memory) {
        return _nftList[nftContract][tokenId];
    }

    function getProceeds() external view returns(uint){
        return _sellersProceeds[msg.sender];
    }
}