const addNewLotApi =  'http://localhost:5000/api/lot/addLot';

export const NewLot = async ({ NumeroLot, id_Operation, Designation, adminId }) => {
    try {
        const response = await fetch(addNewLotApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                NumeroLot,
                id_Operation,
                Designation,
                adminId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || "Failed to add lot");
        }

        return data;
    } catch (error) {
        console.error('Add New Lot error:', error);
        throw new Error(`Network error: ${error.message}`);
    }
};
