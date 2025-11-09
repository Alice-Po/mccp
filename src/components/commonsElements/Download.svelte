<!--
  =============================================================================
  COMPOSANT: DOWNLOAD - LIEN DE TÉLÉCHARGEMENT
  =============================================================================
  
  Composant pour un lien de téléchargement avec style help-button
  Réutilisable pour n'importe quel type de fichier
-->

<script lang="ts">
  // Props pour configurer le lien
  interface DownloadProps {
    url: string;        // URL du fichier à télécharger
    label: string;      // Texte affiché sur le bouton
    format: string;     // Format du fichier (PDF, ODS, etc.)
    inverted?: boolean; // Inverser les couleurs (fond coloré par défaut)
  }

  // Props obligatoires
  const props = $props<DownloadProps>();
</script>

<a href={props.url} class={`help-button ${props.inverted ? 'inverted' : ''}`} download>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
  <span class="download-label">{props.label}</span>
  <span class="download-format">{props.format}</span>
</a>

<style>
  .help-button {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    padding: 0.6rem 1.2rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    text-decoration: none;
    margin: 0 0.5rem;
    max-width: 100%;
    box-sizing: border-box;
  }

  .help-button:hover {
    background: var(--primary);
    color: white;
    transform: none;
    box-shadow: none;
  }

  /* Style inversé */
  .help-button.inverted {
    background: var(--primary);
    color: white;
  }

  .help-button.inverted:hover {
    background: transparent;
    color: var(--primary);
  }

  .download-label {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  .download-format {
    font-size: 0.8rem;
    opacity: 0.8;
    flex-shrink: 0;
  }
  
  .help-button svg {
    flex-shrink: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .help-button {
      margin: 0.25rem 0;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      gap: 0.4rem;
      width: 100%;
      max-width: 100%;
      justify-content: center;
    }
    
    .help-button svg {
      width: 20px;
      height: 20px;
    }
    
    .download-label {
      white-space: normal;
      text-align: center;
      line-height: 1.3;
    }
    
    .download-format {
      font-size: 0.75rem;
    }
  }
  
  /* Très petits écrans */
  @media (max-width: 400px) {
    .help-button {
      padding: 0.5rem 0.6rem;
      font-size: 0.75rem;
      gap: 0.3rem;
    }
    
    .help-button svg {
      width: 18px;
      height: 18px;
    }
    
    .download-format {
      font-size: 0.7rem;
    }
  }
</style>
