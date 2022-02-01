import { NextApiRequest, NextApiResponse } from "next"

// jwt (Storage)
// Next Auth (Social )
// Cognito, auth0

export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        { id: 1, name: 'Diego' },
        { id: 2, name: 'Dani' },
        { id: 3, name: 'Rafa' },
    ]
    return response.json(users)
}