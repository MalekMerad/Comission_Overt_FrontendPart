import api from '../utils/api';
import * as yup from 'yup';

const addOperationApi = 'http://localhost:5000/api/opr/addOperation';
const getAllOperationsApi = 'http://localhost:5000/api/opr/AllOperations';
const deleteOperationApi = (numOperation) => `http://localhost:5000/api/opr/deleteOperation/${numOperation}`;

const operationSchema = yup.object().shape({
    NumOperation: yup.string().required(),
    ServContract: yup.string().required(),
    Objectif: yup.string().required(),
    TravalieType: yup.string().required(),
    BudgetType: yup.string().required(),
    MethodAttribuation: yup.string().required(),
    VisaNum: yup.string().required(),
    DateVisa: yup.date().required(),
    adminId: yup.string().required(),
});

export const newOperation = (formData) => {
    console.log('📤 Sending operation data:', formData);
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

export const deleteoperation = (numOperation) => {
    return api(deleteOperationApi(numOperation), 'DELETE');
};