var env = process.env.NODE_ENV || 'development' // set environment
var dotenv = require('dotenv')
dotenv.config({ path: `.env/${env}.env`}) // set .env variables
var config = require(`./environments/${env}.cjs`); 

module.exports = config;

var dotenv = require('dotenv')
dotenv.config()
