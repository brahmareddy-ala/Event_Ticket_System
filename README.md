# Network: Ropsten, Contract Address: 0xDeDeb1df9b1a3e22c7939b7a744C6775FB8256d1

Application to create events using NFT technology

Create a simple web app where users can create events, but events are represented by NFTs. So when a user creates an event, the backend should mint a NFT containing the details of the event in the user's address.
When the user enters the app he must be asked to connect to his wallet (Metamask). Now there are 2 sections, the first section should include a list of created events and the second section should include an option to create an event.
When the user clicks the create event option the following detail should be asked.

1. Name of the event
2. Description of the event
3. Cover image for the event
4. How many tickets for the event
5. Price to attend the event

Once the user enters all the details, the backend should basically create a Collection with the above details and the number of tickets mentioned will be used to create NFTs for that event.
Now the event can show up in the list which should be clickable and show all the NFTs (tickets) that can be purchased under that collection. You don’t have to build the purchase of the NFT code but it could be a bonus.

What do we expect?
- Use React to build the web application.
- Use either Ethereum, smartBCH, Avalanche or Polygon to deploy the smart contract
- Clean, documented and structured code.
- Use of design patterns.
- Well thought out architecture.
- More than 2 test cases.
