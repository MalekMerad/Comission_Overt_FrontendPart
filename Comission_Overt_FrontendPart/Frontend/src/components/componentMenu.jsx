// Logo import Components 
import NewOperation from './OperationsFolder/NewOperation';
import DisplayOperation from './OperationsFolder/DisplayOperations';
import DisplayAnnonces from './AnnoncesFolder/DisplayAnnonces';
import DisplayLots from './LotsFolder/DisplayLots';

const componentMap  = {
    "Créer une nouvelle opération" : NewOperation,
    "Voir la liste des opérations" : DisplayOperation,
    "Voir les annonces publiées" : DisplayAnnonces,
    "Voir la liste des lots" : DisplayLots
}

export default componentMap;
