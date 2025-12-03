// Logo import Components 
import NewOperation from './OperationsFolder/NewOperation';
import DisplayOperation from './OperationsFolder/DisplayOperations';
import DisplayAnnonces from './AnnoncesFolder/DisplayAnnonces';
import DisplayLots from './LotsFolder/DisplayLots';
import NewSupplier from './SuppliersFolder/NewSupplier';

const componentMap  = {
    "Créer une nouvelle opération" : NewOperation,
    "Voir la liste des opérations" : DisplayOperation,
    "Voir les annonces publiées" : DisplayAnnonces,
    "Voir la liste des lots" : DisplayLots,
    "Ajouter un nouveau fournisseur": NewSupplier
}

export default componentMap;
