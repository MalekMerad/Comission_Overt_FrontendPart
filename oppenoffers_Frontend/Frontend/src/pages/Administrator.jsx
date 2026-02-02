import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { OperationsSection } from '../components/OperationsSection';
import { SpecificationsSection } from '../components/SpecificationsSection';
import { SuppliersSection } from '../components/SuppliersSection';
import { CommissionSection } from '../components/CommissionSection';
import { EvaluationSection } from '../components/EvaluationSection';

export function Administrator() {
    const location = useLocation();

    const [activeSection, setActiveSection] = useState(
        location.state?.activeSection || 'operations'
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'operations':
                return <OperationsSection />;
            case 'supplier':
                return <SuppliersSection />;
            case 'cahierDeCharge':
                return <SpecificationsSection />;
            case 'commission':
                return <CommissionSection />;
            case 'evaluation':
                return <EvaluationSection />;
            default:
                return <OperationsSection />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            
            {/* Header */}
            <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-4">
                {renderSection()}
            </main>

        </div>
    );
}
