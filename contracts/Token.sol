// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20
{
    constructor(uint256 initialsupply) ERC20("VynchCoin","VYN"){
        _mint(msg.sender,initialsupply);
    }

}