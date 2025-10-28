// AddOperationSrv.jsx
const addOperationApi = 'http://localhost:5000/api/opr/addOperation';

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
                DateVisa: formData.DateVisa
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
}