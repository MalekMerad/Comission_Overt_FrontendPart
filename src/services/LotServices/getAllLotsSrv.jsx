export const getAllLotsApi = 'http://localhost:5000/api/lot/getLots';

export const getAllLots = async (adminID) => {
    try {
        const url = `${getAllLotsApi}?adminID=${encodeURIComponent(adminID)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch lots');
        }
        console.log('Lots data: ',data);
        return data;
    } catch (error) {
        console.error('Get All Lots error:', error);
        throw new Error(`Network error: ${error.message}`);
    }
};