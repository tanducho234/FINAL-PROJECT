// controllers/genreController.js
const genreRepository = require("../repositories/genreRepository");
class GenreController {
    async createGenre(req, res) {
        try {
            const genre = await genreRepository.createGenre(req.body);
            res.status(201).json(genre);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getAllGenres(req, res) {
        try {
            const genres = await genreRepository.getAllGenres();
            res.json(genres);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getGenreById(req, res) {
        try {
            const genre = await genreRepository.getGenreById(req.params.id);
            if (!genre) {
                return res.status(404).json({ error: 'Genre not found' });
            }
            res.json(genre);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateGenre(req, res) {
        try {
            const genre = await genreRepository.updateGenre(req.params.id, req.body, { new: true });
            if (!genre) {
                return res.status(404).json({ error: 'Genre not found' });
            }
            res.json(genre);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async deleteGenre(req, res) {
        try {
            const genre = await genreRepository.deleteGenre(req.params.id);
            if (!genre) {
                return res.status(404).json({ error: 'Genre not found' });
            }
            res.json(genre);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
        
module.exports = new GenreController();