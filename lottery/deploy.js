const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')

require('dotenv').config()

const { interface, bytecode } = require('./compile')

const provider = new HDWalletProvider(
  process.env.ACCOUNT_MNEMONIC,
  process.env.INFURA_ENDPOINT
)
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  console.log('Attempting to deploy from account', accounts[0])

  const result = await new web3.eth
    .Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({
      from: accounts[0],
      gas: `${1_000_000}`
    })

  console.log('Contract deployed to', result.options.address)
}

// DEPLOY!
deploy()