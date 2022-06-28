import { Client } from 'pg';
import 'dotenv/config';


async function query(q: string, v?: any)  {

    let client: Client;

    try {
        client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        await client.connect();

        return await client.query(q, v);
    }
    finally {
        if (client) await client.end()
    }

}


async function getLastMention() {
    const res = await query('select * from lastmention');

    return res.rows?.[0];
}

async function updateLastMention(lastmention: any) {
    const res = await query("update lastmention set id=$1, last_access=now()", [lastmention.id])
}


export { getLastMention, updateLastMention  }

