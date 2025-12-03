import api from '../utils/api';
import * as yup from 'yup';

const addSupplierApi = 'http://localhost:5000/api/supplier/addSupplier';

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
    console.log('🔍 Checking adminID:', formData.adminID);
  
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
