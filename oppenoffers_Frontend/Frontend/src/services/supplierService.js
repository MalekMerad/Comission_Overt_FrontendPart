import api from '../utils/api';
import * as yup from 'yup';

const addSupplierApi = 'http://localhost:5000/api/supplier/addSupplier';
const getAllSuppliersApi = `http://localhost:5000/api/supplier/getAllSuppliers`;
const deleteSupplierApi = (id) => `http://localhost:5000/api/supplier/deleteSupplier/${id}`;
const updateSupplierApi = 'http://localhost:5000/api/supplier/updateSupplier';


const supplierSchema = yup.object().shape({
    NomPrenom: yup.string().required(),
    NomSociete: yup.string().required(),
    NatureJuridique: yup.string().required(),
    Adresse: yup.string().required(),
    Telephone: yup.string().required(),
    Rc: yup.string().required(),
    Nif: yup.string().required(),
    Rib: yup.string().required(),
    Email: yup.string().email().required(),
    Ai: yup.string().required(),
    AgenceBancaire: yup.string().required(),
    adminId: yup.string().required(),
});

export const newSupplier = (formData) => {
  const dataToSend = {
    NomPrenom: formData.NomPrenom,
    NomSociete: formData.NomSociete,
    NatureJuridique: formData.NatureJuridique,
    Adresse: formData.Adresse,
    Telephone: formData.Telephone,
    Rc: formData.Rc,
    Nif: formData.Nif,
    Rib: formData.Rib,
    Email: formData.Email,
    Ai: formData.Ai,
    AgenceBancaire: formData.AgenceBancaire,
    adminId: formData.adminId || formData.adminID || ''
  };

  return api(addSupplierApi, 'POST', dataToSend, supplierSchema)
    .then(result => {
      if (result.code === 0) {
        return { success: true, code: 0, supplier: dataToSend };
      } else {
        return { success: false, code: result.code, message: result.message };
      }
    });
};


export const getAllSuppliers = async (adminID) => {
    const urlWithParams = `${getAllSuppliersApi}?adminID=${encodeURIComponent(adminID)}`;
    console.log(' Fetch all suppliers with adminID: ',adminID);
    return api(urlWithParams, 'GET');
};

export const deleteSupplier = async (id) => {
    try {
        const res = await api(deleteSupplierApi(id), 'DELETE');
        return res;
    } catch (error) {
        console.error('Error deleting supplier:', error);
        return { success: false };
    }
};

export const updateSupplier = async (formData, showToast) => {
    try {
        const dataToSend = {
            Id: formData.Id,
            NomPrenom: formData.NomPrenom,
            NomSociete: formData.NomSociete,
            NatureJuridique: formData.NatureJuridique,
            Adresse: formData.Adresse,
            Telephone: formData.Telephone,
            Email: formData.Email,
            AgenceBancaire: formData.AgenceBancaire
        };

        const res = await api(updateSupplierApi, 'PUT', dataToSend);

        switch (res.code) {
            case 0:
                showToast('Fournisseur mis à jour avec succès !', 'success');
                break;
            case 1004:
                showToast('Le téléphone est déjà utilisé.', 'warning');
                break;
            case 1007:
                showToast('L\'email est déjà utilisé.', 'warning');
                break;
            case 5000:
                showToast('Erreur serveur lors de la mise à jour.', 'error');
                break;
            default:
                showToast('Erreur inconnue.', 'error');
        }

        return res;
    } catch (error) {
        console.error('Frontend error (updateSupplierService):', error);
        showToast('Erreur de connexion au serveur.', 'error');
        return { code: 5000 };
    }
};
