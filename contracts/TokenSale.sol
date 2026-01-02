// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSale {
    IERC20 public token;
    address public owner;
    uint256 public rate = 1000;
    uint256 public airdropAmount = 100 * 10 ** 18;
    mapping(address => bool) public hasClaimed;

    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }

    function claimAirdrop() external {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(token.balanceOf(address(this)) >= airdropAmount, "Airdrop empty");
        hasClaimed[msg.sender]= true;
        token.transfer(msg.sender, airdropAmount);
    }

    function buyToken() external payable {
        require(msg.value > 0, "Send ETH to buy");
        uint256 amount = msg.value * rate;
        require(token.balanceOf(address(this)) >= amount, "Not enough tokens");
        token.transfer(msg.sender, amount);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}