import api from '../utils/api';
import * as yup from 'yup';

const addSupplierApi = 'http://localhost:5000/api/supplier/addSupplier';
const getAllSuppliersApi = `http://localhost:5000/api/supplier/getAllSuppliers`;
const deleteSupplierApi = (id) => `http://localhost:5000/api/supplier/deleteSupplier/${id}`;
const updateSupplierApi = 'http://localhost:5000/api/supplier/updateSupplier';


const supplierSchema = yup.object().shape({
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
    console.log('📤 Sending supplier data:', formData);
    console.log('🔍 Checking adminId:', formData.adminId);
  
    const dataToSend = {
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
    
    console.log('📨 Final data to send:', dataToSend);
    
    return api(addSupplierApi, 'POST', dataToSend, supplierSchema);
};

export const getAllSuppliers = async (adminID) => {
    const urlWithParams = `${getAllSuppliersApi}?adminID=${encodeURIComponent(adminID)}`;
    console.log('📥 Fetch all suppliers with adminID: ',adminID);
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

export const updateSupplier = async (formData) => {
    try {
        const dataToSend = {
            Id: formData.Id,
            NomSociete: formData.NomSociete,
            NatureJuridique: formData.NatureJuridique,
            Adresse: formData.Adresse,
            Telephone: formData.Telephone,
            Email: formData.Email,
            AgenceBancaire: formData.AgenceBancaire
        };

        const res = await api(updateSupplierApi, 'PUT', dataToSend);
        return res;
    } catch (error) {
        console.error('Frontend error (updateSupplier):', error);
        return { code: 5000 };
    }
};
