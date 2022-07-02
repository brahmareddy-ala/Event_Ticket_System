// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EventTicketSystem
 * @author Brahma Reddy
 * @dev this contract is based on ERC721
 */
contract EventTicketSystem is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    event NewEvent(uint256 indexed id, string name, string description, string imagePath, uint256 maxTickets, uint256 price, address owner);

    event NewTicket(uint256 indexed id, uint256 ticketId, bool sold);

    event PurchaseTicket(uint256 indexed id, uint256 ticketId, bool sold);

    struct Event {
        string name;
        string description;
        string imagePath;
        uint256 maxTickets;
        uint256 price;
        uint256 ticketsMinted;
        address owner;
    }

    struct Ticket {
        bool sold;
        uint256 eventId;
    }

    mapping(uint256 => Event) public events;
    Counters.Counter _eventIds;

    mapping(uint256 => Ticket) public tickets;

    constructor() ERC721("Event Ticket System", "ETS") {}

    // Modifier to check that the caller is the owner of event
    modifier onlyEventOwner(uint256 _eventId) {
        require(msg.sender == events[_eventId].owner, "Not a event owner.");
        _;
    }

    // Create new event
    function createEvent(string memory _name, string memory _description, 
             string memory _imagePath, uint256 _ticketCount, uint256 _price) public {
        uint256 _eventId = _eventIds.current();
        Event memory _event = Event(_name, _description, _imagePath, _ticketCount, _price, 0, msg.sender);
        events[_eventId] = _event;
        _eventIds.increment();
        _mintAllTickets(_eventId);  
        emit NewEvent(_eventId, _name, _description, _imagePath, _ticketCount, _price, msg.sender);
    }

    function _mintAllTickets(uint256 _eventId) private {
        uint256 tokenId;
        for(uint256 i = 0; i < events[_eventId].maxTickets; i++) {
            _tokenIds.increment();
            tokenId = _tokenIds.current();
            tickets[tokenId] = Ticket(false, _eventId);  
            _safeMint(msg.sender, tokenId);
            emit NewTicket(_eventId, tokenId, false);
        }
    }

    function mintTicket(uint256 _eventId) public onlyEventOwner(_eventId) returns(uint256 _ticketId){
        require(events[_eventId].maxTickets >= events[_eventId].ticketsMinted, "No more tickets to min");
        _ticketId = _tokenIds.current();
        tickets[_ticketId] = Ticket(false, _eventId);
        _safeMint(msg.sender, _ticketId);
        _tokenIds.increment();
        emit NewTicket(_eventId, _ticketId, false);
    }

    function purchaseTicket(uint256 _eventId, uint256 _ticketId) public payable {
        require(events[_eventId].price == msg.value, "value should be equlas to the ticket price");
        require(balanceOf(events[_eventId].owner) > 0, "owner does not have tickets to sell");        
        _safeTransfer(events[_eventId].owner, msg.sender, _ticketId, "");
        tickets[_ticketId].sold = true;
        emit PurchaseTicket(_eventId, _ticketId, true);
    }
}