const addAnnonceApi = `http://localhost:5000/api/ann/addAnnonce`;
const getAllAnnoncesApi = `http://localhost:5000/api/ann/AllAnnonces`;
const deleteAnnonceApi = (id) =>
  `http://localhost:5000/api/ann/deleteAnnonce/${id}`;
const updateAnnonceApi = 'http://localhost:5000/api/ann/updateAnnonce';


export const newAnnonce = async (formData) => {
  try {
    const response = await fetch(addAnnonceApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur ajout annonce:', error);
    throw error;
  }
};

export const getAllAnnonces = async () => {
  try {
    const adminID = localStorage.getItem('userID');
    if (!adminID) {
      throw new Error('adminID (userID) non trouvé dans le localStorage');
    }

    const url = `${getAllAnnoncesApi}?adminID=${adminID}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    return data.annonces.filter(a => a.Status === 1);
  } catch (error) {
    console.error('Erreur récupération annonces:', error);
    throw error;
  }
};

export const deleteAnnonce = async (id) => {
  try {
    const response = await fetch(deleteAnnonceApi(id), { method: 'DELETE' });
    const data = await response.json();
    return { success: data.success === true || data.code === 0, ...data };
  } catch (error) {
    console.error('Erreur suppression annonce:', error);
    throw new Error(error.message);
  }
};

export const updateAnnonce = async (formData) => {
  try {
    console.log('Mise à jour annonce:', formData);

    const response = await fetch(updateAnnonceApi, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log('Réponse mise à jour:', data);
    return data;

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’annonce:', error);
    throw new Error(error.message);
  }
};
