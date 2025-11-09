<script>
  import { createEventDispatcher } from 'svelte';
  import Download from './commonsElements/Download.svelte';
  
  const dispatch = createEventDispatcher();
  
  function handleSubmit() {
    // Rediriger vers le formulaire de soumission Framaforms
    window.open('https://framaforms.org/qui-autour-de-vous-ferait-un-bon-candidat-sur-la-liste-municipale-de-putanges-1760454296', '_blank');
  }
  
  function handleLearnMore() {
    // Rediriger vers l'article de blog détaillé
    window.location.href = '/blog/qui-autour-de-vous-ferait-un-bon-ou-une-bonne-conseillre-municipale-';
  }
</script>

<div class="campaign-banner">
  <div class="campaign-header">
    <div class="campaign-tag">Municipales 2026</div>
    <div class="campaign-badge">
      <span class="badge-icon">⚡</span>
      <span class="badge-text">En cours</span>
    </div>
  </div>
  
  <div class="campaign-content">
    <div class="campaign-visual">
      <div class="campaign-icon-wrapper">
        <div class="icon-background"></div>
        <span class="campaign-icon">🗳️</span>
      </div>
    </div>
    
    <div class="campaign-text">
      <h3>Proposez vos candidats</h3>
      <p>Désignez les personnes qui vous semblent légitimes pour représenter notre territoire.</p>
    </div>
    
    <div class="campaign-actions">
      <button class="primary-btn" onclick={handleSubmit}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Proposer un candidat</span>
      </button>
      <button class="secondary-btn" onclick={handleLearnMore}>
        <span>En savoir plus</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
  
  <!-- Section livret et permanences -->
  <div class="campaign-info">
    <div class="campaign-info-content">
      <p class="campaign-info-text">
        Un livret présentant le MCCP et sa démarche, ainsi qu'un document expliquant la campagne de désignation ont été distribué dans toutes les boites aux lettres de la commune et sont dispobibles en téléchargement ici.
      </p>
      <div class="campaign-downloads">
        <Download 
          url="/assets/img/Journal_MCCP_4p.pdf"
          label="Livret MCCP"
          format="PDF"
        />
        <Download 
          url="/assets/img/Journal_MCCP_designation.pdf"
          label="Campagne de désignation"
          format="PDF"
        />
      </div>
      <p class="campaign-info-text">
        Vous pouvez aussi venir en parler de vive voix : des personnes du MCCP tiennent des permanences au marché du jeudi matin à Putanges Pont Écrépin.
      </p>
    </div>
  </div>
  
  <div class="campaign-footer">
    <div class="campaign-countdown">
      <svg class="countdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="countdown-text">Campagne jusqu'au 2 décembre 2025</span>
    </div>
  </div>
</div>

<style>
  /* Variables communes */
  .campaign-banner {
    --white-bg: rgba(255, 255, 255, 0.95);
    --white-border: rgba(255, 255, 255, 0.2);
  }

  .campaign-banner {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 10px 30px rgba(46, 139, 87, 0.25);
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.6s ease-out; /* Réutilise l'animation de global.css */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .campaign-banner p,
  .campaign-info-text {
    color: white;
    font-family: var(--font-main);
    margin: 0;
  }

  .campaign-banner p {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.5;
    padding: 0;
  }
  
  /* Éléments avec position relative et z-index */
  .campaign-header,
  .campaign-footer,
  .campaign-info {
    position: relative;
    z-index: 10;
  }

  .campaign-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  /* Badge et countdown - styles communs */
  .campaign-badge,
  .campaign-countdown {
    background: var(--white-bg);
    backdrop-filter: blur(10px);
    border: 2px solid white;
    border-radius: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    font-family: var(--font-main);
  }

  .campaign-badge {
    color: var(--primary);
    animation: pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
  
  .badge-icon {
    font-size: 1.1rem;
    animation: blink 1.5s ease-in-out infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  
  .badge-text,
  .countdown-text {
    font-family: var(--font-main);
  }
  
  .campaign-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .campaign-visual {
    flex-shrink: 0;
  }
  
  .campaign-icon-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    animation: ripple 2s ease-out infinite;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  .campaign-icon {
    font-size: 3rem;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  
  .campaign-text {
    flex: 1;
  }
  
  .campaign-tag {
    display: inline-block;
    background: var(--white-border);
    padding: 0.3rem 0.8rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: var(--font-main);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .campaign-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .campaign-text h3 {
    font-family: var(--font-main);
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    color: white;
    line-height: 1.2;
  }
  
  .campaign-text p {
    font-size: 1.15rem;
    margin: 0 0 1rem 0;
    opacity: 0.95;
    line-height: 1.5;
  }
  
  .campaign-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex-shrink: 0;
    min-width: 220px;
  }
  
  .primary-btn,
  .secondary-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    font-family: var(--font-main);
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.2s ease; /* Harmonisé avec global.css */
    white-space: nowrap;
  }
  
  .primary-btn {
    background: white;
    color: var(--primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .primary-btn:hover {
    transform: translateY(-2px); /* Harmonisé avec global.css */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    background: #f8f9fa;
  }
  
  .primary-btn:active {
    transform: translateY(0);
  }
  
  .secondary-btn {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  .secondary-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: white;
    transform: translateY(-2px); /* Harmonisé avec global.css */
  }
  
  .campaign-countdown {
    color: var(--secondary);
    padding: 0.7rem 1.3rem;
    gap: 0.6rem;
  }
  
  .countdown-icon {
    flex-shrink: 0;
    color: var(--primary);
  }
  
  .campaign-info {
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--white-border);
  }
  
  .campaign-info-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .campaign-info-text {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.95;
  }
  
  .campaign-downloads {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 1rem 0;
  }
  
  /* Adaptation du composant Download au contexte de la campagne */
  .campaign-downloads :global(.help-button) {
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    backdrop-filter: blur(10px);
    margin: 0; /* Réinitialiser le margin du composant Download */
  }
  
  .campaign-downloads :global(.help-button:hover) {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .campaign-banner {
      padding: 1.5rem;
      gap: 1.25rem;
    }
    
    .campaign-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .campaign-badge,
    .campaign-countdown {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }
    
    .campaign-content {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
    }
    
    .campaign-visual {
      order: -1;
    }
    
    .campaign-icon-wrapper {
      width: 70px;
      height: 70px;
    }
    
    .campaign-icon {
      font-size: 2.5rem;
    }
    
    .campaign-text h3 {
      font-size: 1.6rem;
    }
    
    .campaign-text p {
      font-size: 1.05rem;
    }
    
    .campaign-actions {
      width: 100%;
      min-width: auto;
    }
    
    .primary-btn,
    .secondary-btn {
      width: 100%;
      padding: 1rem;
    }
    
    .campaign-footer {
      margin-top: 0.5rem;
    }
    
    .countdown-text {
      font-size: 0.9rem;
    }
    
    .campaign-info {
      margin-top: 0.75rem;
      padding-top: 1rem;
    }
    
    .campaign-info-text {
      font-size: 0.95rem;
    }
    
    .campaign-downloads {
      flex-direction: column;
      gap: 0.75rem;
      align-items: center;
    }
    
    .campaign-downloads :global(.help-button) {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }
</style>
