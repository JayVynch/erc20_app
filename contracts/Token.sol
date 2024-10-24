// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ECR20/ECR20.sol";

contract Token is ERC20
{
    constructor(uint initialsupply) ERC20("Vynch","VYN"){
        _mint(msg.sender,initialsupply);
    }
}