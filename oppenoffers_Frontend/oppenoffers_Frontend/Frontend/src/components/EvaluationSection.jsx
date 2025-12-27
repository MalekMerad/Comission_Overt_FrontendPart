import { useState } from 'react';
import { FileText, Download } from 'lucide-react';

export function EvaluationSection() {
  const [evaluations] = useState([
    {
      id: '1',
      operation: 'AO-2024-001',
      fournisseur: 'SARL TechSolutions',
      lot: 'LOT-01',
      noteAdministrative: '20/20',
      noteTechnique: '35/40',
      noteFinanciere: '32/40',
      noteFinale: '87/100',
      statut: 'Conforme',
    },
    {
      id: '2',
      operation: 'AO-2024-001',
      fournisseur: 'EURL InfoServices',
      lot: 'LOT-01',
      noteAdministrative: '18/20',
      noteTechnique: '30/40',
      noteFinanciere: '38/40',
      noteFinale: '86/100',
      statut: 'Conforme',
    },
  ]);

  const [selectedOperation, setSelectedOperation] = useState('AO-2024-001');

  const generatePV = (type) => {
    alert(`Génération du ${type} pour l'opération ${selectedOperation}`);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Evaluation Section */}
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
            <h2 className="text-lg">Évaluation des offres</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm mb-1">Opération</label>
              <select
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option>AO-2024-001</option>
                <option>AO-2024-002</option>
              </select>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Fournisseur</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Lot</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Note Admin.</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Note Tech.</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Note Fin.</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Note Finale</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{evaluation.fournisseur}</td>
                    <td className="border border-gray-300 px-4 py-2">{evaluation.lot}</td>
                    <td className="border border-gray-300 px-4 py-2">{evaluation.noteAdministrative}</td>
                    <td className="border border-gray-300 px-4 py-2">{evaluation.noteTechnique}</td>
                    <td className="border border-gray-300 px-4 py-2">{evaluation.noteFinanciere}</td>
                    <td className="border border-gray-300 px-4 py-2">{evaluation.noteFinale}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        evaluation.statut === 'Conforme' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {evaluation.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reports Section */}
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
            <h2 className="text-lg">Rapports et procès-verbaux</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => generatePV('PV d\'ouverture des plis')}
                className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="text-left">
                  <div>PV d'ouverture des plis</div>
                  <div className="text-xs text-gray-500">Générer le procès-verbal</div>
                </div>
              </button>

              <button
                onClick={() => generatePV('PV d\'évaluation technique')}
                className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="text-left">
                  <div>PV d'évaluation technique</div>
                  <div className="text-xs text-gray-500">Générer le procès-verbal</div>
                </div>
              </button>

              <button
                onClick={() => generatePV('PV d\'évaluation financière')}
                className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="text-left">
                  <div>PV d'évaluation financière</div>
                  <div className="text-xs text-gray-500">Générer le procès-verbal</div>
                </div>
              </button>

              <button
                onClick={() => generatePV('Rapport d\'attribution')}
                className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50"
              >
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="text-left">
                  <div>Rapport d'attribution</div>
                  <div className="text-xs text-gray-500">Générer le rapport final</div>
                </div>
              </button>
            </div>

            <div className="mt-6 border-t border-gray-300 pt-6">
              <h3 className="mb-3">Documents générés</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded border border-gray-300">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="text-sm">PV_Ouverture_AO-2024-001.pdf</div>
                      <div className="text-xs text-gray-500">Généré le 15/03/2024</div>
                    </div>
                  </div>
                  <button className="text-slate-600 hover:text-slate-800">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}