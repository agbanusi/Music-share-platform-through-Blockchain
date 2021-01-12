pragma solidity ^0.5.0;

contract Inbox{
    //Structure
    mapping (bytes32=>bytes32) public ipfsInbox;
    
    //Events
    event ipfsSent(bytes32 _ipfsHash, bytes32 _address);
    event inboxResponse(bytes32 response);
    
    //Modifiers
    modifier notFull (bytes32 memory _string) {
    bytes memory stringTest = bytes(_string); 
    require(stringTest.length==0); 
    _;
    }
    
    // An empty constructor that creates an instance of the conteact
    constructor() public{}
    
    //takes in receiver's address and IPFS address. Places the IPFSadress in the receiver's inbox
    function sendIPFS(bytes32 _address, bytes32 memory _ipfsHash) notFull(ipfsInbox[_address]) public{
        ipfsInbox[_address] = _ipfsHash;
        emit ipfsSent(_ipfsHash, _address);
    }
    
    //check your inbox and empties it afterwards
    function checkInbox() public{
        bytes32 memory ipfs_hash=ipfsInbox[msg.sender];
        if(bytes(ipfs_hash).length==0){
            emit inboxResponse("Empty Inbox");
        }else{
            ipfsInbox[msg.sender]="";
            emit inboxResponse(ipfs_hash);
        }
    }

    //retrieves hash
    function getHash(bytes32 _address) public{
        bytes32 memory ipfs_hash=ipfsInbox[msg.sender];
        emit inboxResponse(ipfs_hash);
    }
    
}