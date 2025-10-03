<script>
  import '../../styles/competences.css';
  
  export let title = 'Action Sociale et Santé';
  
  let showReference = false;
  
  function toggleReference() {
    showReference = !showReference;
  }
</script>

<div class="competence-section">
  
  <div class="competence-badge commune">Commune de Putanges-le-Lac</div>
  
  <h3>🤝 Le maire et le CCAS, premiers acteurs de la solidarité</h3>
  
  <div class="competence-card">
    <h4>🆘 Aides et accompagnement social</h4>
    <p>Le CCAS peut intervenir pour soutenir les habitants en difficulté :</p>
    <ul>
      <li>Aides d'urgence (financières ou en nature)</li>
      <li>Accompagnement aux démarches (RSA, APA, dossiers sociaux)</li>
      <li>Suivi des personnes âgées/fragiles (fichier social, visites)</li>
    </ul>
  </div>

  <div class="competence-card">
    <h4>👶 Petite enfance et personnes âgées</h4>
    <p>La commune peut soutenir les publics les plus vulnérables :</p>
    <ul>
      <li>Crèches, haltes-garderies et services petite enfance</li>
      <li>Foyers-logements, résidences et logements adaptés</li>
    </ul>
  </div>

  <div class="competence-card">
    <h4>🏥 Santé publique et cadre de vie</h4>
    <p>Actions au service de la santé et de la salubrité :</p>
    <ul>
      <li>Qualité de l'eau et assainissement</li>
      <li>Lutte contre l'insalubrité et nuisibles</li>
      <li>Participation aux instances hospitalières (voix consultative)</li>
    </ul>
  </div>

  <div class="competence-card">
    <h4>🧑‍⚕️ Accès aux soins</h4>
    <p>Faciliter l'installation et le maintien des professionnels de santé :</p>
    <ul>
      <li>Appui aux maisons de santé</li>
      <li>Aides à l'installation (locaux, loyers)</li>
    </ul>
  </div>

  <div class="competence-badge cdc">Communauté de Communes du Val d'Orne</div>
  
  <h3 class="cdc">🧩 Comment la CdC complète l'action sociale communale</h3>

  <div class="competence-card cdc">
    <h4>🏛️ CIAS (Centre intercommunal d'action sociale)</h4>
    <p>Coordination et mutualisation des aides sur l'ensemble du territoire.</p>
  </div>

  <div class="competence-card cdc">
    <h4>🏗️ Équipements et habitat</h4>
    <p>Investissements possibles pour :</p>
    <ul>
      <li>Maisons de santé et EHPAD</li>
      <li>Logements sociaux et adaptés</li>
    </ul>
  </div>

  <div class="competence-card cdc">
    <h4>🩺 Soutien aux professionnels de santé</h4>
    <p>Partenariats et aides à l'installation (avec le département et l'État).</p>
  </div>

  <div class="competence-card cdc">
    <h4>🦟 Lutte anti-vectorielle</h4>
    <p>Participation au financement (démoustication, nuisibles).</p>
  </div>

  <div class="limitations-box">
    <h4>⚠️ Ce que la CdC ne gère pas directement</h4>
    <ul>
      <li>Gestion des hôpitaux et cliniques (État/établissements publics)</li>
      <li>Versement des aides comme le RSA ou l'APA (département)</li>
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
      <h4>Rôle général</h4>
      <p>Animation d'une action générale de prévention et de développement social sur le territoire de la commune par le biais d'un centre communal ou intercommunal d'action sociale (CCAS ou CIAS). Pour les communes de moins de 1 500 habitants, possibilité de ne pas créer ou de dissoudre le CCAS et d'assurer la compétence sociale par un CIAS ou un service non personnalisé.</p>
      <p>Nouvelle possibilité pour les communautés urbaines et les métropoles de créer un centre intercommunal d'action sociale (article L.123-4-1 du CASF).</p>

      <h4>Compétences et interventions</h4>
      <ul>
        <li>Attribution de l'aide sociale facultative (secours aux familles en difficulté, (non) remboursement des prestations).</li>
        <li>Constitution des dossiers de demande d'aide sociale et transmission à l'autorité compétente si l'instruction relève d'une autre autorité.</li>
        <li>Mise en place d'un fichier pour recueillir les informations utiles à l'intervention des services sociaux et sanitaires auprès des personnes âgées et des personnes handicapées (identité, âge, adresse du domicile…).</li>
        <li>Possibilité de créer et de gérer un établissement ou service public à caractère social ou médico-social (centres d'accueil des enfants de moins de six ans, foyers destinés aux personnes âgées…).</li>
        <li>Possibilité de construire ou de subventionner la réalisation d'infrastructures et d'équipements publics sanitaires (notamment en zone de montagne) pour maintenir les services.</li>
        <li>Pouvoirs de police municipale en matière de sécurité et de salubrité, ainsi que certaines dimensions de la politique de l'habitat (résorption de l'insalubrité et des immeubles menaçant ruine …).</li>
        <li>Gestion du fonds d'aide aux jeunes en difficulté.</li>
      </ul>

      <h4>Logement</h4>
      <ul>
        <li>Autorisation, mise en œuvre ou subvention d'actions ou opérations d'aménagement permettant la réalisation de logements locatifs sociaux pour répondre aux besoins en hébergement des personnes mal logées, défavorisées ou présentant des difficultés particulières.</li>
        <li>Possibilité de participer au financement du Fonds de Solidarité pour le Logement (FSL) afin d'aider les personnes qui ne peuvent assumer leurs obligations (loyer, charges, eau, énergie, services téléphoniques).</li>
      </ul>

      <h4>Santé publique et environnement</h4>
      <ul>
        <li>Organisation et financement des services municipaux de désinfection et des services communaux d'hygiène et de santé.</li>
        <li>Organisation des campagnes de vaccination gratuite ; salubrité des habitations, des agglomérations et de tous les milieux de vie ; alimentation en eau destinée à la consommation humaine ; évacuation, traitement, élimination et utilisation des eaux usées et des déchets.</li>
        <li>Devoir d'alerte et de veille sanitaire (signalement sans délai des menaces imminentes pour la santé de la population) et transmission à l'Institut de veille sanitaire des informations nécessaires.</li>
        <li>Participation aux différentes commissions des Agences Régionales de Santé (ARS).</li>
        <li>Aides aux professionnels de santé pour favoriser les soins en zones déficitaires (article L.1511‑8 du CGCT) : compétence de plein droit.</li>
        <li>Financement partagé avec les départements de la lutte anti‑vectorielle.</li>
      </ul>

      <h4>Relations avec les établissements de santé</h4>
      <ul>
        <li>Le maire (ou son représentant) peut participer avec voix consultative aux réunions du conseil de surveillance de l'établissement principal lors de fusions ou mises en direction commune (article L. 6143‑5 du Code de la santé publique).</li>
        <li>Les communes et leurs groupements peuvent contribuer volontairement au financement du programme d'investissement des établissements de santé publics, privés d'intérêt collectif et privés (article L. 1422‑3 du Code de la santé publique).</li>
        <li>Les centres de santé peuvent être créés et gérés par les communes ou leurs groupements (article L. 6323‑1‑3 du Code de la santé publique).</li>
      </ul>
      <p style="opacity:.7;font-size:.9em;">Actualisation juillet 2025</p>
    </div>
  </div>

</div>
