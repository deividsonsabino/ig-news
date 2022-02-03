import { Client } from 'faunadb'
import { env } from 'process'

export const fauna = new Client({
    secret: process.env.FAUNADB_KEY
})