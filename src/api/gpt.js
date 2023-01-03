import axios from 'axios';

const apiUrl = 'https://coral-app-lwbsa.ondigitalocean.app';

export default async function getImagesFromText(text, ip) {
  try {
    const res = await axios.post(`${apiUrl}/generate_image`, { text, ip });
    const result = res.data;
    return result.images;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getImagesFromTextSecond(text, ip) {
  try {
    const res = await axios.post(`${apiUrl}/generate_image_2`, { text, ip });
    const result = res.data;
    return result.images;
  } catch (e) {
    console.log(e);
    return [];
  }
}
export async function getImagesFromTextLast(text, ip) {
  try {
    const res = await axios.post(`${apiUrl}/generate_image_3`, { text, ip });
    const result = res.data;
    return result.images;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export const getVariationsFromImages = async formData => {
  const res = await axios.post(`${apiUrl}/modify_image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const result = res.data;

  return result.images;
};

export const getPopularImages = async () => {
  try {
    const res = await axios.get(`${apiUrl}/latest`);
    const result = res.data;

    return result.images;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getFavouriteImages = async ip => {
  try {
    const res = await axios.get(`${apiUrl}/favourites?ip=${ip}`);
    const result = res.data;
    return result.images;
  } catch (e) {
    console.log(e);
    return [];
  }
};
