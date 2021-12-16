import express from 'express';
const cors = require('cors');
const compression = require('compression')

import { YoutubeDl } from "./YoutubeDl";

const AllowedHosts: string[] = ["www.twitch.tv", "twitch.tv", "www.youtube.com", "youtube.com", "youtu.be"];

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());
app.use(cors());

app.get('/v1/video', async (req, res) => {
    try {
        const unsafeUrl = req.query.url as string;
        if (!unsafeUrl) return res.sendStatus(400);

        let schema = req.query.schema;
        if (schema && !Array.isArray(schema)) return res.sendStatus(400);

        const sanitizedUrl = new URL(unsafeUrl);
        if (!AllowedHosts.includes(sanitizedUrl.hostname)) return res.sendStatus(400);

        let metadata = await YoutubeDl.getVideoMetadata(sanitizedUrl.href, undefined, schema as string[]);
        res.json(metadata);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

/*
app.get('/watch', async (req, res) => {
    try {
        const v = req.query.v as string;
        if (!v) return res.sendStatus(400);

        let metadata = await YoutubeDl.getVideoMetadata(v, undefined, ['url']);
        res.redirect(metadata.url);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});
*/

app.listen(port, () => {
    return console.log(`server is listening on http://localhost:${port}`);
});
