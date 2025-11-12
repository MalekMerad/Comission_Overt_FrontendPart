const addLotApi = 'http://localhost:5000/api/lot/addLot';
const getAllLotsApi = 'http://localhost:5000/api/lot/getAllLots';
const updateLotApi = (lotId) => `http://localhost:5000/api/lot/updateLot/${lotId}`;
const deleteLotApi = 'http://localhost:5000/api/lot/deleteLot';

export const addNewLotService = async (formData) => {
  try {
    console.log(" Envoi Lot:", formData);
    const response = await fetch(
      addLotApi,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NumeroLot: formData.NumeroLot,
          Designation: formData.Designation,
          id_Operation: formData.Id_Operation, 
          adminId: formData.adminId
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(" Erreur réseau AddLot:", error);
    throw error;
  }
};

export const getAllLotsService = async () => {
  try {
    const adminID = localStorage.getItem('userID');
    
    if (!adminID) {
      throw new Error("adminID not found in localStorage");
    }

    const url = `${getAllLotsApi}?adminID=${adminID}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Get lots response:', data);
    return data;

  } catch (error) {
    console.error(" Erreur réseau GetLots:", error);
    throw error;
  }
};

export const updateLotService = async (lotId, designation) => {
  try {
    console.log(" JSON envoyé au backend:", { designation });

    const response = await fetch(updateLotApi(lotId), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designation }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Server response error update lot:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(" Erreur réseau UpdateLot:", error);
    throw error;
  }
};

export const deleteLotService = async (lotId) => {
  try {
    const url = `${deleteLotApi}/${lotId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error from server when deleting lot:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur réseau DeleteLot:', error);
    throw error;
  }
};

