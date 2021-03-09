const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

// From the contract object
const { interface, bytecode } = require('../compile')

const web3 = new Web3(ganache.provider())

const INITIAL_MESSAGE = 'Hi there!'

let accounts
let inbox

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
  // Use one of those accounts to deploy the contract
  // "inbox" object become a javascript representation of the contract
  inbox = await new web3.eth
    // Teaches web3 about what methods an Inbox contract has
    .Contract(JSON.parse(interface))
    // Tells web3 to deploy a new copy of this contract
    .deploy({
      data: bytecode,
      // This is the "initialMessage" for the Inbox contract constructor
      arguments: [INITIAL_MESSAGE]
    })
    // Instruct web3 to send out a transaction that creates this contract
    .send({
      from: accounts[0],
      gas: `${1_000_000}`
    })
})

describe('Inbox', () => {
  it('deploys a contract', () => {
    // .ok means "exists/isDefined"
    assert.ok(inbox.options.address)
  })

  it('has a default message', async () => {
    // Get the Inbox.message property
    // message() : pass argument to the function
    // call() : customize how the function get called
    const message = await inbox.methods.message().call()
    assert.strictEqual(message, INITIAL_MESSAGE)
  })

  it('can change the message', async () => {
    const newMessage = 'bye'
    // Send a transaction
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.strictEqual(message, newMessage)
  })
})