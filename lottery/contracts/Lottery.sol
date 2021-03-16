pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        // @global: "msg" is a global variable
        manager = msg.sender;
    }
    
    function enter() public payable {
        // @global: "require" is a global variable
        //
        // Make sure some requirement is satisfied before
        // the following commands to be executed
        //
        // Here, we make sure the sneder has at least a certain amount of Ether
        // in order to enter into the contract
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    
    // Return an "unsigned int",
    // "uint" here by default means "uint256"
    function random() private view returns (uint) {
        // SHA256
        //  @global: "block" and "now" are global variables
        // 
        // The return value of "keccak256" is a hash.
        // We convert it to unit by casting it.
        return uint(keccak256(block.difficulty, now, players));
    }
}