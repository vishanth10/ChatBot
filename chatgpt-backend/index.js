const dotenv = require('dotenv');
const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies
app.use(cors());  // Enable CORS for all requests

// Configure the OpenAI API with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize context memory
let context = [];

// POST endpoint to get a response from OpenAI
app.post('/getResponse', async (req, res) => {
    const userQuery = req.body.query;  // Get the user query from the request body
     // Get the prompt from the query string
    if (!userQuery) {
        return res.status(400).send('No query provided');
    }

    // Append user query to context
    context.push({ role: "user", content: userQuery });

    try {
        // Create the prompt from the context
        const chatCompletion = await openai.chat.completions.create({
            messages: context,
            model: "gpt-4-turbo",
        });
        console.log(chatCompletion.choices[0]);
        const chatGptResponse = chatCompletion.choices[0].message.content.trim();

        // Append ChatGPT response to context
        context.push({ role: "assistant", content: chatGptResponse });

        res.json({ response: chatGptResponse });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).send('Error processing your request');
    }
});

// POST endpoint to get a response from ARES
app.post('/getApi', async (req, res) => {
    const userQuery = req.body.query;  // Get the user query from the request body
    if (!userQuery) {
        return res.status(400).send('No query provided');
    }

    const apiUrl = 'https://api-ares.traversaal.ai/live/predict';
    const apiKey = process.env.ARES_API_KEY;

    const requestData = {
        query: [userQuery]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestData)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error calling external API:', error);
        res.status(500).send('Error processing your request');
    }
});

app.get('/', (_, res) => {
    res.send('Hello World!');
});

// Start the server on port 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



// // const dotenv = require('dotenv');
// // const OpenAI = require('openai');
// // const express = require('express');

// // dotenv.config();
// // const app = express()
// // app.use(express.json());  // Middleware to parse JSON bodies

// // // Configure the OpenAI API with your API key
// // const openai = new OpenAI({
// //   apiKey: process.env.API_KEY,
// // const userQuery = "what is the capital of France";  
// // const userQuery = "what is the capital of India"; 
// // });




