pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        // @global: "msg" is a global variable
        manager = msg.sender;
    }
    
    // Create a modifier called "restricted"
    // To refractor repeated logic inside a function
    modifier restricted() {
        require(msg.sender == manager);
        // This underscore will be replaced by the body code of the applied function
        _;
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
    
    function pickWinner() public restricted {
        // Enforce: only "manager" can pick the winner
        uint index = random() % players.length;
        // Access the player's address who has just won
        // "transfer" is a member function available for each "address" instance
        players[index].transfer(this.balance);
        // Create a dynamic array ("[]" without passing any number of length)
        // Initial length: 0
        players = new address[](0);
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
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