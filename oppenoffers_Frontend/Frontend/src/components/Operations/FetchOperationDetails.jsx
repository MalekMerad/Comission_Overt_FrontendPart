import { getOperationByIdService } from '../../services/Operations/operationService';

export const fetchOperationDetails = async (opId) => {
  if (!opId) {
    return {
      success: false,
      message: 'Operation id is required'
    };
  }
  try {
    const res = await getOperationByIdService(opId);
    if (res.success) {
      return {
        success: true,
        operation: res.operation,
        lots: res.lots || [],
        announces: res.announces || [],
        suppliers: res.suppliers || [],
        message: res.message
      };
    } else {
      return {
        success: false,
        message: res.message || 'Database error occurred in getOperationByIdSqlServer.',
        error: res.error
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Internal server error',
      error: error.message
    };
  }
};