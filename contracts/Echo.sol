// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.15;

import {Delegatable} from "delegatable-sol/contracts/Delegatable.sol";

contract Echo is Delegatable {
    constructor(
        string memory $name, 
        string memory $version
    ) Delegatable($name, $version) {}

    event Echoed(address indexed _sender);

    function echo() external {
        emit Echoed(_msgSender());
    }
}
