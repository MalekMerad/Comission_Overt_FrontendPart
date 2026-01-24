import { useState, useEffect } from 'react';
import { Plus, Search, Download, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { CommissionMembersTable } from '../components/tables/CommissionMembersTable';
import { NewCommissionMemberForm } from '../components/modals/NewCommissionMemberForm';
import { FormModal } from './modals/FormModal';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import {
  newCommissionMember,
  getAllCommissionMembers,
  deleteCommissionMember,
  updateCommissionMember,
} from '../services/commissionMemberService';

import { getOperations } from '../services/operationService';
import { getAllAnnonces } from '../services/annonceService';
import { format } from 'date-fns';

export function CommissionSection() {
  const [operations, setOperations] = useState([]);
  const [members, setMembers] = useState([]);
  const [announces, setAnnounces] = useState([]);
  const [selectedOperationId, setSelectedOperationId] = useState('');
  const [operationSearch, setOperationSearch] = useState('');

  const { showToast } = useToast();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [editMember, setEditMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    role: 'Membre',
    email: '',
    telephone: '',
    operationId: '',
  });

  const [showOperationDropdown, setShowOperationDropdown] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
  
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        const [membersData, opsResponse, announcesData] = await Promise.all([
          getAllCommissionMembers(user.userId),
          getOperations(user.userId),
          getAllAnnonces(user.userId),
        ]);
  
        if (!isMounted) return;
  
        const rawMembers = Array.isArray(membersData) ? membersData : (membersData?.members || []);
        
        console.log("Raw Members received:", rawMembers);
  
        const normalizedMembers = rawMembers.map(member => ({
          id: member.Id,
          nom: member.Nom?.trim() || '',
          prenom: member.Prenom?.trim() || '',
          fonction: member.Fonction || '',
          role: member.Role || '',
          email: member.Email || '',
          operationId: member.operationId,
        }));
  
        console.log("Normalized Members for State:", normalizedMembers);
        setMembers(normalizedMembers);
  
        // 2. Handle Operations Logic
        const rawOps = Array.isArray(opsResponse) ? opsResponse : (opsResponse?.data || []);
        setOperations(rawOps.filter(op => op.State === 1));
  
        // 3. Handle Announces Logic
        setAnnounces(announcesData || []);
  
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch Error:", err);
        // Ensure your toast utility is available in scope
        if (typeof showToast === 'function') {
          showToast('Erreur de chargement des données', { type: 'error' });
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [user?.userId]);



  // Find selected operation object
  const selectedOperation = operations.find(op => 
    String(op.Id || op.id) === String(selectedOperationId)
  );

  // Filter members by operationId
  const filteredMembersByOperation = selectedOperationId
    ? members.filter((member) => 
        String(member.operationId) === String(selectedOperationId)
      )
    : [];

  const correspondingAnnounce = announces.find(an => 
    String(an.Id_Operation || an.operationId) === String(selectedOperationId)
  );

  const searchFilteredMembers = filteredMembersByOperation.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      `${member.prenom} ${member.nom}`.toLowerCase().includes(term) ||
      (member.fonction || '').toLowerCase().includes(term)
    );
  });

  const filteredOperations = operations.filter(op =>
    (op.Numero || '').toLowerCase().includes(operationSearch.toLowerCase()) ||
    (op.Service_Contractant || '').toLowerCase().includes(operationSearch.toLowerCase())
  );

  const handleOpenModal = (member) => {
    setShowModal(true);
    if (member) {
      setEditMember(member);
      setNewMember({
        nom: member.nom || '',
        prenom: member.prenom || '',
        fonction: member.fonction || '',
        role: member.role || 'Membre',
        email: member.email || '',
        telephone: member.telephone || '',
        operationId: selectedOperationId, 
      });
    } else {
      setEditMember(null);
      setNewMember({
        nom: '',
        prenom: '',
        fonction: '',
        role: 'Membre',
        email: '',
        telephone: '',
        operationId: selectedOperationId,
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMember(null);
  };

  const handleSaveMemeber = async () => {
    const currentAdminId = user?.userId;
    const operationIdToSave = selectedOperationId;
  
    if (!newMember.nom || !newMember.prenom || !operationIdToSave || !newMember.email) {
      showToast("Nom, Prenom, Email et l'opération sont requis", { type: 'error' });
      return;
    }
  
    const formData = {
      Nom: newMember.nom.trim(),
      Prenom: newMember.prenom.trim(),
      Fonction: newMember.fonction,
      Email: newMember.email,
      Role: newMember.role,
      operationId: operationIdToSave,
      adminId: currentAdminId,
    };
  
    try {
      if (editMember) {
        const result = await updateCommissionMember(editMember.id, formData);
        if (result.success) {
          showToast('Membre modifié avec succès', { type: 'success' });
          setMembers(members.map((m) =>
            m.id === editMember.id ? { 
              ...m, 
              ...newMember, 
              operationId: operationIdToSave 
            } : m
          ));
        } else {
          showToast(result.message, { type: 'error' });
        }
      } else {
        const result = await newCommissionMember(formData);
        if (result.success) {
          showToast('Membre ajouté avec succès', { type: 'success' });
          const newMemberWithDetails = {
            ...newMember,
            id: result.id,
            operationId: operationIdToSave,
          };
          setMembers([...members, newMemberWithDetails]);
        } else {
          showToast(result.message, { type: 'error' });
        }
      }
      handleModalClose();
    } catch (err) {
      showToast(err.message, { type: 'error' });
    }
  };
  
  const handleDeleteMember = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        const result = await deleteCommissionMember(id);
        if (result.success) {
          showToast('Membre supprimé avec succès', { type: 'success' });
          setMembers(members.filter((m) => m.id !== id));
        } else {
          showToast(result.message, { type: 'error' });
        }
      } catch (err) {
        showToast(err.message, { type: 'error' });
      }
    }
  };

  const handleDownloadPDF = () => {
    // 1. Validation: Ensure an operation is selected
    if (!selectedOperation) {
      showToast("Veuillez sélectionner une opération avant de télécharger", { type: 'error' });
      return;
    }

    // 2. Initialize jsPDF
    const doc = new jsPDF();

    // 3. Add Header Information
    doc.setFontSize(18);
    doc.text(`Commission de l'Opération: ${selectedOperation.Numero}`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Service: ${selectedOperation.Service_Contractant}`, 14, 30);
    
    // 4. Add Date and Time from the corresponding announcement if it exists
    if (correspondingAnnounce && correspondingAnnounce.Date_Overture) {
      try {
        const formattedDate = format(new Date(correspondingAnnounce.Date_Overture), 'dd/MM/yyyy');
        doc.text(
          `Date d'ouverture: ${formattedDate} à ${correspondingAnnounce.Heure_Ouverture || 'N/A'}`, 
          14, 
          36
        );
      } catch (e) { 
        console.error("Date formatting error:", e); 
      }
    }

    // 5. Prepare Table Data
    const tableColumn = ['Nom complet', 'Fonction', 'Rôle', 'Email'];
    const tableRows = searchFilteredMembers.map(member => [
      `${member.prenom} ${member.nom}`,
      member.fonction || 'N/A',
      member.role || 'Membre',
      member.email || 'N/A'
    ]);

    // 6. Generate the Table using the autoTable function
    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [51, 65, 85],
        fontSize: 10,
        halign: 'center' 
      },
      styles: { 
        font: 'helvetica', 
        fontSize: 9,
        cellPadding: 3 
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      margin: { top: 40 }
    });

    const fileName = `commission_${selectedOperation.Numero.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white border border-gray-300 rounded">
          {/* Header with operation selector and search (match style from SpecificationsSection) */}
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
            <div className="flex flex-row items-center justify-between gap-4 mb-1 w-full">
              {/* Operation Selector (left side, fixed width or max-w, styled identically to SpecificationsSection) */}
              <div className="relative min-w-[260px] max-w-[340px] w-full mr-4">
                <button
                  id="operation-select-commission"
                  type="button"
                  className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center text-left"
                  onClick={() => setShowOperationDropdown((open) => !open)}
                >
                  <span className="truncate text-sm cursor-pointer">
                    {selectedOperation
                      ? `${selectedOperation.Numero} - ${selectedOperation.Service_Contractant}`
                      : "Sélectionner une opération"}
                  </span>
                  <svg 
                    className={`w-5 h-5 ml-3 transition-transform ${showOperationDropdown ? "rotate-180" : "rotate-0"}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Operation Dropdown Menu */}
                {showOperationDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-auto max-h-72">
                    <div className="px-3 py-2 border-b flex items-center gap-2 sticky top-0 bg-white z-10">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher une opération..."
                        className="outline-none w-full bg-transparent text-sm py-1"
                        autoFocus
                        value={operationSearch}
                        onChange={e => setOperationSearch(e.target.value)}
                      />
                    </div>
                    <ul className="max-h-56 overflow-y-auto">
                      <li 
                        className="cursor-pointer px-4 py-2 text-gray-600 text-sm hover:bg-slate-100" 
                        onClick={() => { 
                          setSelectedOperationId(""); 
                          setShowOperationDropdown(false);
                          setOperationSearch('');
                        }}
                      >
                        Sélectionner une opération
                      </li>
                      {filteredOperations.map(op => (
                        <li
                          key={op.Id || op.id}
                          className={`cursor-pointer px-4 py-2 text-gray-900 text-sm hover:bg-indigo-50 ${
                            String(selectedOperationId) === String(op.Id || op.id) 
                              ? "bg-indigo-100 font-bold" 
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedOperationId(op.Id || op.id);
                            setShowOperationDropdown(false);
                            setOperationSearch('');
                          }}
                        >
                          {op.Numero} - {op.Service_Contractant}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Search Input (right side, flexible width, same as SpecificationsSection) */}
              <div className="relative min-w-[160px] w-full max-w-xs ml-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par membre, fonction ou rôle"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>

              <button
                onClick={() => handleOpenModal(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400 ml-4"
                disabled={!selectedOperationId}
              >
                <Plus className="w-4 h-4" />
                Ajouter Membre
              </button>
            </div>
          </div>
          
          {selectedOperationId && (
            <div className="border-b border-gray-300 px-6 py-3 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-800">
                  Opération: {selectedOperation?.Numero}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    {searchFilteredMembers.length} {searchFilteredMembers.length > 1 ? 'membres trouvés' : 'membre trouvé'}
                  </p>
                  {correspondingAnnounce && correspondingAnnounce.Date_Overture && (
                    <p className="text-sm text-gray-600">
                      | Ouverture prévue: {format(new Date(correspondingAnnounce.Date_Overture), 'dd/MM/yyyy')} à {correspondingAnnounce.Heure_Ouverture}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleDownloadPDF} className="text-gray-600 hover:text-blue-600"><Download className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6">
            {selectedOperationId ? (
              searchFilteredMembers.length > 0 ? (
                <CommissionMembersTable
                  members={searchFilteredMembers}
                  handleOpenModal={handleOpenModal}
                  handleDeleteMember={handleDeleteMember}
                  selectedOperationId={selectedOperationId}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Aucun membre pour cette opération</p>
                </div>
              )
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {operations.length > 0 
                    ? "Sélectionnez une opération pour voir les membres" 
                    : "Aucune opération disponible"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <FormModal isOpen={showModal} onClose={handleModalClose} onSave={handleSaveMemeber} title={editMember ? 'Modifier Membre' : 'Ajouter Membre'} saveText={editMember ? 'Modifier' : 'Ajouter'}>
        <NewCommissionMemberForm newMember={newMember} setNewMember={setNewMember} operations={operations} selectedOperationId={selectedOperationId} />
      </FormModal>
    </div>
  );
}