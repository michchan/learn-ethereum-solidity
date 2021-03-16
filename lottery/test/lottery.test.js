const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

// From the contract object
const { interface, bytecode } = require('../compile')

const web3 = new Web3(ganache.provider())

let accounts
let lottery

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
  // Use one of those accounts to deploy the contract
  // "lottery" object become a javascript representation of the contract
  lottery = await new web3.eth
    // Teaches web3 about what methods an Lottery contract has
    .Contract(JSON.parse(interface))
    // Tells web3 to deploy a new copy of this contract
    .deploy({ data: bytecode })
    // Instruct web3 to send out a transaction that creates this contract
    .send({
      // The 'manager'
      from: accounts[0],
      gas: `${1_000_000}`
    })
})

describe('Lottery Contract', () => {
  it('can be deployed', () => {
    // .ok means "exists/isDefined"
    assert.ok(lottery.options.address)
  })

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    assert.strictEqual(accounts[0], players[0])
    assert.strictEqual(players.length, 1)
  })

  it('allows multiple accounts to enter', async () => {
    await Promise.all(accounts.map(account => lottery.methods.enter().send({
      from: account,
      value: web3.utils.toWei('0.02', 'ether')
    })))

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    accounts.forEach((account, i) => assert.strictEqual(account, players[i]))
    assert.strictEqual(players.length, accounts.length)
  })

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200, // Wei
      }) 
      // Fail the test
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('allows only manager calling pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        // Not the 'manager'
        from: accounts[1]
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('sends money to the winner and resets players array', async () => {
    const paidEther = 2
    // Enter by paying the ether
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(`${paidEther}`, 'ether')
    })

    const initialBalance = await web3.eth.getBalance(accounts[0])
    // Receive the ether back (as account[0] here the only player)
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    // The finalBalance MUST not be same as 'paidEther'
    // Cost there should be transaction fee deducted.
    const finalBalance = await web3.eth.getBalance(accounts[0])
    
    const difference = finalBalance - initialBalance
    assert(difference > web3.utils.toWei(`${paidEther * 0.9}`, 'ether'))
    
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.strictEqual(players.length, 0)
  })
})