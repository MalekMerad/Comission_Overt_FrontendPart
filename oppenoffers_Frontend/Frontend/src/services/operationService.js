import api from '../utils/api';
import * as yup from 'yup';

const addOperationApi = 'http://localhost:5000/api/opr/addOperation';
const getAllOperationsApi = 'http://localhost:5000/api/opr/AllOperations';
const deleteOperationApi = (numOperation) => `http://localhost:5000/api/opr/deleteOperation/${numOperation}`;
const manageArchiveOperationApi = (id) => `http://localhost:5000/api/opr/manageArchiveOperation/${id}`;

const operationSchema = yup.object().shape({
    NumOperation: yup.string().required(),
    ServContract: yup.string().required(),
    Objectif: yup.string().required(),
    TravalieType: yup.string().required(),
    BudgetType: yup.string().required(),
    MethodAttribuation: yup.string().required(),
    VisaNum: yup.string().required(),
    DateVisa: yup.date().required(),
    adminID: yup.string().required(),
});

export const newOperation = (formData) => {
    console.log(' Sending operation data:', formData);
    return api(addOperationApi, 'POST', formData, operationSchema);
};

export const getOperations = (adminID) => {
    if (!adminID) {
        return Promise.reject(new Error('adminID is required'));
    }
    
    const urlWithParams = `${getAllOperationsApi}?adminID=${encodeURIComponent(adminID)}`;
    return api(urlWithParams, 'GET')
        .then(data => data.data || []);
};

export const deleteOperationService = async (numOperation) => {
    try {
      const res = await api(deleteOperationApi(numOperation), 'DELETE');
      
      // Handle all cases like the supplier service
      switch (res.code) {
        case 0:
          return {
            success: true,
            code: 0,
            message: "Opération archivée avec succès."
          };
        case 1000:
          return {
            success: false,
            code: 1000,
            message: "Impossible d'archiver cette opération car elle est liée à des fournisseurs."
          };
        case 1005:
          return {
            success: false,
            code: 1005,
            message: "Opération introuvable."
          };
        default:
          return {
            success: false,
            code: res.code || 5000,
            message: res.message || "Erreur interne serveur SQL lors de l'archivage de l'opération."
          };
      }
    } catch (error) {
      return {
        success: false,
        code: 5000,
        message: "Erreur lors de l'archivage de l'opération.",
        error: error.message
      };
    }
  };
export const manageArchiveOperation = async (id) => {
    if (!id) {
        return Promise.reject(new Error('Operation id is required'));
    }
    return api(manageArchiveOperationApi(id), 'PATCH');
};