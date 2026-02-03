export function NewLotForm({ newLot, setNewLot, editingLot }) {
    return (
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
    );
}