<script>
  import '../../styles/competences.css';
  
  export let title = 'Emploi et insertion professionnelle';
  
  let showReference = false;
  
  function toggleReference() {
    showReference = !showReference;
  }
</script>

<div class="competence-section">
  <div class="competence-badge commune">Commune de Putanges-le-Lac</div>
  
  <h3>💼 Accompagner l'emploi local</h3>
  
  <div class="competence-card">
    <h4>🤝 Relais de Pôle Emploi</h4>
    <p>La mairie peut recevoir des offres d'emploi locales et aider à les diffuser :</p>
    <ul>
      <li>Affichage en mairie</li>
      <li>Site internet communal</li>
      <li>Bulletin municipal</li>
    </ul>
  </div>
  
  <div class="competence-card">
    <h4>👥 Missions locales pour les jeunes</h4>
    <p>Participer au financement ou à l'animation d'une antenne locale pour accompagner les jeunes (16-25 ans) sortis du système scolaire.</p>
  </div>
  
  <div class="competence-card">
    <h4>📝 Ateliers d'insertion</h4>
    <p>Organiser des ateliers CV, simulations d'entretien, ou des forums emploi avec les entreprises locales.</p>
  </div>
  
  <div class="competence-card">
    <h4>🏗️ Chantiers d'insertion</h4>
    <p>Signer des conventions avec l'État pour créer des chantiers d'insertion :</p>
    <ul>
      <li>Entretien des chemins creux</li>
      <li>Restauration du patrimoine</li>
      <li>Travaux d'utilité collective</li>
    </ul>
  </div>
  
  <div class="competence-card">
    <h4>📋 Plans locaux pour l'emploi</h4>
    <p>Élaborer un plan pluriannuel avec les acteurs locaux pour cibler les besoins en compétences.</p>
  </div>
  
  <div class="competence-card">
    <h4>🏢 Aides aux employeurs</h4>
    <p>Proposer des subventions ou des locaux à tarifs préférentiels pour les entreprises qui embauchent des habitants en difficulté.</p>
  </div>
  
  <div class="competence-card">
    <h4>🎯 Service civique</h4>
    <p>Promouvoir le service civique pour les 18-24 ans, notamment dans les domaines de l'environnement ou de l'animation locale.</p>
  </div>

  <div class="competence-badge cdc">Communauté de Communes du Val d'Orne</div>
  
  <h3 class="cdc">🤝 Comment la CdC coordonne l'emploi</h3>
  
  <div class="competence-card cdc">
    <h4>🏢 Maison de l'emploi intercommunale</h4>
    <p>Créer un guichet unique pour l'emploi et la formation, en partenariat avec :</p>
    <ul>
      <li>Pôle Emploi</li>
      <li>La Mission Locale</li>
      <li>Les chambres consulaires</li>
    </ul>
  </div>
  
  <div class="competence-card cdc">
    <h4>🌐 Réseau pour l'emploi</h4>
    <p>Intégrer le réseau territorial pour l'emploi afin de mieux connecter les offreurs et demandeurs d'emploi sur le territoire.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🚀 Soutien aux filières locales</h4>
    <p>Identifier les secteurs créateurs d'emplois :</p>
    <ul>
      <li>Tourisme autour du lac de Rabodanges</li>
      <li>Circuits courts agricoles</li>
      <li>Artisanat local</li>
    </ul>
  </div>
  
  <div class="competence-card cdc">
    <h4>💪 Insertion par l'activité économique (IAE)</h4>
    <p>Financer ou porter des structures d'insertion pour redonner une activité aux chômeurs de longue durée.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🎓 Formation et reconversion</h4>
    <p>Organiser des formations courtes et ciblées en lien avec les besoins des entreprises locales.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🚌 Bus de l'emploi</h4>
    <p>Financer un service de transport pour emmener les jeunes vers les formations ou les entreprises qui recrutent.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🌾 Agriculture et artisanat</h4>
    <p>Soutenir la reprise des fermes abandonnées en aidant à la formation des nouveaux agriculteurs.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🏖️ Tourisme saisonnier</h4>
    <p>Mettre en place un système de pré-recrutement pour les emplois saisonniers.</p>
  </div>
  
  <div class="competence-card cdc">
    <h4>🔄 Circuits courts</h4>
    <p>Développer des projets collectifs qui créent des emplois non délocalisables.</p>
  </div>

  <div class="limitations-box">
    <h4>⚠️ Ce que la commune et la CdC ne gèrent pas directement</h4>
    <ul>
      <li><strong>Indemnisation chômage</strong> : Gérée par Pôle Emploi et l'Unédic</li>
      <li><strong>Formation professionnelle longue</strong> : Relève de la Région ou de l'État</li>
      <li><strong>Politique nationale de l'emploi</strong> : Définie par l'État</li>
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
      <h4>Concours au service public de l'emploi</h4>
      <ul>
        <li>Possibilité de délégation par Pôle emploi de la réception d'offres d'emplois et d'opérations de placement</li>
        <li>Possibilité de participation aux maisons de l'emploi</li>
        <li>Possibilité de participation aux structures d'accompagnement et d'insertion professionnelle des jeunes (missions locales)</li>
        <li>Participation au conseil régional de l'emploi</li>
        <li>Possibilité pour les communes de contribuer au service public de l'emploi dans les conditions prévues aux articles L.5322-1 à L.5322-4 du code du travail</li>
        <li>Représentation des communes et des départements grâce à l'octroi d'un siège au conseil d'administration de Pôle emploi (un siège en tout), au titre de l'article L.5312-4 du code du travail</li>
      </ul>
      
      <h4>Plans et conventions</h4>
      <ul>
        <li>Possibilité de mise en œuvre des plans locaux pluriannuels pour l'insertion et l'emploi</li>
        <li>Possibilité de conclure avec l'État des conventions au titre de l'insertion par l'activité économique</li>
        <li>Participation au réseau pour l'emploi (article L. 5311-7 du code du travail)</li>
      </ul>
      <p style="opacity:.7;font-size:.9em;">Actualisation juillet 2025</p>
    </div>
  </div>
</div>
