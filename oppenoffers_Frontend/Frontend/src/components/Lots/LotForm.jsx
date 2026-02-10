import React from 'react';
import { FormModal } from '../Shared/FormModal';
const LotForm = ({showModal, handleModalClose, handleSaveLot, editingLot, newLot, setNewLot}) => {
  return (
    <div>

<FormModal
        key={editingLot ? `edit-${editingLot.id}` : 'add-new'}
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSaveLot}
        title={editingLot ? 'Modifier le lot' : 'Nouveau Lot'}
        saveText={editingLot ? 'Modifier' : 'Ajouter'}
      >
         <div className="space-y-4">
            {/* The Opération field is no longer shown since operationID is precise */}
            <div>
                <label className="block text-sm mb-1">Numéro <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={newLot.numero}
                    onChange={e => setNewLot({ ...newLot, numero: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    placeholder="LOT-XX"
                    readOnly={!!editingLot}
                    disabled={!!editingLot}
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Désignation <span className="text-red-500">*</span></label>
                <textarea
                    value={newLot.designation}
                    onChange={e => setNewLot({ ...newLot, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Description du lot"
                    rows={3}
                />
            </div>
        </div>
      </FormModal>
    </div>
  );
};

export default LotForm;
