import axios from 'axios';
export function upsertById(array, newElement) {
    const index = array.findIndex(element => element._id === newElement._id);
    if (index > -1) return [
        ...array.slice(0, index),
        newElement,
        ...array.slice(index + 1)
    ];
    return [...array, newElement];
}

export function stringInsensitiveIncludes(str, substr) {
  return normalizeStringAndRemoveDiacritics(str).toLowerCase().includes(
    normalizeStringAndRemoveDiacritics(substr).toLowerCase(),
  );
}

function normalizeStringAndRemoveDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const dateIsMoreThanSevenDaysAheadOfCurrentTime = date => {
  const now = new Date();
  const timeDiff = date.getTime() - now.getTime();
  return timeDiff / (1000 * 3600 * 24) > 7;
};


export function locationMaps(address) {
  const apiKey = 'API KEY GOOGLE MAPS';
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios.get(geocodeUrl)
      .then(response => {
        const data = response.data;
        console.log(data);
        if (data.status === 'OK' && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          console.log('Latitud:', lat);
          console.log('Longitud:', lng);
          resolve({ latitud: lat, longitud: lng });
        } else {
          console.log('No se pudo obtener la latitud y longitud para la dirección especificada.');
          reject(new Error('No se pudo obtener la latitud y longitud para la dirección especificada.'));
        }
      })
      .catch(error => {
        console.log('Error al obtener la latitud y longitud:', error);
        reject(error);
      });
  });
};