const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

app.use(express.json());

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });
    return schema.validate({ name: "genre" });
}

const genres = [
    {id: 1, name: 'Horror'},
    {id: 2, name: 'Action'},
    {id: 3, name: 'Drama'},
    {id: 4, name: 'Comedy'}
];

app.get('/', (req, res) =>{
    res.send(`Welcome to Vidly`);
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.post('/api/genres', (req, res) =>{
    const {error} = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Error 404: This genre can not be found`);

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateGenre(req.body); //like result.error
    if (error) return res.status(400).send(error.details[0].message);
    // Update genre
    genre.name = req.body.name;
    // Return the genre
    res.send(genre);
});

app.delete('/api/genres/:id', (req,res) => {
    const course = genres.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`Error 404: The course can not be found`);

    // if does exist then delete
    const index = genres.indexOf(course);
    genres.splice(index, 1);
    // Return the same course to the client
    res.send(course);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`Error 404: The course can not be found`);
    res.send(genre);
});






const port = process.env.port || 3000
app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});