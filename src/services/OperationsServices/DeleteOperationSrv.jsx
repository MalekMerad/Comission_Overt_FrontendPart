const deltOperationsApi = 'http://localhost:5000/api/opr/delOperation';

export const deleteOperation = async (operationId)=>{
    console.log('Deleted operation id: ',operationId);
    try {
        const response = await fetch(deltOperationsApi,{
            method : 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                idOperation : operationId,
            })
        })
       
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Delete Operation error:', error);
        throw new Error(`Network error: ${error.message}`);
    }
}