import api from '../utils/api';
import * as yup from 'yup';

const addAnnonceApi = `http://localhost:5000/api/ann/addAnnonce`;
const getAllAnnoncesApi = `http://localhost:5000/api/ann/AllAnnonces`;
const deleteAnnonceApi = (id) => `http://localhost:5000/api/ann/deleteAnnonce/${id}`;
const updateAnnonceApi = 'http://localhost:5000/api/ann/updateAnnonce';

const annonceSchema = yup.object().shape({
    Id_Operation: yup.string().required(),
    Numero: yup.string().required(),
    Date_Publication: yup.string().required(),
    Journal: yup.string().required(),
    Delai: yup.string().required(),
    Date_Overture: yup.string().required(),
    Heure_Ouverture: yup.string(),
    adminId: yup.string().required(),
});

export const newAnnonce = (formData) => {
    return api(addAnnonceApi, 'POST', formData, annonceSchema);
};

export const getAllAnnonces = (adminID) => {
    const url = new URL(getAllAnnoncesApi);
    url.searchParams.append('adminID', adminID);
    
    return api(url.toString(), 'GET')
        .then(data => {
            if (data.success) {
                return data.annonces.filter(a => a.Status === 1);
            } else {
                throw new Error(data.message || 'Failed to fetch annonces');
            }
        });
};

export const deleteAnnonce = (id) => {
    return api(deleteAnnonceApi(id), 'DELETE');
};

export const updateAnnonce = (formData) => {
    return api(updateAnnonceApi, 'PUT', formData);
};
