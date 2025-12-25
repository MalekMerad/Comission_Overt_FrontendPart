import React from 'react';

// Use the *exact* key used in OperationsTable/operationsService for attribution
const labelMap = {
  NumOperation: "Numéro d'opération",
  ServContract: "Service de passation des marchés",
  Objectif: "Objectif de l'opération",
  VisaNum: "Numéro de visa",
  DateVisa: "Date de visa",
  TravalieType: "Type de travail",
  BudgetType: "Type de budget",
  MethodAttribuation: "Méthode d'attribution"
};

const fields = [
  {
    key: "NumOperation",
    label: "Numéro d'opération"
  },
  {
    key: "ServContract",
    label: "Service de passation des marchés"
  },
  {
    key: "Objectif",
    label: "Objectif de l'opération"
  },
  {
    key: "VisaNum",
    label: "Numéro de visa"
  },
  {
    key: "DateVisa",
    label: "Date de visa"
  },
  {
    key: "TravalieType",
    label: "Type de travail"
  },
  {
    key: "BudgetType",
    label: "Type de budget"
  },
  {
    key: "MethodAttribuation",
    label: "Méthode d'attribution"
  }
];

const formatValue = (key, value) => {
  if (key === "DateVisa" && value) {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  }
  return value !== undefined && value !== null ? value : <span className="text-gray-400 italic">Non renseigné</span>;
};

const OperationDetails = ({ operation }) => {
  return (
    <div className="space-y-6 py-3">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.NumOperation} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("NumOperation", operation.NumOperation)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.ServContract} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("ServContract", operation.ServiceDeContract)}
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {labelMap.Objectif} :
        </label>
        <div className="rounded border px-3 py-2 bg-gray-50 min-h-[38px]">
          {formatValue("Objectif", operation.Objectif)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.VisaNum} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("VisaNum", operation.VisaNumber)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.DateVisa} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("DateVisa", operation.VisaDate)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.TravalieType} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("TravalieType", operation.TypeTravail)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.BudgetType} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("BudgetType", operation.TypeBudget)}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {labelMap.MethodAttribuation} :
          </label>
          <div className="rounded border px-3 py-2 bg-gray-50">
            {formatValue("MethodAttribuation", operation.ModeAttribution)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationDetails;
