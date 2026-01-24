export function NewLotForm({ newLot, setNewLot, operations, editingLot }) {
    const selectedOperation =
        operations && operations.find(op => op.id === newLot.operationId);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm mb-1">Opération <span className="text-red-500">*</span></label>
                {editingLot ? (
                    <input
                        type="text"
                        className="cursor-pointer px-4 py-2 text-gray-900 text-sm hover:bg-indigo-50"
                        value={
                            selectedOperation
                                ? `${selectedOperation.NumOperation} - ${selectedOperation.ServiceDeContract}`
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
                        <option value="" className="cursor-pointer px-4 py-2 text-gray-600 text-sm hover:bg-slate-100">Sélectionner une opération</option>
                        {operations.map((op, index) => (
                            <option key={index} value={op.id} className="cursor-pointer px-4 py-2 text-gray-900 text-sm hover:bg-indigo-50">
                                {op.NumOperation} - {op.ServiceDeContract}
                            </option>
                        ))}
                    </select>
                )}
            </div>

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