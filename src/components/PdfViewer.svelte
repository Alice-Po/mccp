<!--
  =============================================================================
  COMPOSANT: PDF MODAL - VIEWER PDF SIMPLE ET EFFICACE
  =============================================================================
  
  Modal plein écran pour visualiser les PDFs avec iframe
  Fonctionnalités :
  - Affichage PDF natif avec scroll libre
  - Ctrl+F natif du navigateur
  - Sélection et copie de texte
  - Zoom natif
  - Navigation fluide
-->

<script>
  import { onMount } from 'svelte';
  
  export let pdfUrl = '';
  export let documentTitle = '';
  export let isVisible = false;
  export let isMobile = false;

  $: viewerUrl = pdfUrl;

  let isLoading = true;
  let error = null;
  let iframe;
  let latestCR = null;

  function handleIframeLoad() {
    isLoading = false;
    console.log('[PdfViewer] ✅ PDF chargé');
  }

  function handleIframeError() {
    isLoading = false;
    error = 'Erreur lors du chargement du PDF';
    console.error('[PdfViewer] ❌ Erreur chargement iframe');
  }

  // Reset loading state when URL changes
  $: if (pdfUrl) {
    isLoading = true;
    error = null;
  }

  // Fonction de téléchargement du PDF
  function downloadPdf() {
    if (pdfUrl) {
      // Créer un nom de fichier basé sur le titre du document
      const fileName = (documentTitle || 'document')
        .replace(/[^a-zA-Z0-9\s]/g, '') // Supprimer caractères spéciaux
        .replace(/\s+/g, '_') // Remplacer espaces par underscores
        .toLowerCase() + '.pdf';
      
      // Créer un lien temporaire pour télécharger
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('📥 PdfViewer - Téléchargement initié:', fileName);
    }
  }

  // Fonction pour charger le dernier CR municipal
  async function loadLatestCR() {
    try {
      const response = await fetch('/assets/datas/ocr_index.json');
      const data = await response.json();
      
      // Trier les CRs par date d'événement (du plus récent au plus ancien)
      const sortedCRs = data.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        if (a.eventDate && b.eventDate) {
          return new Date(b.eventDate) - new Date(a.eventDate);
        }
        return 0;
      });
      
      if (sortedCRs.length > 0) {
        latestCR = sortedCRs[0];
        console.log('📄 PdfViewer - Dernier CR municipal chargé:', latestCR);
      }
    } catch (error) {
      console.error('❌ PdfViewer - Erreur chargement index CR:', error);
    }
  }

  // Fonction pour ouvrir le dernier CR municipal
  function openLatestCR() {
    if (latestCR) {
      const event = new CustomEvent('updatePdfViewer', {
        detail: {
          pdfUrl: `/assets/datas/CR-municipaux/${latestCR.file}`,
          documentTitle: `CR Municipal du ${latestCR.eventDate || latestCR.year}`,
          isVisible: true,
          isMobile: isMobile
        }
      });
      document.dispatchEvent(event);
    }
  }

  // Écouter les mises à jour depuis la page
  onMount(() => {
    console.log('🎬 PdfViewer - Composant monté, écoute des événements');
    
    // Charger le dernier CR municipal
    loadLatestCR();
    
    const handleUpdate = (event) => {
      console.log('📺 PdfViewer - Événement updatePdfViewer reçu:', event);
      const detail = event.detail;
      console.log('📺 PdfViewer - Detail:', detail);
      
      if (detail) {
        console.log('📺 PdfViewer - Mise à jour état:', {
          oldPdfUrl: pdfUrl,
          newPdfUrl: detail.pdfUrl,
          oldTitle: documentTitle,
          newTitle: detail.documentTitle,
          oldVisible: isVisible,
          newVisible: detail.isVisible
        });
        
        pdfUrl = detail.pdfUrl || '';
        documentTitle = detail.documentTitle || '';
        isVisible = detail.isVisible || false;
        isMobile = detail.isMobile || false;
        
        console.log('📺 PdfViewer - État après mise à jour:', { pdfUrl, documentTitle, isVisible, isMobile });
      }
    };

    document.addEventListener('updatePdfViewer', handleUpdate);

    return () => {
      document.removeEventListener('updatePdfViewer', handleUpdate);
    };
  });
</script>

