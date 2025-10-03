<script>
  import '../../styles/competences.css';
  
  let showReference = false;
  
  function toggleReference() {
    showReference = !showReference;
  }
</script>

<div class="competence-section">
 
  <div class="competence-badge commune">Commune de Putanges-le-Lac</div>
  
  <h3>📚 Compétences de base en matière d'enseignement</h3>
  
  <div class="competence-card">
    <h4>🏫 Création et gestion des écoles</h4>
    <p>Le conseil municipal décide de la création et de l'implantation des écoles et classes élémentaires et maternelles d'enseignement public après avis du représentant de l'État dans le département.</p>
  </div>
  
  <div class="competence-card">
    <h4>🔨 Bâtiments et équipements</h4>
    <p>Construction, reconstruction, extension, grosses réparations, équipement et fonctionnement des écoles publiques.</p>
  </div>
  
  <div class="competence-card">
    <h4>👥 Personnel</h4>
    <p>Recrutement et gestion des ATSEM (assistants territoriaux spécialisés des écoles maternelles) pour les communes pourvues d'une ou plusieurs écoles maternelles.</p>
  </div>
  
  <div class="competence-card">
    <h4>🍽️ Restauration scolaire</h4>
    <p>Organisation et financement des repas dans les écoles maternelles et élémentaires (compétence facultative).</p>
  </div>
  
  <div class="competence-card">
    <h4>🎨 Activités périscolaires</h4>
    <p>Organisation d'activités périscolaires (culturelles, sportives, artistiques) et de la garderie périscolaire (compétence facultative).</p>
  </div>
  
  <div class="competence-card">
    <h4>🚨 Service d'accueil en cas de grève</h4>
    <p>Mise en place d'un service d'accueil lorsque le nombre des personnes qui ont déclaré leur intention de participer à la grève est égal ou supérieur à 25%.</p>
  </div>
  
  <div class="competence-card">
    <h4>📋 Contrôle de l'obligation scolaire</h4>
    <p>Chaque année, à la rentrée scolaire, le maire dresse la liste de tous les enfants résidant dans sa commune et qui sont soumis à l'obligation scolaire.</p>
  </div>
  
  <div class="competence-card">
    <h4>💰 Caisse des écoles</h4>
    <p>Une délibération du conseil municipal crée une caisse des écoles, destinée à faciliter la fréquentation de l'école par des aides aux élèves en fonction des ressources de leur famille.</p>
  </div>
  
  <div class="competence-card">
    <h4>🏛️ Avis sur les écoles privées</h4>
    <p>Donne son avis sur l'ouverture ou la modification d'établissements scolaires privés hors contrat.</p>
  </div>

  <div class="competence-badge cdc">Communauté de Communes du Val d'Orne</div>
  
  <h3 class="cdc">🤝 Compétences intercommunales en matière d'enseignement</h3>
  
  <div class="competence-card cdc">
    <h4>🏫 Prise en charge des dépenses</h4>
    <p>Investissement et fonctionnement des écoles publiques (bâtiments, équipements, cantines, garderies).</p>
    <p>Cela signifie que la CdC peut financer ou gérer directement ces services pour toutes les communes membres, y compris Putanges-le-Lac, si elles le décident.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🤝 Mutualisation</h4>
    <p>La CdC peut centraliser la gestion des cantines, des garderies ou des transports scolaires pour plusieurs communes, afin d'optimiser les coûts et améliorer l'offre.</p>
    <p>Elle peut aussi construire ou rénover des écoles utilisées par plusieurs communes (une école intercommunale).</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🎓 Enseignement supérieur</h4>
    <p>Les collectivités territoriales et leurs groupements peuvent contribuer au financement des sites et établissements d'enseignement supérieur et établissements de recherche implantés sur leur territoire.</p>
  </div>

  <div class="limitations-box">
    <h4>⚠️ Ce que la CdC ne gère pas</h4>
    <ul>
      <li>Les programmes scolaires, le recrutement des enseignants, ou les lycées/collèges (compétence départementale/régionale)</li>
      <li>Les écoles privées (sauf avis consultatif)</li>
      <li>La gestion directe des ATSEM (reste communale)</li>
    </ul>
  </div>

  <!-- Accordion pour le texte de référence -->
  <div class="reference-accordion">
    <button class="reference-header" type="button" on:click={toggleReference}>
      <span>Texte de référence</span>
      <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    <div class="reference-content" style="display: {showReference ? 'block' : 'none'};">
      <h4>Compétences communales :</h4>
      <ul>
        <li>Le conseil municipal décide de la création et de l'implantation des écoles et classes élémentaires et maternelles d'enseignement public après avis du représentant de l'Etat dans le département (article L. 2121-30 du CGCT)</li>
        <li>Construction, reconstruction, extension, grosses réparations, équipement et fonctionnement des écoles publiques (article L. 212-4 du code de l'éducation)</li>
        <li>Compétence des communes pourvues d'une ou plusieurs écoles maternelles relative au recrutement et à la gestion des ATSEM (assistants territoriaux spécialisés des écoles maternelles)</li>
        <li>Financement des dépenses de fonctionnement liées à la scolarisation d'enfants dans des écoles privées ou publiques d'autres communes</li>
        <li>Avis sur l'ouverture / la modification d'établissements scolaires privés hors contrat</li>
        <li>Restauration scolaire des écoles maternelles et élémentaires (compétence facultative)</li>
        <li>Organisation d'activités périscolaires (activités culturelles, sportives, artistiques complémentaires aux enseignements scolaires) et de la garderie périscolaire (compétence facultative)</li>
        <li>Mise en place d'un service d'accueil à destination des élèves d'une école maternelle ou élémentaire publique lorsque le nombre des personnes qui ont déclaré leur intention de participer à la grève en application du premier alinéa est égal ou supérieur à 25% (article L.133-4 du code de l'éducation)</li>
        <li>Veille au respect de l'obligation scolaire : chaque année, à la rentrée scolaire, le maire dresse la liste de tous les enfants résidant dans sa commune et qui sont soumis à l'obligation scolaire (article L.131-6 du code de l'éducation)</li>
        <li>Une délibération du conseil municipal crée, dans chaque commune, une caisse des écoles, destinée à faciliter la fréquentation de l'école par des aides aux élèves en fonction des ressources de leur famille (article L. 212-10 du code de l'éducation)</li>
        <li>Les collectivités territoriales et leurs groupements peuvent contribuer au financement des sites et établissements d'enseignement supérieur et établissements de recherche implantés sur leur territoire ainsi qu'aux œuvres universitaires et scolaires (article L.216-11 du code de l'éducation)</li>
      </ul>
      
      <h4>Accueil du jeune enfant :</h4>
      <p>Les communes sont les autorités organisatrices de l'accueil du jeune enfant à partir du 1er janvier 2025 (article L. 214-1-3 du CASF).</p>
      <p>A ce titre, toutes les communes exercent obligatoirement les compétences suivantes :</p>
      <ul>
        <li>Recenser les besoins des enfants âgés de moins de trois ans et de leurs familles en matière de services aux familles</li>
        <li>Informer et accompagner les familles ayant un ou plusieurs enfants âgés de moins de trois ans ainsi que les futurs parents</li>
      </ul>
      
      <p>Les communes de plus de 3 500 habitants doivent également exercer les compétences suivantes :</p>
      <ul>
        <li>Planifier, au vu du recensement des besoins, le développement des modes d'accueil</li>
        <li>Soutenir la qualité des modes d'accueil</li>
      </ul>
      
      <p>Concernant les communes de plus de 10 000 habitants :</p>
      <ul>
        <li>elles doivent établir et mettre en œuvre le schéma pluriannuel de maintien et de développement de l'offre d'accueil du jeune enfant (l'article L. 214-2 du CASF) pour l'exercice de la compétence 3°</li>
        <li>elles doivent mettre en place le relais petite enfance (article L. 214-2-1 du CASF) à partir du 1er janvier 2026, pour l'exercice des compétences 2° et 4°</li>
      </ul>
      
      <h4>Compétences optionnelles :</h4>
      <ul>
        <li>Possibilité de soutenir, financer ou gérer des structures d'accueil de la petite enfance (crèches, haltes garderies, jardins d'éveil, etc.)</li>
        <li>Possibilité de créer un relais d'assistants maternels</li>
      </ul>
    </div>
  </div>
</div>
