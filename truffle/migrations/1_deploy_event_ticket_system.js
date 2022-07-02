const EventTicketSystem = artifacts.require("EventTicketSystem");

module.exports = function (deployer) {
  deployer.deploy(EventTicketSystem);
};