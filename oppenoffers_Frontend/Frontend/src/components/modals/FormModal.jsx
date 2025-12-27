import { X } from "lucide-react";

export function FormModal({ isOpen, onClose, onSave, title, children, saveText = "Ajouter", cancelText = "Annuler" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded border-2 border-gray-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              {cancelText}
            </button>
            {saveText.length != 0 && (
              <button onClick={onSave} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">
              {saveText}
            </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
