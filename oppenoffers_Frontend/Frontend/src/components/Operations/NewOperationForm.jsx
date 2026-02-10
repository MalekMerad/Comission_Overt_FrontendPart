import React from "react";

export function NewOperationForm({ newOperationData, setNewOperationData, isEditing }) {
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

    const handleTextChange = (field, value) => {
        setNewOperationData({ ...newOperationData, [field] : value });
    };

    return (
        <form
            id="new-operation-form"
            onSubmit={e => e.preventDefault()}
            className="space-y-5"
        >
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <div className="flex items-center space-x-2">
                        <label className="text-xs font-medium mb-0.5 whitespace-nowrap w-[30%] min-w-[120px]">
                            Numéro d'opération <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={newOperationData.NumOperation || ''}
                            onChange={e => handleTextChange("NumOperation", e.target.value)}
                            className={`flex-1 block text-xs px-2 py-1.5 border rounded border-gray-300 ${isEditing ? 'cursor-default' : ''}`}
                            placeholder="Ex : 2024-00054"
                            readOnly={!!isEditing}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <label className="text-xs font-medium mb-0.5 whitespace-nowrap w-[30%] min-w-[120px]">
                    Service de passation des<br/>marchés <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={newOperationData.ServContract || ''}
                    onChange={e => handleTextChange("ServContract", e.target.value)}
                    className="flex-1 block text-xs px-2 py-1.5 border rounded border-gray-300"
                    placeholder="Ex : Direction des Achats"
                />
            </div>

            <div>
                <label className="block text-xs font-medium mb-0.5">
                    Objectif de l'opération <span className="text-red-500">*</span>
                </label>
                <textarea
                    required
                    value={newOperationData.Objectif || ''}
                    onChange={e => handleTextChange("Objectif", e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border rounded resize-none border-gray-300"
                    placeholder="Ex : Amélioration de l'infrastructure..."
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                
                <div>
                    <label className="block text-xs font-medium mb-0.5">Type de travail <span className="text-red-500">*</span></label>
                    <select
                        required
                        value={newOperationData.TravalieType || 'Travaux'}
                        onChange={e => setNewOperationData({ ...newOperationData, TravalieType: e.target.value })}
                        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded"
                    >
                        <option value="Travaux">Travaux</option>
                        <option value="Prestations">Prestations</option>
                        <option value="Equipement">Equipement</option>
                        <option value="Etude">Etude</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium mb-0.5">Type de budget <span className="text-red-500">*</span></label>
                    <select
                        required
                        value={newOperationData.BudgetType || 'Equipement'}
                        onChange={e => setNewOperationData({ ...newOperationData, BudgetType: e.target.value })}
                        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded"
                    >
                        <option value="Equipement">Equipement</option>
                        <option value="Fonctionnement">Fonctionnement</option>
                        <option value="Opérations Hors Budget">Opérations Hors Budget</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium mb-0.5">Méthode d'attribution <span className="text-red-500">*</span></label>
                    <select
                        required
                        value={newOperationData.MethodAttribuation || "Appel d'Offres Ouvert"}
                        onChange={e => setNewOperationData({ ...newOperationData, MethodAttribuation: e.target.value })}
                        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded"
                    >
                        <option value="Appel d'Offres Ouvert">Appel d'Offres Ouvert</option>
                        <option value="Appel d'Offres Restreint">Appel d'Offres Restreint</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center space-x-2">
                        <label className="text-xs font-medium whitespace-nowrap mb-0">
                            Numéro de visa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={newOperationData.VisaNum || ''}
                            onChange={e => setNewOperationData({ ...newOperationData, VisaNum: e.target.value })}
                            className="text-xs px-2 py-1.5 border border-gray-300 rounded flex-1 min-w-0"
                            placeholder="Ex : Visa-2025-220..."
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <label className="text-xs font-medium whitespace-nowrap mb-0">
                            Date de visa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={newOperationData.DateVisa || ''}
                            onChange={e => setNewOperationData({ ...newOperationData, DateVisa: e.target.value })}
                            className="text-xs px-2 py-1.5 border border-gray-300 rounded flex-1 min-w-0"
                        />
                    </div>
                </div>
            </div>
            
        </form>
    );
}