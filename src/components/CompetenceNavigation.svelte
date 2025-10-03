<!-- Navigation fixe pour les compétences (SVELTE 5) -->

<script lang="ts">
  interface NavItem {
    id: string;
    label: string;
    icon: string;
  }

  // État local réactif avec $state
  let activeItem = $state('content-Sécurité');
  let isOpen = $state(true);

  // Navigation items avec icônes
  const navItems: NavItem[] = [
    {
      id: 'content-Sécurité',
      label: 'Sécurité',
      icon: '🛡️'
    },
    {
      id: 'content-Action Sociale et Santé',
      label: 'Action Sociale et Santé',
      icon: '🏥'
    },
    {
      id: 'content-Emploi et Insertion',
      label: 'Emploi et Insertion',
      icon: '💼'
    },
    {
      id: 'content-Enfance et Jeunesse',
      label: 'Enfance et Jeunesse',
      icon: '👶'
    },
    {
      id: 'content-Urbanisme et Aménagement',
      label: 'Urbanisme et Aménagement',
      icon: '🏗️'
    },
    {
      id: 'content-Enseignement',
      label: 'Enseignement',
      icon: '📚'
    },
    {
      id: 'content-Tourisme',
      label: 'Tourisme',
      icon: '🏖️'
    },
    {
      id: 'content-Action Culturelle',
      label: 'Action Culturelle',
      icon: '🎭'
    },
    {
      id: 'content-Politique de la Ville',
      label: 'Politique de la Ville',
      icon: '🏘️'
    },
    {
      id: 'content-Sport',
      label: 'Sport',
      icon: '⚽'
    },
    {
      id: 'content-Aménagement du Territoire',
      label: 'Aménagement du Territoire',
      icon: '🗺️'
    },
    {
      id: 'content-Environnement et Patrimoine',
      label: 'Environnement et Patrimoine',
      icon: '🌳'
    },
    {
      id: 'content-Logement et Habitat',
      label: 'Logement et Habitat',
      icon: '🏠'
    }
  ];

  // Actions
  function selectItem(itemId: string) {
    activeItem = itemId;
    const element = document.getElementById(itemId);
    if (element) {
      // Ouvrir la section si elle est fermée
      const button = element.querySelector('.competence-header') as HTMLButtonElement;
      if (button && button.getAttribute('aria-expanded') === 'false') {
        button.click();
      }
      // Attendre un peu que la section s'ouvre puis scroller
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function toggleNavigation() {
    isOpen = !isOpen;
  }

  // Effet pour gérer l'Intersection Observer (section la plus proche du centre du viewport)
  $effect(() => {
    if (typeof document === 'undefined') return;

    const sectionIds = navItems.map(item => item.id);
    const sectionElements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (sectionElements.length === 0) return;

    function updateActiveSection() {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let minDistance = Infinity;
      let closestSectionId = activeItem;
      for (const el of sectionElements) {
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + window.scrollY + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestSectionId = el.id;
        }
      }
      if (closestSectionId !== activeItem) {
        activeItem = closestSectionId;
      }
    }

    // Mettre à jour lors du scroll et du resize
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    // Appel initial
    updateActiveSection();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  });
</script>

<nav class="competence-navigation" class:closed={!isOpen}>
  <div class="nav-header">
    <h3>Compétences</h3>
    <button class="close-button" onclick={toggleNavigation} aria-label="Fermer la navigation">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
  
  <ul class="nav-list">
    {#each navItems as item}
      <li class="nav-item">
        <button 
          class="nav-link"
          class:active={activeItem === item.id}
          aria-current={activeItem === item.id ? 'location' : undefined}
          onclick={() => selectItem(item.id)}
        >
          <span class="nav-icon">
            {item.icon}
          </span>
          <span class="nav-label">{item.label}</span>
        </button>
      </li>
    {/each}
  </ul>
  
  {#if !isOpen}
    <button class="open-button" onclick={toggleNavigation} aria-label="Ouvrir la navigation">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  {/if}
</nav>

<style>
  .competence-navigation {
    position: sticky;
    top: 90px;
    width: 320px;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(46, 139, 87, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    font-family: var(--font-main);
    height: fit-content;
    max-height: calc(100vh - 110px);
    overflow-y: auto;
    flex-shrink: 0;
    z-index: 999;
  }

  .competence-navigation.closed {
    width: 0;
    opacity: 0;
    pointer-events: none;
  }

  .nav-header {
    padding: 1rem;
    background: var(--primary);
    border-radius: 1rem 1rem 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
  }

  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .open-button {
    position: absolute;
    top: 20px;
    left: 20px;
    background: var(--primary);
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    z-index: 1001;
  }

  .open-button:hover {
    background: var(--primary-dark);
    transform: scale(1.05);
  }

  .nav-list {
    list-style: none;
    padding: 0.5rem 0;
    margin: 0;
  }

  .nav-item {
    margin-bottom: 0.5rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    border-left: 3px solid transparent;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary);
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
    transition: all 0.3s ease;
  }

  :global(.nav-link.active .nav-icon) {
    transform: scale(1.1);
  }

  .nav-link:hover .nav-icon {
    transform: scale(1.05);
  }

  .nav-link:hover {
    background-color: rgba(46, 139, 87, 0.05);
    border-left-color: var(--primary);
  }

  :global(.nav-link.active) {
    background-color: rgba(46, 139, 87, 0.15);
    color: var(--primary);
    border-left-color: var(--primary);
    border-left-width: 4px;
    font-weight: 700;
    box-shadow: 0 2px 12px rgba(46, 139, 87, 0.2);
  }

  :global(.nav-link.active::after) {
    content: '●';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--primary);
    animation: softPulse 2.5s ease-in-out infinite;
    filter: drop-shadow(0 0 3px rgba(46, 139, 87, 0.6));
  }

  @keyframes softPulse {
    0% {
      opacity: 0.6;
      transform: translateY(-50%) scale(0.8);
      filter: drop-shadow(0 0 2px rgba(46, 139, 87, 0.4));
    }
    50% {
      opacity: 1;
      transform: translateY(-50%) scale(1.1);
      filter: drop-shadow(0 0 6px rgba(46, 139, 87, 0.8));
    }
    100% {
      opacity: 0.6;
      transform: translateY(-50%) scale(0.8);
      filter: drop-shadow(0 0 2px rgba(46, 139, 87, 0.4));
    }
  }

  .nav-label {
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    flex: 1;
    line-height: 1.2;
  }

  /* Responsive design */
  @media (max-width: 1400px) {
    .competence-navigation {
      width: 280px;
    }
  }

  @media (max-width: 1200px) {
    .competence-navigation {
      width: 260px;
    }
  }

  @media (max-width: 768px) {
    .competence-navigation {
      position: fixed;
      top: auto;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      z-index: 1000;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .competence-navigation:hover {
      width: 280px;
      height: auto;
      border-radius: 1rem;
    }

    .nav-header {
      display: none;
    }

    .nav-list {
      padding: 0;
    }

    .nav-item {
      margin-bottom: 0;
    }

    .nav-link {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .nav-label {
      display: none;
    }

    .competence-navigation:hover .nav-label {
      display: block;
    }

    .competence-navigation:hover .nav-link {
      padding: 0.75rem 1rem;
    }
  }
</style>
