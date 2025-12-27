import api from '../utils/api';
import * as yup from 'yup';

const addAnnonceApi = `http://localhost:5000/api/ann/addAnnonce`;
const getAllAnnoncesApi = `http://localhost:5000/api/ann/AllAnnonces`;
const deleteAnnonceApi = (id) => `http://localhost:5000/api/ann/deleteAnnonce/${id}`;
const updateAnnonceApi = 'http://localhost:5000/api/ann/updateAnnonce';

const annonceSchema = yup.object().shape({
    Id_Operation: yup.string().required("L'identifiant d'opération est requis."),
    Numero: yup.string().required("Le numéro de l'annonce est requis."),
    Date_Publication: yup.string().required("La date de publication est requise."),
    Journal: yup.string().required("Le nom du journal est requis."),
    Delai: yup.string().required("Le délai est requis."),
    Date_Overture: yup.string().required("La date d'ouverture est requise."),
    Heure_Ouverture: yup.string().required("L'heure d'overture est requis"),
    adminId: yup.string().required("L'identifiant administrateur est requis."),
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