<div class="pdf-viewer">
  {#if pdfUrl && isVisible}
    <!-- Header -->
    <div class="viewer-header">
      {#if isMobile}
        <!-- Bouton retour mobile -->
        <button 
          class="mobile-back-btn" 
          on:click={() => {
            const event = new CustomEvent('mobileBackToArborescence');
            document.dispatchEvent(event);
          }}
        >
          ← Retour aux documents
        </button>
      {/if}
      <div class="viewer-title-row">
        <h3 class="viewer-title">
          📄 {documentTitle || 'Document PDF'}
        </h3>
        <button 
          class="download-btn" 
          on:click={() => downloadPdf()}
          title="Télécharger le PDF"
        >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        </button>
      </div>

    </div>
    
    <!-- PDF Content -->
    <div class="viewer-content">
      {#if isLoading}
        <div class="viewer-loading">
          <div class="loading-spinner"></div>
          <p>Chargement du PDF...</p>
        </div>
      {/if}

      {#if error}
        <div class="viewer-error">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p class="error-title">Erreur de chargement</p>
          <p class="error-message">{error}</p>
          <button 
            on:click={() => window.open(pdfUrl, '_blank')}
            class="error-button"
          >
            Ouvrir dans un nouvel onglet
          </button>
        </div>
      {:else}
        <iframe
          bind:this={iframe}
          src={viewerUrl}
          class="pdf-iframe"
          title="Viewer PDF - {documentTitle}"
          on:load={handleIframeLoad}
          on:error={handleIframeError}
          sandbox="allow-scripts allow-same-origin allow-downloads allow-forms"
        ></iframe>
      {/if}
    </div>
  {:else}
    <!-- Placeholder : invitation à sélectionner un document -->
    <div class="pdf-viewer-placeholder">
      <div class="placeholder-content">
        <div class="placeholder-icon">📄</div>
        <h3>Consulter un document</h3>
        <p>Sélectionnez un document dans l'arborescence de gauche pour le consulter dans cette zone. <strong>💡 Astuce :</strong> Utilisez <kbd>Ctrl+F</kbd> pour rechercher dans le document une fois ouvert</p>
        
        {#if latestCR}
          <div class="cta-container">
            <button class="cta-accordion" on:click={openLatestCR}>
              <span class="cta-text">Consulter le dernier compte-rendu municipal</span>
              <svg class="cta-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .pdf-viewer {
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: white;
  }

  .viewer-header {
    padding: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }

  .mobile-back-btn {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 0.75rem;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mobile-back-btn:hover {
    background-color: var(--primary-dark);
  }

  .mobile-back-btn:active {
    transform: translateY(1px);
  }

  .viewer-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .viewer-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--secondary);
    margin: 0;
    font-family: var(--font-main);
    flex: 1;
  }

  .download-btn {
    background-color: var(--primary);
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.75rem;
    height: 2.75rem;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .download-btn:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .download-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .download-icon {
    width: 1.375rem;
    height: 1.375rem;
    transition: all 0.2s ease;
  }

  .download-btn:hover .download-icon {
    transform: scale(1.15);
  }

  .viewer-help {
    font-size: 0.85rem;
    color: var(--secondary);
    opacity: 0.7;
    margin: 0;
  }

  kbd {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    background-color: #f3f4f6;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    border: 1px solid #d1d5db;
  }

  .viewer-content {
    flex: 1;
    position: relative;
    background-color: #f5f5f5;
  }

  .viewer-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    z-index: 10;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e5e7eb;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .viewer-loading p {
    color: #6b7280;
    margin: 0;
  }

  .viewer-error {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: #dc2626;
    z-index: 10;
    padding: 2rem;
    text-align: center;
  }

  .error-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }

  .error-message {
    font-size: 0.9rem;
    margin: 0 0 1.5rem 0;
    opacity: 0.8;
  }

  .error-button {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .error-button:hover {
    background-color: var(--primary-dark);
  }

  .pdf-iframe {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 120px); /* Hauteur totale moins le header */
    border: none;
  }

  .pdf-viewer-placeholder {
    height: 100vh;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
  }

  .placeholder-content {
    text-align: center;
    color: #6b7280;
    max-width: 400px;
    padding: 2rem;
  }

  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.6;
  }

  .placeholder-content h3 {
    font-size: 1.3rem;
    color: var(--secondary);
    margin: 0 0 1rem 0;
    font-weight: 600;
  }

  .placeholder-content p {
    font-size: 0.95rem;
    margin: 0 0 1rem 0;
    opacity: 0.8;
    line-height: 1.6;
  }

  .placeholder-tips {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1.5rem;
  }

  .placeholder-tips p {
    margin: 0;
    font-size: 0.85rem;
    color: #0369a1;
  }

  .placeholder-tips strong {
    font-weight: 600;
  }

  /* Styles pour le CTA */
  .cta-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .cta-accordion {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
  }

  .cta-accordion:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(46, 139, 87, 0.4);
  }

  .cta-icon {
    transition: transform 0.3s ease;
  }

  .cta-accordion:hover .cta-icon {
    transform: translateX(3px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .viewer-header {
      padding: 1rem;
    }

    .viewer-title {
      font-size: 1rem;
    }

    .viewer-title-row {
      gap: 0.75rem;
    }

    .download-btn {
      min-width: 2.25rem;
      height: 2.25rem;
      padding: 0.375rem;
    }

    .download-icon {
      width: 1.125rem;
      height: 1.125rem;
    }

    .viewer-help {
      font-size: 0.8rem;
    }

    .placeholder-content h3 {
      font-size: 1rem;
    }

    .placeholder-content p {
      font-size: 0.85rem;
    }
  }

  /* Masquer le bouton retour en mode desktop */
  @media (min-width: 769px) {
    .mobile-back-btn {
      display: none !important;
    }
  }
</style> 