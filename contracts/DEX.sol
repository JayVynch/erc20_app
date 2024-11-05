// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX 
{
    IERC20 public associatedToken;

    uint256 price;
    address owner;

    constructor(IERC20 _token,uint256 _price){
        associatedToken = _token;
        owner = msg.sender;
        price = _price;
    }

    modifier isOwner{
        require(msg.sender == owner,"You are not the owner");
        _;
    }

    function sell() external isOwner
    {
        uint256 allowance = associatedToken.allowance(msg.sender,address(this));
        require(allowance > 0 ,"You must allow this contract access to least one token");

        bool sent = associatedToken.transferFrom(msg.sender,address(this),allowance);
        require(sent, "Failed to send");
    }

    function withdrawTokens() external isOwner
    {
        uint256 balance = associatedToken.balanceOf(address(this));
        associatedToken.transfer(msg.sender,balance);
    }

    function withdrawFunds() external isOwner
    {
        (bool sent,) = payable(msg.sender).call{value: address(this).balance}("");

        require(sent);
    }

    function currentAddress() public view returns (address)
    {
        return address(this);
    }

    function currentPrice() public view returns (uint256)
    {
        return price;
    }

    function getPrice(uint256 numTokens) public view returns (uint256)
    {
        return numTokens * price;
    }

    function buy(uint256 numTokens) external payable 
    {
        require(numTokens <= getTokenBalance(),"not enough Tokens");
        uint256 tokenPrice = getPrice(numTokens);

        require(msg.value == tokenPrice,"Invalid value sent");
        associatedToken.transfer(msg.sender,numTokens);
    }

    function getTokenBalance() public view returns(uint256)
    {
        return associatedToken.balanceOf(address(this));
    }
}