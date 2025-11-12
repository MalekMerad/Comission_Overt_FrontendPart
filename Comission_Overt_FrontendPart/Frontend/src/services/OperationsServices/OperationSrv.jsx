const addOperationApi = 'http://localhost:5000/api/opr/addOperation';
const getAllOperationsApi = 'http://localhost:5000/api/opr/AllOperations';
const deleteOperationApi = 'http://localhost:5000/api/opr/deleteOperation';

// Ajouter une opération
export const newOperation = async (formData) => {
  try {
    console.log('Sending operation data:', formData);
    
    const response = await fetch(addOperationApi, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        NumOperation: formData.NumOperation,
        ServContract: formData.ServContract,
        Objectif: formData.Objectif,
        TravalieType: formData.TravalieType,
        BudgetType: formData.BudgetType,
        MethodAttribuation: formData.MethodAttribuation,
        VisaNum: formData.VisaNum,
        DateVisa: formData.DateVisa,
        adminID: formData.adminId  
    })

    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add Operation error:', error);
    throw new Error(`Network error: ${error.message}`);
  }
};

// Récupérer toutes les opérations
export const getOperations = async () => {
  try {
    const adminID = localStorage.getItem('userID');
    
    if (!adminID) {
      console.error('adminID not found in localStorage');
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${getAllOperationsApi}?adminID=${adminID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];

  } catch (error) {
    console.error("Erreur lors de la récupération des opérations:", error);
    return [];
  }
};


export const deleteoperation = async (NumOperation) => {
  try {
    const response = await fetch(`${deleteOperationApi}/${NumOperation}`, {
      method: 'DELETE',
    });

    return await response.json();
  } catch (error) {
    console.error('Erreur suppression operation:', error);
    throw error;
  }
};
