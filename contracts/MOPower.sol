pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

/** 
 * @title MOPower
 * @dev Implements meter transactions and consumption on immutable ledger
 */
contract MOPower {
    
    address private owner;
    
    /** 
     * @dev Check if caller is owner
     */
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    /** 
     * @dev Initialize contract and set owner as sender
     */
    constructor () public {
        owner = msg.sender;
    }
    
    Producer[] producers;
    //Consumer[] consumers;
    EnergyConsumption[] energyUsages;
    
    // list of all producers mapped by their unique usernameHash
    mapping(bytes32 => Producer) private producers_map;
    // list of all consumers mapped by their unique usernameHash
    mapping(bytes32 => Consumer) private consumers_map;
    // list of all meters mapped by their unique id
    mapping(string => Meter) private meters_map;
    // list of all transactions mapped by their reference
    mapping(string => Transaction) private transactions_map;
    // list of all transactions done on a meter (by meter serial)
    mapping(string => Transaction[]) private meterTransactions_map;
    // list of all energy consumed by a meter
    mapping(string => EnergyConsumption[]) private meterConsumptions_map;
    
    event meterSaved(string _meterId, bytes32 _consumerUsername, string _message);
    event consumerSaved(bytes32 _consumerUsernameHash, string _message);
    event producerSaved(bytes32 _producerUsernameHash, string _message);
    event transactionSaved(string _token, string _message);
    event consumptionSaved(string _meterSerial, uint _usedUnits, string _message);
    
    event meterTrasactionsFetched(Transaction[] _transactions, string _message);
    event trasactionFetched(Transaction _transaction, string _message);
    
    event meterCountUpdated(string _message);
    event consumerAuth(bytes32 _usernameHash, string _message);

    
    // sells energy tokens for meter
    struct Producer {
        uint64 id;
        uint64 currentPrice; //in kobo
        bytes32 usernameHash;
        bytes32 passwordHash;
    }
    
    // buys energy token for meter
    struct Consumer {
        uint64 id;
        uint8 meterCount;
        //string username;
        bytes32 usernameHash;
        bytes32 passwordHash;
    }
    
    // smart meters owned by consumers
    struct Meter {
        string serial;
        uint64 unitBalance;
        bytes32 consumerUsernameHash;
    }
    
    // meter token transaction
    struct Transaction {
        uint id;
        string meterSerial;
        string token;
        bytes32 consumerUsernameHash;
        bytes32 producerUsernameHash;
        uint64 unitsBought;
        uint256 price; // (current) price in kobo when unit was purchase
        //uint transactionTimestamp;
    }
    
    // smart meter energy consumption
    struct EnergyConsumption {
        string meterSerial;
        uint64 consumedUnits;
    }
    
    /** 
     * @dev Save new meter on chain
     * @param _serial The unique ID of the meter
     * @param _consumerUsernameHash The hash of consumer's username
     * @param _startUnitBalance The base units balance purchased on new meter
     */
     //@emit (meterSerial, consumerId, "meter added successfully")
    function addMeter (string memory _serial, bytes32 _consumerUsernameHash, uint64 _startUnitBalance) public isOwner{
        require(doesConsumerExist(_consumerUsernameHash), "no existing customer for meter");
        Meter memory _meter;
        _meter.serial = _serial;
        _meter.unitBalance = _startUnitBalance;
        _meter.consumerUsernameHash = _consumerUsernameHash;
        
        meters_map[_serial] = _meter;
        
        // increase meters owned by consumer
        updateConsumerMeterCount(_meter.consumerUsernameHash);
        
        emit meterSaved(_meter.serial, _meter.consumerUsernameHash, "meter added successfully");
    }
    
    /** 
     * @dev Save new consumer on chain
     * @param username The username of the new consumer
     * @param password The password of the new consumer
     */
     //@emit (consumerUsernameHash, "consumer added successfully")
    function addConsumer (string memory username, string memory password) public isOwner {
        bytes32 _usernameHash = keccak256(abi.encode(username));
        bytes32 _passwordHash = keccak256(abi.encode(password));
        Consumer memory _consumer;
        _consumer.usernameHash = _usernameHash;
        _consumer.passwordHash = _passwordHash;
        consumers_map[_usernameHash] = _consumer;
        
        emit consumerSaved(_consumer.usernameHash, "consumer added successfully");
    }
    
    /** 
     * @dev Save new energy producer on chain
     * @param username The username of the new producer
     * @param password The password of the new producer
     */
     //@emit (producerUsernameHash, "producer added successfully")
    function addProducer (string memory username, string memory password) public isOwner {
        bytes32 _usernameHash = keccak256(abi.encode(username));
        bytes32 _passwordHash = keccak256(abi.encode(password));
        Producer memory producer;
        producer.usernameHash = _usernameHash;
        producer.passwordHash = _passwordHash;
        producers_map[_usernameHash] = producer;
        
        emit producerSaved(producer.usernameHash, "producer added successfully");
    }
    
    /** 
     * @dev save transaction of token loaded to smart meter. This is saved to the meter's transaction history
     * @param _meterSerial Unique ID of meter
     * @param _token Energy token bought for loading. Unique transaction identifier
     * @param _consumerUsernameHash Hash of consumer's username
     * @param _producerUsernameHash Hash of producer's username
     * @param _unitsBought Energy units paid for
     * @param _price Price per unit
     */
     //@emit (unique/used transaction token, "transaction added successfully")
    function addTransaction(string memory _meterSerial, string memory _token, bytes32 _consumerUsernameHash,
                bytes32 _producerUsernameHash, uint64 _unitsBought, uint64 _price) public isOwner {
        require(doesMeterExist(_meterSerial), "meter does not exist");
        
        Transaction memory _transaction;
        _transaction.meterSerial = _meterSerial;
        _transaction.token = _token;
        _transaction.consumerUsernameHash = _consumerUsernameHash;
        _transaction.producerUsernameHash = _producerUsernameHash;
        _transaction.unitsBought = _unitsBought;
        _transaction.price = _price;
        
        //keep track of transactions tied to a meter
        meterTransactions_map[_transaction.meterSerial].push(_transaction);
        
        //update meter balance
        meters_map[_transaction.meterSerial].unitBalance += _unitsBought;
        
        emit transactionSaved(_transaction.token, "transaction added successfully");
    }
    
    /** 
     * @dev save new meter energy consumption
     * @param _meterSerial Unique ID of meter
     * @param _consumedUnits The meter consumption
     */
    //@emit (meterSerial, unitsConsumed, "consumption saved successfully")
    function addConsumption(string memory _meterSerial, uint64 _consumedUnits) public isOwner {
        require(doesMeterExist(_meterSerial), "meter does not exist");
        
        EnergyConsumption memory _consumption;
        _consumption.consumedUnits = _consumedUnits;
        _consumption.meterSerial = _meterSerial;
        meterConsumptions_map[_consumption.meterSerial].push(_consumption);
        
        //subtract from balance
        meters_map[_meterSerial].unitBalance -= _consumedUnits;
        
        emit consumptionSaved(_consumption.meterSerial, _consumption.consumedUnits, "consumption saved successfully");
    }
    
    /** 
     * @dev increase consumer meters count by one when they acquire new smart meter
     * @param _usernameHash The username hash of the consumer who wants to add new smart meter
     */
     //@emit ("consumer meter count updated")
    function updateConsumerMeterCount (bytes32 _usernameHash) private {
        Consumer storage consumer = consumers_map[_usernameHash];
        consumer.meterCount += 1;
        
        emit meterCountUpdated("consumer meter count updated");
    }
    
    /** 
     * @dev Checks if meter exists on blockchain
     * @param _meterSerial The ID of the meter
     */
    function doesMeterExist(string memory _meterSerial) private view returns(bool){
        if(bytes(meters_map[_meterSerial].serial).length == 0){
            return false;
        }
        return true;
    }
    
     /** 
     * @dev Checks if customer exists on blockchain
     * @param consumerUsernameHash The hash of customer username
     */
    function doesConsumerExist(bytes32 consumerUsernameHash) private view returns(bool){
        if(consumers_map[consumerUsernameHash].usernameHash == 0){
            return false;
        }
        return true;
    }
    
    /** 
     * @dev fetch consumer for authentication
     * @param _rawPassword The raw password input of consumer from clientside
     * @param _rawUsername The raw username input of consumer from clientside
     * @return _consumer The consumer
     */
    function getConsumerAuth(string memory _rawUsername, string memory _rawPassword) public returns (Consumer memory _consumer){
        bytes32 _usernameHash = keccak256(abi.encode(_rawUsername));
        _consumer = consumers_map[_usernameHash];
        
        string memory evtMsg = "";
        if(keccak256(abi.encode(_rawPassword)) == _consumer.passwordHash){
            evtMsg = "consumer authentication successful";
        }else{
            evtMsg = "authentication failed";
        }
        
        emit consumerAuth(_usernameHash, evtMsg);
    }
    
    /** 
     * @dev fetch all the token transactions made for a particular meter
     * @param _meterSerial The id of the meter whose transaction history is required
     * @return _meterTransations An array of transactions mapped by the meterId
     */
    function getMeterTransactions(string memory _meterSerial) public returns (Transaction[] memory _meterTransactions){
        _meterTransactions = meterTransactions_map[_meterSerial];
        
        string memory evMsg = "meter transactions fetched successfully";
        if(_meterTransactions.length == 0)
            evMsg = "transactions not found";
        
        emit meterTrasactionsFetched(_meterTransactions, evMsg);
    }
    
     /** 
     * @dev fetch details of single meter token Transaction
     * @param _token The ID of the transaction to be fetched
     * @param _meterSerial The ID of the meter that owns transaction
     * @return _transaction Transaction details
     */
    function getTransaction(string memory _token, string memory _meterSerial) public returns (Transaction memory _transaction){
        Transaction[] memory _meterTransactions = getMeterTransactions(_meterSerial);
        
        // transaction search is more likely to be for recent transactions
        for(uint i=_meterTransactions.length - 1; i >= 0; i--){
            if(keccak256(abi.encodePacked(_meterTransactions[i].token)) == keccak256(abi.encodePacked(_token))){
                _transaction = _meterTransactions[i];
                break;
            }
        }
        string memory evMsg = "meter transaction fetched successfully";
        
        if(_transaction.id < 1)
            evMsg = "transaction not found";
        
        emit trasactionFetched(_transaction, evMsg);
    }
}