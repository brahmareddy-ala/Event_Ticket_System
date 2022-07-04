import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

export default function ViewTickets({eventId, nft, price, imagePath }) {
  const [loading, setLoading] = useState(true)
  const [allTickets, setAllTickets] = useState([])
  const navigate = useLocation();
  console.log(navigate);

  const loadAllTicktesForEvent = async () => {
    let ticketFilter = nft.filters.NewTicket();
    let tickets = await nft.queryFilter(ticketFilter);

    if (tickets.length > 0) {
        var data = [];
        for (var counter = 0; counter < tickets.length; counter++) {
          if(parseInt(tickets[counter].args.id) === parseInt(eventId) ) {
              data.push({
                key: parseInt(tickets[counter].args.ticketId),
                sold: tickets[counter].args.sold === false ? "UNSOLD": "SOLD"
              });
          }
        }
        console.log(data);
        setAllTickets(data);
    }      
    setLoading(false);
  }
  useEffect(() => {
    loadAllTicktesForEvent()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  const buyTicket = async(event, ticketId) => {
    try{
      await nft.purchaseTicket(eventId, ticketId, {value: ethers.utils.formatEther(price)});
    } catch(error) {
      console.log("Error in purchasing ticket: ", error)
    }
  }

  return (
    <div className="flex justify-center">
      {allTickets.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>All Tickets</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {allTickets.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                <Card.Img variant="top" src={imagePath} />
                <Card.Text>{item.key}</Card.Text>
                <Card.Text>{item.sold}</Card.Text>
                <Card.Footer>{price} ETH</Card.Footer>                  
                </Card>
                <button disabled={item.sold === "SOLD"} onClick={event => buyTicket(item.key)}>Buy</button>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Tickets to display</h2>
          </main>
        )}
    </div>
  );
}