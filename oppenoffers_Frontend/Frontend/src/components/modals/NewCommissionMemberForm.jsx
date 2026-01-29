import React, { useMemo, useState, useEffect } from "react";

export function NewCommissionMemberForm({ newMember, setNewMember, members }) {
  const [showNomSuggestions, setShowNomSuggestions] = useState(false);
  const [showPrenomSuggestions, setShowPrenomSuggestions] = useState(false);

  // Normalize members (VERY IMPORTANT)
  const normalizedMembers = useMemo(() => {
    return members
      ?.filter(Boolean)
      .map(m => ({
        nom: (m.nom || "").trim(),
        prenom: (m.prenom || "").trim(),
        email: m.email || "",
        fonction: m.fonction || ""
      }));
  }, [members]);

  // ---- NOM suggestions ----
  const filteredNoms = useMemo(() => {
    if (!newMember.nom) return [];

    return [
      ...new Set(
        normalizedMembers
          .filter(m =>
            m.nom.toLowerCase().startsWith(newMember.nom.toLowerCase())
          )
          .map(m => m.nom)
      )
    ];
  }, [newMember.nom, normalizedMembers]);

  // ---- PRENOM suggestions ----
  const filteredPrenoms = useMemo(() => {
    if (!newMember.prenom) return [];

    return [
      ...new Set(
        normalizedMembers
          .filter(m =>
            m.prenom.toLowerCase().startsWith(newMember.prenom.toLowerCase())
          )
          .map(m => m.prenom)
      )
    ];
  }, [newMember.prenom, normalizedMembers]);

  // ---- AUTO-FILL email & fonction ----
  useEffect(() => {
    if (!newMember.nom || !newMember.prenom) return;

    const match = normalizedMembers.find(
      m =>
        m.nom.toLowerCase() === newMember.nom.toLowerCase() &&
        m.prenom.toLowerCase() === newMember.prenom.toLowerCase()
    );

    if (match) {
      setNewMember(prev => ({
        ...prev,
        email: match.email,
        fonction: match.fonction
      }));
    }
  }, [newMember.nom, newMember.prenom, normalizedMembers, setNewMember]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* NOM */}
        <div className="relative">
          <label className="block text-sm mb-1">Nom *</label>
          <input
            type="text"
            placeholder="Ex: Benhachem"
            value={newMember.nom}
            onFocus={() => setShowNomSuggestions(true)}
            onChange={e => {
              setNewMember({ ...newMember, nom: e.target.value });
              setShowNomSuggestions(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />

          {showNomSuggestions && filteredNoms.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1">
              {filteredNoms.map((nom, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setNewMember({ ...newMember, nom });
                    setShowNomSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {nom}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PRENOM */}
        <div className="relative">
          <label className="block text-sm mb-1">Prénom *</label>
          <input
            type="text"
            placeholder="Ex: Sami"
            value={newMember.prenom}
            onFocus={() => setShowPrenomSuggestions(true)}
            onChange={e => {
              setNewMember({ ...newMember, prenom: e.target.value });
              setShowPrenomSuggestions(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />

          {showPrenomSuggestions && filteredPrenoms.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1">
              {filteredPrenoms.map((prenom, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setNewMember({ ...newMember, prenom });
                    setShowPrenomSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {prenom}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Fonction + Role */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Fonction</label>
          <input
            type="text"
            placeholder="Ex: Ingénieur, Directeur…"
            value={newMember.fonction}
            onChange={e =>
              setNewMember({ ...newMember, fonction: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Rôle</label>
          <select
            value={newMember.role}
            onChange={e =>
              setNewMember({ ...newMember, role: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="Président">Président</option>
            <option value="Secrétaire">Secrétaire</option>
            <option value="Membre">Membre</option>
          </select>
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="Ex: member@gmail.com"
          value={newMember.email}
          onChange={e =>
            setNewMember({ ...newMember, email: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}
