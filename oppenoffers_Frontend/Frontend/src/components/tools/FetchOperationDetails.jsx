import {getOperationByIdService} from '../../services/operationService';

export const fetchOperationDetails = async (opId) => {
  try {
    const res = await getOperationByIdService(opId);
    
    if (res.success) {
      return {
        operation: {
          ...res,
          id: opId
        },
        lots: res.lots || [],
        announces: res.announces || [],
        cahierDeCharges: res.retraitCahierChargesSupplierIDs || [],
        success: true
      };
    } else {
      return {
        success: false,
        message: res.message || "Erreur lors du chargement."
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
};
