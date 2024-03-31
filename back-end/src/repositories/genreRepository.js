// repositories/GenreRepository.js
const Genre = require("../models/genre");

class GenreRepository {
  async createGenre(data) {
    return await Genre.create(data);
  }

  async getAllGenres() {
    return await Genre.find();
  }

  async getGenreById(id) {
    return await Genre.findById(id);
  }

  async updateGenre(id, data) {
    return await Genre.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteGenre(id) {
    return await Genre.findByIdAndDelete(id);
  }
}

module.exports = new GenreRepository();
