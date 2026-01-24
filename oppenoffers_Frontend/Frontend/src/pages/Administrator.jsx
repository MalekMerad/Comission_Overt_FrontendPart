import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OperationsSection } from '../components/OperationsSection';
import { SpecificationsSection } from '../components/SpecificationsSection';
import {SuppliersSection} from '../components/SuppliersSection';
import { CommissionSection } from '../components/CommissionSection';
import { EvaluationSection } from '../components/EvaluationSection';

export function Administrator(){
    const [activeSection, setActiveSection] = useState('operations');

    const renderSection = () => {
        switch (activeSection) {
          case 'operations':
            return <OperationsSection />;
          case 'cahierDeCharge':
            return <SpecificationsSection />;
          case 'commission':
            return <CommissionSection />;
          case 'evaluation':
            return <EvaluationSection />;
          case 'supplier':
            return <SuppliersSection />;
          default:
            return <OperationsSection />;
        }
      };

    return(
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
         <main className="flex-1 overflow-y-auto">
            {renderSection()}
          </main>
       </div>
    );
}
