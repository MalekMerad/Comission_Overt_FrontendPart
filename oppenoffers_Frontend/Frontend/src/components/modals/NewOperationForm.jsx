import React from "react";

export function NewOperationForm({ newOperationData, setNewOperationData }) {
    // Set default values when component mounts
    React.useEffect(() => {
        const defaults = {
            TravalieType: 'Travaux',
            BudgetType: 'Equipement',
            MethodAttribuation: "Appel d'Offres Ouvert"
        };
        
        const updatedData = { ...newOperationData };
        let needsUpdate = false;
        
        // Match state keys exactly
        if (!newOperationData.TravalieType) {
            updatedData.TravalieType = defaults.TravalieType;
            needsUpdate = true;
        }
        if (!newOperationData.BudgetType) {
            updatedData.BudgetType = defaults.BudgetType;
            needsUpdate = true;
        }
        if (!newOperationData.MethodAttribuation) {
            updatedData.MethodAttribuation = defaults.MethodAttribuation;
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            setNewOperationData(updatedData);
        }
    }, []);

    return (
        <form
            id="new-operation-form"
            onSubmit={e => e.preventDefault()}
            className="space-y-5"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Numéro d'opération <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={newOperationData.NumOperation || ''}
                        onChange={e => setNewOperationData({ ...newOperationData, NumOperation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex : 2024-00054"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Service de passation des marchés <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={newOperationData.ServContract || ''}
                        onChange={e => setNewOperationData({ ...newOperationData, ServContract: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex : Direction des Achats"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Objectif de l'opération <span className="text-red-500">*</span>
                </label>
                <textarea
                    required
                    value={newOperationData.Objectif || ''}
                    onChange={e => setNewOperationData({ ...newOperationData, Objectif: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded min-h-[38px] resize-none"
                    placeholder="Ex : Amélioration de l'infrastructure..."
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Numéro de visa <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={newOperationData.VisaNum || ''}
                        onChange={e => setNewOperationData({ ...newOperationData, VisaNum: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Date de visa <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        required
                        value={newOperationData.DateVisa || ''}
                        onChange={e => setNewOperationData({ ...newOperationData, DateVisa: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Type de travail *</label>
                    <select
                        required
                        value={newOperationData.TravalieType || 'Travaux'}
                        onChange={e => setNewOperationData({ ...newOperationData, TravalieType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="Travaux">Travaux</option>
                        <option value="Prestations">Prestations</option>
                        <option value="Equipement">Equipement</option>
                        <option value="Etude">Etude</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Type de budget *</label>
                    <select
                        required
                        value={newOperationData.BudgetType || 'Equipement'}
                        onChange={e => setNewOperationData({ ...newOperationData, BudgetType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="Equipement">Equipement</option>
                        <option value="Fonctionnement">Fonctionnement</option>
                        <option value="Opérations Hors Budget">Opérations Hors Budget</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Méthode d'attribution *</label>
                    <select
                        required
                        value={newOperationData.MethodAttribuation || "Appel d'Offres Ouvert"}
                        onChange={e => setNewOperationData({ ...newOperationData, MethodAttribuation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="Appel d'Offres Ouvert">Appel d'Offres Ouvert</option>
                        <option value="Appel d'Offres Restreint">Appel d'Offres Restreint</option>
                    </select>
                </div>
            </div>
        </form>
    );
}