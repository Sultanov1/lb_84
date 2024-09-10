import express from 'express';

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());

const run = async () => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

run().catch(console.error);