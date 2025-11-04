<script>
  // Composant pour l'inscription sur les listes électorales
</script>

<div class="voter-card">
  <div class="voter-layout">
    <div class="voter-left">
      <div class="voter-icon">❓</div>
    </div>
    
    <div class="voter-content">
      <h3>Êtes-vous inscrit pour voter à Putanges ?</h3>
      <p class="voter-highlight">
        <strong>C'est encore possible de changer de lieu de vote !</strong> Votez là où votre voix compte le plus !
      </p>
      <p class="voter-info">
        Vous avez jusqu'au <strong>4 février 2026</strong> pour vous inscrire. 
        Démarches simples : en mairie ou sur internet.
      </p>
    </div>
    
    <div class="voter-actions">
      <a 
        href="https://www.service-public.gouv.fr/particuliers/vosdroits/R16396" 
        target="_blank" 
        rel="noopener noreferrer"
        class="voter-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>S'inscrire</span>
      </a>
    </div>
  </div>
</div>

<style>
  .voter-card {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    margin: 2rem 0;
  }
  
  .voter-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
  
  .voter-layout {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.25rem;
    align-items: center;
  }
  
  .voter-left {
    display: flex;
    align-items: center;
  }
  
  .voter-icon {
    font-size: 2.5rem;
    line-height: 1;
  }
  
  .voter-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .voter-content h3 {
    font-family: var(--font-main);
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
    color: var(--secondary);
    line-height: 1.3;
  }
  
  .voter-highlight {
    font-size: 1.05rem;
    color: var(--secondary);
    margin: 0;
    line-height: 1.5;
  }
  
  
  .voter-info {
    font-size: 0.95rem;
    color: var(--secondary);
    margin: 0;
    line-height: 1.5;
    opacity: 0.85;
  }
  

  
  .voter-actions {
    display: flex;
    align-items: center;
  }
  
  .voter-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.65rem 1.25rem;
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
  
  .voter-btn:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  .voter-btn svg {
    flex-shrink: 0;
  }
  
  /* Responsive */
  @media (max-width: 968px) {
    .voter-layout {
      grid-template-columns: auto 1fr;
      gap: 1rem;
    }
    
    .voter-actions {
      grid-column: 2;
      justify-content: flex-start;
    }
    
    .voter-btn {
      font-size: 0.95rem;
      padding: 0.6rem 1rem;
    }
  }
  
  @media (max-width: 768px) {
    .voter-card {
      padding: 1rem;
    }
    
    .voter-layout {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .voter-left {
      display: none;
    }
    
    .voter-content h3 {
      font-size: 1.2rem;
    }
    
    .voter-highlight {
      font-size: 1rem;
    }
    
    .voter-info {
      font-size: 0.9rem;
    }
    
    .voter-actions {
      grid-column: 1;
    }
    
    .voter-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>

