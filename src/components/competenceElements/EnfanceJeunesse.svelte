<script>
  import '../../styles/competences.css';
  
  let showReference = false;
  
  function toggleReference() {
    showReference = !showReference;
  }
</script>

<div class="competence-section">
 
  <div class="competence-badge commune">Commune de Putanges-le-Lac</div>
  
  <h3>👶 Compétences obligatoires en matière d'accueil du jeune enfant</h3>
  
  <div class="competence-card">
    <h4>📊 Recenser les besoins</h4>
    <p>Identifier les besoins des familles avec des enfants de moins de 3 ans (nombre de places en crèche nécessaires, horaires d'accueil souhaités).</p>
  </div>
  
  <div class="competence-card">
    <h4>ℹ️ Informer et accompagner les familles</h4>
    <p>Orienter les parents vers les modes de garde existants (assistantes maternelles, crèches familiales, etc.) et les aides disponibles (allocations de la CAF, aides de la caisse des écoles).</p>
  </div>

  <div class="competence-badge commune">Compétences optionnelles</div>
  
  <h3>🎯 Compétences optionnelles de la commune</h3>
  
  <div class="competence-card">
    <h4>🏢 Soutenir, financer ou gérer des structures d'accueil</h4>
    <p>Créer ou subventionner une crèche, une halte-garderie, ou un jardin d'éveil.</p>
    <p>Aider les assistantes maternelles (former un réseau local, offrir des locaux pour des activités collectives).</p>
  </div>
  
  <div class="competence-card">
    <h4>🤝 Créer un Relais d'Assistants Maternels (RAM)</h4>
    <p>Même si ce n'est pas obligatoire, un RAM permet de mettre en relation les parents et les assistantes maternelles, d'organiser des temps d'éveil pour les enfants, et de soutenir les professionnelles.</p>
  </div>

  <div class="competence-badge cdc">Communauté de Communes du Val d'Orne</div>
  
  <h3 class="cdc">🤝 Rôle possible de la CdC</h3>
  
  <div class="competence-card cdc">
    <h4>🔄 Mutualiser les services</h4>
    <p>Créer un service intercommunal de la petite enfance (une crèche ou un RAM pour plusieurs communes).</p>
    <p>Coordonner les assistantes maternelles du territoire (organiser des formations ou des temps d'échange).</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🏗️ Financer des équipements</h4>
    <p>Construire ou rénover des locaux pour accueillir des enfants (une halte-garderie intercommunale à Putanges-Pont-Écrepin).</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>📚 Soutenir les communes</h4>
    <p>Aider au recensement des besoins ou à la communication vers les familles (éditer un guide des modes de garde disponibles dans la CdC).</p>
  </div>

  <div class="limitations-box">
    <h4>⚠️ Ce que la CdC ne peut pas faire</h4>
    <ul>
      <li>Imposer aux communes une politique petite enfance</li>
      <li>Gérer directement les assistantes maternelles (compétence départementale)</li>
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
      <h4>Accueil du jeune enfant (Actualisation juillet 2025) :</h4>
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
