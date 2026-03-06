// simple Next.js app router handler for NGO registration applications

export async function POST(request) {
    try {
        const data = await request.json()
        // in production you might store this in a database or forward via email
        console.log('NGO application received:', data)
        // append to a file (optional), for example:
        // const fs = require('fs');
        // fs.appendFileSync('ngo-applications.log', JSON.stringify(data) + '\n');

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err) {
        console.error('failed to parse NGO application', err)
        return new Response(JSON.stringify({ error: 'invalid payload' }), { status: 400 })
    }
}