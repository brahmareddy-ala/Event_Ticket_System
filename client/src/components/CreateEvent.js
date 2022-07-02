import { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import ipfs from '../ipfs';
import { ethers } from "ethers"

const CreateEvent = ({nft}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [ticketCount, setTicketCount] = useState('')
    const [price, setPrice] = useState(null)  

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
          try {              
              const reader = new window.FileReader();
              reader.readAsArrayBuffer(file);
              reader.onloadend = async () => {                
              const imagePath = await ipfs.files.add(Buffer(reader.result));
              setImage(`https://ipfs.infura.io/ipfs/${imagePath[0].path}`);
            }
          } catch (error){
              console.log("ipfs image upload error: ", error);
          }
        }
    }
    const createEvent = async () => {
        if (!image || !price || !name || !description| !ticketCount) return
        try{
          console.log(image);
          await nft.createEvent(name, description, image, ticketCount, ethers.utils.parseEther(price.toString()));
        } catch(error) {
        console.log("Error in creating event: ", error)
        }
    }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setTicketCount(e.target.value)} size="lg" required type="number" placeholder="Ticket Count" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createEvent} variant="primary" size="lg" />
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateEvent