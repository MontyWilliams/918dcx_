# Basic Sample Hardhat Project
        # To do List 
         App.js handle l connect button event add state for if its connectsd


This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
<!-- 
    start the node: npx hardhat node
    run a script to deploy on the node: npx hardhat run src/scripts/deploy.js --network localhost
    start the console in that network: npx hardhat console --network local host
        
        Now you can get the methods within the contract!
        its just like importing methods in any OOP but blockchain style!

        use: const contract = await ethers.getContractAt(<"contract name">,<"contract addres">)
        
                output: undefined               this is good, it means the contract factory did its job

        I can then call methods from the newly created contract address!
        use: const tokenCount = await contract.tokenCount()

                output: undefined               good, it means the console is connected to the addy of 
                                                your local host, Crongrats bruh

        You can call the symbol as well because the contract factory did its job and everything is
        set up as it would be on a real blockchain

=========================================================================================================

When Deploying a contract hard hat will by Default take the first address on your local node
                                                (use: npx hardhat node)

MarketPlace      ...name of market place contract
NFT              ...name of nft contract

deploying the to contracts in this repo will mske you the msg.sender and allow you to call all the methods
from the console. congradulations bruh, its an nft marketplace all you gotta do is build the app and front-end

===========================================================================================================

once launched Dapps are immutable so testing is essential
Testscripts written using javascript with waffle and chai for assertion library

run: npx hardhat test

                ***** ERROR ******
for some reason the gewi calculations ad an extra 1  at the end of the estaimation so its slightly off
its like it rounds it up or something

the before each hook is used to reuse a portion of a test sctrpt so that you can essentially runn each test 
from a particular state
 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

The web3Handler is what allows a meta mask to connect to your app. It is the Gateway to the metaverse!!!
this Dapp uses the popular Ethers JS  library bruh, check it out: https://docs.ethers.io/v5/

        the web 3 handler is an async fynction that utilizes severl web3 methods and libraries

                 const web3Handler = async () => {
                 const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                 setAccount(accounts[0])
                 // Get provider from Metamask
                 const provider = new ethers.providers.Web3Provider(window.ethereum)
                 // Set signer
                 const signer = provider.getSigner()    

                 loadContracts(signer)
                }

=============================================================================================================================
Navbar
this component is passed in the web3 handler and account and has a display function as well

        the component is passed in react style using self openening and closing tags and then a handler function gets and splices the addy
     <Navigation web3Handler={web3Handler} account={account} />

 
 
 -->
