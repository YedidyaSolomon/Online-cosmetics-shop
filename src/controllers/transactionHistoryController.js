

import axios from 'axios';


export const transactionHistory = async (req, res) => {
    const path = req.path.toLowerCase()
    try {
        let url;
        if(path === '/success'){
           url = 'https://playground.tamcon.et:2727/api/transactions/successful'
        }
       else if(path === '/failed'){
          url = 'https://playground.tamcon.et:2727/api/transactions/failed'
        }
        else if(path === '/pending'){
             url = 'https://playground.tamcon.et:2727/api/transactions/pending'
        }else if(path === '/all'){
            url = 'https://playground.tamcon.et:2727/api/transactions/all'
        }
        else{
            return res.status(404).json({error: 'invalid path'})
        }
        
       const response =  await axios.get(url, {
            headers: {
                'Authorization' : `Bearer ${process.env.TOKEN}`,
                'x-api-key': process.env.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        return res.status(200).json(response.data)
    } catch (error) {
        console.error('transactionHistory error:', error);
        return res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
}