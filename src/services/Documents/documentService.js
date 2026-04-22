const API_URL = 'http://localhost:5000/api/doc';

export const uploadDocumentService = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Error in uploadDocumentService:', error);
        return { success: false, message: error.message };
    }
};

export const getDocumentsBySessionService = async (sessionID) => {
    try {
        const response = await fetch(`${API_URL}/session/${sessionID}`);
        return await response.json();
    } catch (error) {
        console.error('Error in getDocumentsBySessionService:', error);
        return { success: false, message: error.message };
    }
};

export const getDocumentsBySessionAndOperationService = async (sessionID, operationID) => {
    try {
        const response = await fetch(`${API_URL}/session/${sessionID}/operation/${operationID}`);
        return await response.json();
    } catch (error) {
        console.error('Error in getDocumentsBySessionAndOperationService:', error);
        return { success: false, message: error.message };
    }
};
