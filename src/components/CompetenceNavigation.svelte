<!-- Navigation fixe pour les compétences (SVELTE 5) -->

<script lang="ts">
  interface NavItem {
    id: string;
    label: string;
    icon: string;
  }

  // État local réactif avec $state
  let activeItem = $state('content-Sécurité');
  let opened = $state(true);

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
      id: 'content-Enseignement',
      label: 'Enseignement',
      icon: '📚'
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
      id: 'content-Sport',
      label: 'Sport',
      icon: '⚽'
    },
    {
      id: 'content-Action Culturelle',
      label: 'Action Culturelle',
      icon: '🎭'
    },
    {
      id: 'content-Tourisme',
      label: 'Tourisme',
      icon: '🏖️'
    },
    {
      id: 'content-Interventions dans le domaine économique',
      label: 'Interventions dans le domaine économique',
      icon: '💰'
    },
 
    {
      id: 'content-Politique de la Ville',
      label: 'Politique de la Ville',
      icon: '🏘️'
    },

    {
      id: 'content-Urbanisme et aménagement de l’espace',
      label: 'Urbanisme et aménagement de l’espace',
      icon: '🗺️'
    },
    {
      id: 'content-Aménagement du territoire et développement rural',
      label: 'Aménagement du territoire et développement rural',
      icon: '🌳'
    },
    {
      id: 'content-Logement et Habitat',
      label: 'Logement et Habitat',
      icon: '🏠'
    },
    {
      id: 'content-Environnement et Patrimoine',
      label: 'Environnement et Patrimoine',
      icon: '🌳'
    },
    {
      id: 'content-Déchets',
      label: 'Déchets',
      icon: '🚮'
    },
    {
      id: 'content-Eau et assainissement',
      label: 'Eau et assainissement',
      icon: '💧'
    },
    {
      id: 'content-Réseaux câblés et télécommunications',
      label: 'Réseaux câblés et télécommunications',
      icon: '📡'
    },
    {
      id: 'content-Énergie',
      label: 'Énergie',
      icon: '🔌'
    },
    {
      id: 'content-Ports, voies d’eau et liaisons maritimes',
      label: 'Ports, voies d’eau et liaisons maritimes',
      icon: '🚢'
    },
    {
      id: 'content-Transports scolaires',
      label: 'Transports scolaires',
      icon: '🚢'
    },
    {
      id: 'content-Transports publics',
      label: 'Transports publics',
      icon: '🚌'
    },
    {
      id: 'content-Voirie',
      label: 'Voirie',
      icon: '🚗'
    },
    {
      id: 'content-Funéraire',
      label: 'Funéraire',
      icon: '💀'
    },
    


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

  function toggleOpen() { opened = !opened; }

  // Breakpoint: initialisation simple + bascule uniquement au franchissement du seuil
  $effect(() => {
    if (typeof window === 'undefined') return;
    let lastIsDesktop = window.innerWidth >= 1200;
    opened = lastIsDesktop;

    const onResize = () => {
      const nowDesktop = window.innerWidth >= 1200;
      if (nowDesktop !== lastIsDesktop) {
        opened = nowDesktop;
        lastIsDesktop = nowDesktop;
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  


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

<aside class="sidebar competence-navigation" class:open={opened}>
  <header class="sidebar-header">
    <h2>Compétences</h2>
  </header>
  <div class="sidebar-body">
    <ul class="nav-list">
      {#each navItems as item}
        <li class="nav-item">
          <button 
            class="nav-link"
            class:active={activeItem === item.id}
            aria-current={activeItem === item.id ? 'location' : undefined}
            onclick={() => selectItem(item.id)}
          >
            <span class="nav-icon">{item.icon}</span>
            <span class="nav-label">{item.label}</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
</aside>

<button class="competence-menu-fab" onclick={toggleOpen} aria-label={opened ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={opened}>{opened ? 'Fermer' : 'Menu'}</button>

<style>
  /* Wrapper sidebar (aligné sur SidebarMap) */
  .sidebar {
    background: #fff;
    overflow: hidden;
    height: calc(100vh - 110px);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 90px;
    max-width: 500px;
    border-radius: 1rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(46, 139, 87, 0.1);
    backdrop-filter: blur(10px);
    overflow-y: auto;
    flex: 0 0 500px; /* réserve l'espace côté contenu (desktop) */
    z-index: 999;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem .75rem;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .sidebar-header h2 { font-size: 1rem; margin: 0; }
  /* Plus de bouton de fermeture en en-tête mobile */

  .sidebar-body { padding: .75rem; overflow:auto; }

  /* Bouton flottant (mobile < 1200px) */
  .competence-menu-fab {
    position: fixed;
    right: 20px;
    bottom: 20px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: .6rem 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    cursor: pointer;
    display: none; /* visible via media query */
    z-index: 1001;
  }

  /* Ancien open-button supprimé */

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

  /* Suppression de l'indicateur animé pour alléger le CSS */

  .nav-label {
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    flex: 1;
    line-height: 1.2;
  }

  /* Responsive < 1200px : sidebar cachée, bouton Menu visible */
  @media (max-width: 1199px) {
    .sidebar {
      position: fixed;
      left: 1rem;
      right: 1rem;
      top: 0.75rem;
      height: auto;
      max-height: 60vh;
      display: none; /* cachée par défaut en mobile */
      flex: none; /* overlay, pas de réserve d'espace */
      width: auto;
      max-width: none;
      z-index: 1002;
    }
    /* En Svelte, la classe dynamique `open` n'est pas scopée → marquer .open en global */
    .competence-navigation:global(.open) { display: block !important; }

    .competence-menu-fab { display: inline-flex; align-items: center; gap:.4rem; }
  }
</style>
