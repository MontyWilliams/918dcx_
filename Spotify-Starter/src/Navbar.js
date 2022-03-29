import {
  Link
} from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Button } from 'antd';

import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
  return (
      <Navbar expand="lg" bg="secondary" variant="dark">
          <div className="Navcontainer">
              <Navbar.Brand href="918dcx.com">
                  <img src={market} width="40" height="40" className="" alt="" />
                  &nbsp; 918
              </Navbar.Brand>
             
              
                  <Nav className="me-auto">
                      <Nav.Link as={Link} to="/">Home</Nav.Link>
                      <Nav.Link as={Link} to="/create">Create</Nav.Link>
                      <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                      <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                      <Nav.Link as={Link} to="/home2">Home2</Nav.Link>
                  </Nav>
                  <Nav>
                      {account ? (
                          <Nav.Link
                              href={`https://etherscan.io/address/${account}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="button nav-button btn-sm mx-4">
                              <Button variant="outline-light">
                                  {account.slice(0, 5) + '...' + account.slice(38, 42)}
                              </Button>

                          </Nav.Link>
                      ) : (
                          <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                      )}
                  </Nav>
        
          </div>
      </Navbar>
  )

}

export default Navigation;
