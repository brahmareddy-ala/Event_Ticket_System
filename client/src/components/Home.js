import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';

export default function Home({nft, account }) {
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();

  const loadAllEvents = async () => {
    let eventFilter = nft.filters.NewEvent();
    let events = await nft.queryFilter(eventFilter);

    if (events.length > 0) {
        var data = [];
        for (var counter = 0; counter < events.length; counter++) {
          if(events[counter].args.owner.toLowerCase() !== account) {
              data.push({
                key: parseInt(events[counter].args.id),
                name: events[counter].args.name,
                description: events[counter].args.description,
                imagePath: events[counter].args.imagePath,
                maxTickets: events[counter].args.maxTickets.toNumber(),
                price: events[counter].args.price
              });
          }
        }
        console.log(data);
        setAllEvents(data);
    }      
    setLoading(false);
  }
  useEffect(() => {
    loadAllEvents()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  
  const viewTickets = async(event, eventId, price, imagePath) => {    
    navigate('/view-tickets', {"eventId": eventId, "nft": nft, "price": price, "imagePath": imagePath}, {state: {"eventId": eventId, "nft": nft, "price": price, "imagePath": imagePath}});
  }

  return (
    <div className="flex justify-center">
      {allEvents.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>All Events</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {allEvents.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <button onClick={event => viewTickets(event, item.key, item.price, item.imagePath)}>
                    <Card>
                    <Card.Img variant="top" src={item.imagePath} />
                    <Card.Text>{item.name}</Card.Text>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Text>{item.maxTickets}</Card.Text>
                    <Card.Footer>{ethers.utils.formatEther(item.price)} ETH</Card.Footer>                  
                    </Card>
                </button>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No events to display</h2>
          </main>
        )}
    </div>
  );
}