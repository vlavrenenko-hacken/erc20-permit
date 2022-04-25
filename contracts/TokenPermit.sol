// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A simple ERC20Permit implementation
/// @author Viktor Lavrenenko
/// @notice You can use this contract to transfer funds by not paying for gas because of the EIP-712 signature
/// @dev All function calls are currently implemented without side effects
contract TokenPermit is ERC20Permit {

    /// @dev Sets values for {name}, {symbol} and {supply}. Calls ERC20._mint() function with {msg.sender}
    /// and {supply}.Inherits ERC20.constructor and ERC20Permit.constructor()
    constructor(string memory name, string memory symbol, uint256 supply) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, supply);
    } 

    /// @notice Approves and transfer funds using EIP-712 standard
    /// @dev The Lavrenenko V.V. To use this method properly, you have to have the EIP-712 signature
    /// signed using "eth_signTypedData_v4" method and split it afterwards
    /// @param owner The person approving tokens
    /// @param spender The person receving the approval
    /// @param value The number of tokens to be transfered
    /// @param deadline The expiration date of the signature
    /// @param v The first 32 bytes  of the signature
    /// @param r The second 32 bytes of the signature
    /// @param s The last 1 byte of the signature
    /// @param to The address receiving the tokens
    function permitWithTransfer(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s, address to) external {
        permit(owner, spender, value, deadline, v, r, s);
        transferFrom(owner, to, value);
    }
}