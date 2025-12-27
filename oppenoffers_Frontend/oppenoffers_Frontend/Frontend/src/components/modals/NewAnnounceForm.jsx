import { useEffect, useRef } from "react";
import {parseDateSafe, formatDateInput,addDays} from '../../utils/dateFormat';

export function NewAnnounceForm({ newAnnouncement, setNewAnnouncement, operations, isEditing }) {
    const lastAutoUpdateRef = useRef(null);
    
    useEffect(() => {
        const { datePublication, delai } = newAnnouncement;
    
        if (datePublication && delai && /^\d+$/.test(delai)) {
            const calculated = addDays(datePublication, delai);
    
            setNewAnnouncement(n => {
                lastAutoUpdateRef.current = calculated;
                return { ...n, dateOuverture: calculated };
            });
        }
    }, [newAnnouncement.datePublication, newAnnouncement.delai]);
    

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm mb-1">Opération *</label>
                <select
                    value={newAnnouncement.operationId}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, operationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    disabled={!!isEditing}
                >
                    <option value="" disabled>Sélectionner une opération</option>
                    {operations.map((op) => (
                        <option key={op.id} value={op.id}>
                            {op.NumOperation} - {op.Objectif}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Numéro d'Annonce *</label>
                    <input
                        type="text"
                        value={newAnnouncement.numero}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, numero: e.target.value })}
                        className={`w-full px-3 py-2 border border-gray-300 rounded ${isEditing ? 'cursor-default' : ''}`}
                        placeholder="Ex: 2024/01"
                        readOnly={!!isEditing}
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Date de Publication *</label>
                    <input
                        type="date"
                        value={newAnnouncement.datePublication}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, datePublication: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm mb-1">Journal</label>
                    <input
                        type="text"
                        value={newAnnouncement.journal}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, journal: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: BOMOP"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Délai (jours)</label>
                    <input
                        type="number"
                        value={newAnnouncement.delai}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, delai: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="21"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Date d'ouverture</label>
                    <input
                        type="date"
                        value={newAnnouncement.dateOuverture}
                        onChange={e => {
                            setNewAnnouncement({ ...newAnnouncement, dateOuverture: e.target.value });
                            lastAutoUpdateRef.current = null; 
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
            </div>
        </div>
    );
}