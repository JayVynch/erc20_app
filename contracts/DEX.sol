// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ECR20/IECR20.sol";

contract DEX 
{
    IERC20 public associatedToken;

    uint price;
    address owner;

    constructor(ERC20 _token,uint price){
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
        unit allowance = associatedToken.allowance(msg.sender,address(this));
        require(allowance > 0 ,"You must allow this contract access to least one token");

        bool sent = associatedToken.transferFrom(msg.sender,address(this),allowance);
        require(sent, "Failed to send");
    }

    function withdrawTokens() external isOwner
    {
        uint balance = associatedToken.balanceOf(address(this));
        associatedToken.transfer(msg.sender,balance);
    }

    function withdrawFunds() external isOwner
    {
        (bool, sent) = payable(msg.sender).call{value: address(this).balance}("");

        require(sent);
    }

    function getPrice(uint numTokens) public view returns (uint)
    {
        return numToken * price;
    }

    function buy(uint numTokens) external payable 
    {
        require(numTokens <= getTokenBalance(),"not enough Tokens");
        uint tokenPrice = getPrice(numTokens);

        require(msg.value == tokenPrice,"Invalid value sent");
        associatedToken.transfer(msg.sender,numTokens);
    }

    function getTokenBalance() external view returns(uint)
    {
        return associatedToken.balanceOf(address(this));
    }
}