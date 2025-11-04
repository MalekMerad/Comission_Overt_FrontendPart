const getOperationsApi = 'http://localhost:5000/api/opr/operations';

export const getOperations = async (adminIDParam) => {
    const actualAdminID = adminIDParam || localStorage.getItem('userID');
    
    try {
        // Use GET with query parameter
        const response = await fetch(`${getOperationsApi}?adminID=${actualAdminID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Fetched operations result:", result);
        return result;
    } catch (error) {
        console.error('Get Operations error:', error);
        throw new Error(`Network error: ${error.message}`);
    }
}