import {getRandomInteger} from '../utils.js';

const generateDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.'
  ];

  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

const generateName = () => {
  const names = ['London', 'Paris', 'Berlin', 'Moscow', 'Rome', 'Instanbul', 'Madrid', 'Budapest'];

  const randomIndex = getRandomInteger(0, names.length - 1);

  return names[randomIndex];
};

const generatePictures = () => {
  const randomIndex = getRandomInteger(1, 100);
  const srcPicture1 = `http://picsum.photos/248/152${randomIndex}`;
  const descriptionPicture1 = `Random picture number 152${randomIndex}`;
  const srcPicture2 = `http://picsum.photos/248/152${randomIndex}`;
  const descriptionPicture2 = `Random picture number 152${randomIndex}`;
  return [{
    src: srcPicture1,
    description: descriptionPicture1
  },
  {
    src: srcPicture2,
    description: descriptionPicture2
  }];
};

export const getDestination = () => ({
  id: getRandomInteger(1, 100),
  description: generateDescription(),
  name: generateName(),
  basePrice: getRandomInteger(1100, 1900),
  pictures: generatePictures()
});

