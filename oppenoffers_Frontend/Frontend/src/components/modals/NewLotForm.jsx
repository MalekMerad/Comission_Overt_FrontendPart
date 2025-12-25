export function NewLotForm({ newLot, setNewLot, operations, editingLot }) {
    const selectedOperation =
        operations && operations.find(op => op.id === newLot.operationId);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm mb-1">Opération *</label>
                {editingLot ? (
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        value={
                            selectedOperation
                                ? `${selectedOperation.NumOperation} - ${selectedOperation.Objectif}`
                                : ''
                        }
                        disabled
                        readOnly
                    />
                ) : (
                    <select
                        value={newLot.operationId}
                        onChange={e => setNewLot({ ...newLot, operationId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Sélectionner une opération</option>
                        {operations.map((op, index) => (
                            <option key={index} value={op.id}>
                                {op.NumOperation} - {op.Objectif}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div>
                <label className="block text-sm mb-1">Numéro *</label>
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
                <label className="block text-sm mb-1">Désignation *</label>
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