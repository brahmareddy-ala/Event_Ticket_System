const EventTicketSystem = artifacts.require("../contracts/EventTicketSystem.sol");
const truffleAssert = require('truffle-assertions');

contract("EventTicketSystem", accounts => {
    it("...should create an event", async () => {
      const etsInstance = await EventTicketSystem.deployed();
  
      var tx = await etsInstance.createEvent("Event Ticket1","Description","Image Hash", 10, 1,{from: accounts[0]});

      truffleAssert.eventEmitted(tx, 'NewEvent', (ev) => {
        return ev.name === "Event Ticket";
        });
    });
  
    it("...should create an ticket", async () => {
      const etsInstance = await EventTicketSystem.deployed();

      var tx = await etsInstance.createEvent("Event Ticket2","Description","Image Hash", 10, 1,{from: accounts[0]});
      let eventId;
      truffleAssert.eventEmitted(tx, 'NewEvent', (ev) => {
        eventId = ev.id;
        return ev.name === "Event Ticket";
        });
  
      var tx = await etsInstance.mintTicket(eventId,{from: accounts[0]});
      truffleAssert.eventEmitted(tx, 'NewTicket', (ev) => {
        return ev.id === eventId;
        });
    });

    it("...should purchase minted ticket", async () => {
      const etsInstance = await EventTicketSystem.deployed();

      var tx = await etsInstance.createEvent("Event Ticket2","Description","Image Hash", 10, 1,{from: accounts[1]});
      let eventId;
      truffleAssert.eventEmitted(tx, 'NewEvent', (ev) => {
        eventId = ev.id;
        return ev.name === "Event Ticket";
        });
  
      var tx = await etsInstance.mintTicket(eventId,{from: accounts[0]});
      let ticketId;
      truffleAssert.eventEmitted(tx, 'NewTicket', (ev) => {
        ticketId = ev.ticketId;
        return ev.id === eventId;
        });

        var tx = await etsInstance.purchaseTicket(eventId, ticketId,{from: accounts[1]});
        truffleAssert.eventEmitted(tx, 'PurchaseTicket', (ev) => {
          return ev.id === eventId;
          });
    });
});