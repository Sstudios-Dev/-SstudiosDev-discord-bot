const fs = require('fs');
const path = require('path');
const { downloadImage } = require('imagen-core');

async function getRandomAnimeImageUrl() {
  const animeImageUrl = 'https://raw.githubusercontent.com/Sstudios-Dev/image-core/main/src/img-anime/';
  const randomNumber = Math.floor(Math.random() * 207) + 1; // Assuming there are 1000 images
  const imageName = `img-anime${randomNumber}.jpg`;
  return `${animeImageUrl}${imageName}`;
}

async function downloadRandomAnimeImage() {
  const animeImageUrl = await getRandomAnimeImageUrl();
  const directory = './anime-images';

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  try {
    await downloadImage(animeImageUrl, path.join(directory, 'img-anime.jpg'));
    console.log('Anime image downloaded');
  } catch (error) {
    throw new Error(`Failed to download image ${animeImageUrl}: ${error.message}`);
  }
}

module.exports = { getRandomAnimeImageUrl, downloadRandomAnimeImage };
