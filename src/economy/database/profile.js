const { Client } = require('pg')

module.exports = async (message, args) => {
    const client = new Client()
    await client.connect()
    const res = await client.query('')
    console.log(res) // Hello world!
    await client.end()
}