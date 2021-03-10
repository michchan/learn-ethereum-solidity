pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    
    function Lottery() public {
        // "msg" is a global variable
        manager = msg.sender;
    }
}