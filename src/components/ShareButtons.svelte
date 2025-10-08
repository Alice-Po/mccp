<script lang="ts">
  export let url: string;
  export let title: string;
  export let description: string = "";
  
  let isOpen = false;
  let copySuccess = false;
  let shareButton: HTMLButtonElement;
  let shareMenu: HTMLDivElement;

  // Fonction pour basculer l'état d'ouverture
  function toggleShare() {
    isOpen = !isOpen;
    if (isOpen && shareButton && shareMenu) {
      positionMenu();
    }
  }

  // Fonction pour positionner le menu
  function positionMenu() {
    const buttonRect = shareButton.getBoundingClientRect();
    const menuRect = shareMenu.getBoundingClientRect();
    
    // Positionner le menu sous le bouton
    shareMenu.style.top = `${buttonRect.bottom + 8}px`;
    shareMenu.style.left = `${buttonRect.left}px`;
    
    // Ajuster si le menu dépasse à droite
    if (buttonRect.left + menuRect.width > window.innerWidth) {
      shareMenu.style.left = `${window.innerWidth - menuRect.width - 16}px`;
    }
    
    // Ajuster si le menu dépasse en bas
    if (buttonRect.bottom + menuRect.height > window.innerHeight) {
      shareMenu.style.top = `${buttonRect.top - menuRect.height - 8}px`;
    }
  }

  // Fonction pour fermer le menu
  function closeShare() {
    isOpen = false;
  }

  // Fonction pour copier l'URL dans le presse-papiers
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }

  // Fonction pour partager via SMS
  function shareViaSMS() {
    const text = `${title} - ${url}`;
    const smsUrl = `sms:?body=${encodeURIComponent(text)}`;
    window.open(smsUrl);
    closeShare();
  }

  // Fonction pour partager via email
  function shareViaEmail() {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl);
    closeShare();
  }

  // Fonction pour partager via WhatsApp
  function shareViaWhatsApp() {
    const text = `${title} - ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    closeShare();
  }

  // Fonction pour partager via Signal
  function shareViaSignal() {
    const text = `${title} - ${url}`;
    const signalUrl = `https://signal.me/#p/${encodeURIComponent(text)}`;
    window.open(signalUrl, '_blank');
    closeShare();
  }

  // Fonction pour partager via Facebook
  function shareViaFacebook() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    closeShare();
  }

  // Fonction pour utiliser l'API de partage natif du navigateur
  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url
        });
        closeShare();
      } catch (err) {
        console.error('Erreur lors du partage natif:', err);
      }
    }
  }

  // Gestionnaire pour fermer le menu en cliquant à l'extérieur
  function handleClickOutside(event: MouseEvent) {
    if (isOpen && shareMenu && !shareMenu.contains(event.target as Node) && !shareButton.contains(event.target as Node)) {
      closeShare();
    }
  }

  // Ajouter/retirer le gestionnaire d'événements
  $: if (typeof window !== 'undefined') {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }
</script>

<div class="share-container">
  <button bind:this={shareButton} class="share-button {isOpen ? 'active' : ''}" on:click={toggleShare}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24919 15.0227 5.37063L8.46447 9.46447C7.98815 8.98815 7.32588 8.7 6.6 8.7C4.61177 8.7 3 10.3118 3 12.3C3 14.2882 4.61177 15.9 6.6 15.9C7.32588 15.9 7.98815 15.6118 8.46447 15.1355L15.0227 19.2294C15.0077 19.3508 15 19.4745 15 19.6C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 19.6C21 17.5431 19.6569 16.2 18 16.2C17.2741 16.2 16.6118 16.4882 16.1355 16.9645L9.57727 12.8706C9.59227 12.7492 9.6 12.6255 9.6 12.5C9.6 12.3745 9.59227 12.2508 9.57727 12.1294L16.1355 8.03553C16.6118 8.51185 17.2741 8.8 18 8.8V8Z" fill="currentColor"/>
    </svg>
    <span>Partager</span>
  </button>

  {#if isOpen}
    <div bind:this={shareMenu} class="share-menu">
      <div class="share-options">
        <!-- Partage natif (mobile) -->
        {#if typeof navigator !== 'undefined' && navigator.share}
          <button class="share-option" on:click={shareNative}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24919 15.0227 5.37063L8.46447 9.46447C7.98815 8.98815 7.32588 8.7 6.6 8.7C4.61177 8.7 3 10.3118 3 12.3C3 14.2882 4.61177 15.9 6.6 15.9C7.32588 15.9 7.98815 15.6118 8.46447 15.1355L15.0227 19.2294C15.0077 19.3508 15 19.4745 15 19.6C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 19.6C21 17.5431 19.6569 16.2 18 16.2C17.2741 16.2 16.6118 16.4882 16.1355 16.9645L9.57727 12.8706C9.59227 12.7492 9.6 12.6255 9.6 12.5C9.6 12.3745 9.59227 12.2508 9.57727 12.1294L16.1355 8.03553C16.6118 8.51185 17.2741 8.8 18 8.8V8Z" fill="currentColor"/>
            </svg>
            <span>Partager</span>
          </button>
        {/if}

        <!-- Copier le lien -->
        <button class="share-option {copySuccess ? 'success' : ''}" on:click={copyToClipboard}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
          </svg>
          <span>{copySuccess ? 'Copié !' : 'Copier le lien'}</span>
        </button>

        <!-- Email -->
        <button class="share-option" on:click={shareViaEmail}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
          </svg>
          <span>Email</span>
        </button>

        <!-- SMS -->
        <button class="share-option" on:click={shareViaSMS}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          </svg>
          <span>SMS</span>
        </button>

        <!-- WhatsApp -->
        <button class="share-option" on:click={shareViaWhatsApp}>
          <img src="/assets/img/logo/whatsapp-icon.png" alt="WhatsApp" width="20" height="20" />
          <span>WhatsApp</span>
        </button>

        <!-- Signal -->
        <button class="share-option" on:click={shareViaSignal}>
          <img src="/assets/img/logo/Signal-icon.png" alt="Signal" width="20" height="20" />
          <span>Signal</span>
        </button>

        <!-- Facebook -->
        <button class="share-option" on:click={shareViaFacebook}>
          <img src="/assets/img/logo/Facebook-icon.png" alt="Facebook" width="20" height="20" />
          <span>Facebook</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .share-container {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .share-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 1rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;
  }

  .share-button:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  .share-button.active {
    background: var(--primary-dark);
  }

  .share-menu {
    position: fixed;
    top: auto;
    right: auto;
    margin-top: 0.5rem;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    min-width: 200px;
    overflow: hidden;
  }

  .share-options {
    display: flex;
    flex-direction: column;
  }

  .share-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text-color);
    transition: background-color 0.2s ease;
    text-align: left;
    width: 100%;
  }

  .share-option:hover {
    background: var(--light-gray);
  }

  .share-option.success {
    background: var(--success-light);
    color: var(--success);
  }

  .share-option svg {
    flex-shrink: 0;
  }

  .share-option img {
    border-radius: 20%;
  }

  .share-option span {
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .share-menu {
      right: -1rem;
      left: -1rem;
      min-width: auto;
    }
  }
</style>
