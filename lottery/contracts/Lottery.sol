pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        // "msg" is a global variable
        manager = msg.sender;
    }
    
    function enter() public payable {
        // "require" is a global variable
        // Make sure some requirement is satisfied before
        // the following commands to be executed
        // Here, we make sure the sneder has at least a certain amount of Ether
        // in order to enter into the contract
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
}