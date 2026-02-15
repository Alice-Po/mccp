<script>
  // Composant pour le sondage sur les pronostics électoraux
</script>

<div class="poll-card">
  <div class="poll-layout">
    <div class="poll-left">
      <img src="/assets/img/sondage.png" alt="Sondage" class="poll-image" />
    </div>
    
    <div class="poll-content">
      <h3>Votre pronostic sur le résultat de la liste du MCCP</h3>
      <p class="poll-highlight">
        <strong>Une expérience collective, simple et amusante !</strong>
      </p>
      <p class="poll-info">
        Le principe de la sagesse des foules : lorsqu'un grand nombre de personnes donnent une estimation indépendante, la moyenne est souvent étonnamment proche du résultat réel.
      </p>
      <p class="poll-cta">
        👉 <strong>Sans vous concerter avec d'autres personnes, </strong>, donnez votre estimation : <em>quel pourcentage de voix obtiendra notre liste ?</em>
      </p>
    </div>
    
    <div class="poll-actions">
      <a 
        href="https://framaforms.org/votre-pronostic-sur-le-resultat-de-la-liste-du-mccp-1771017145" 
        target="_blank" 
        rel="noopener noreferrer"
        class="poll-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Donner votre pronostic</span>
      </a>
    </div>
  </div>
</div>

<style>
  .poll-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    margin: 2rem 0;
    border: 1px solid rgba(46, 139, 87, 0.15);
  }
  
  .poll-card:hover {
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.15);
    transform: translateY(-2px);
  }
  
  .poll-layout {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.5rem;
    align-items: center;
  }
  
  .poll-left {
    display: flex;
    align-items: center;
  }
  
  .poll-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 0.5rem;
  }
  
  .poll-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .poll-content h3 {
    font-family: var(--font-main);
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
    color: var(--secondary);
    line-height: 1.3;
  }
  
  .poll-highlight {
    font-size: 1.05rem;
    color: var(--primary);
    margin: 0;
    line-height: 1.5;
  }
  
  .poll-info {
    font-size: 0.95rem;
    color: var(--secondary);
    margin: 0;
    line-height: 1.5;
    opacity: 0.85;
  }
  
  .poll-cta {
    font-size: 1rem;
    color: var(--secondary);
    margin: 0;
    line-height: 1.5;
    font-style: italic;
  }
  
  .poll-actions {
    display: flex;
    align-items: center;
  }
  
  .poll-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-family: var(--font-main);
    font-weight: 600;
    font-size: 1rem;
    background-color: var(--primary);
    color: white;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .poll-btn:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(46, 139, 87, 0.25);
  }
  
  .poll-btn svg {
    flex-shrink: 0;
  }
  
  /* Responsive */
  @media (max-width: 968px) {
    .poll-layout {
      grid-template-columns: auto 1fr;
      gap: 1rem;
    }
    
    .poll-actions {
      grid-column: 2;
      justify-content: flex-start;
    }
    
    .poll-btn {
      font-size: 0.95rem;
      padding: 0.65rem 1.25rem;
    }
  }
  
  @media (max-width: 768px) {
    .poll-card {
      padding: 1rem;
    }
    
    .poll-layout {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .poll-left {
      justify-content: center;
    }
    
    .poll-image {
      width: 60px;
      height: 60px;
    }
    
    .poll-content h3 {
      font-size: 1.2rem;
      text-align: center;
    }
    
    .poll-highlight {
      font-size: 1rem;
      text-align: center;
    }
    
    .poll-info {
      font-size: 0.9rem;
      text-align: center;
    }
    
    .poll-cta {
      font-size: 0.95rem;
      text-align: center;
    }
    
    .poll-actions {
      grid-column: 1;
      justify-content: center;
    }
    
    .poll-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
