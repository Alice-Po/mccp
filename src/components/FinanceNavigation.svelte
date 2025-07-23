<!-- Navigation fixe pour les finances (SVELTE 5) -->

<script lang="ts">
  interface NavItem {
    id: string;
    label: string;
    type: 'donut' | 'bar' | 'table' | 'indicator';
  }

  // État local réactif avec $state
  let activeItem = $state('section-fonctionnement');

  // Navigation items avec types d'icônes
  const navItems: NavItem[] = [
    {
      id: 'section-budget-fonctionnement',
      label: 'Budget fonctionnement',
      type: 'donut'
    },
    {
      id: 'section-comparaison-fonctionnement',
      label: 'Comparaison fonctionnement',
      type: 'bar'
    },
    {
      id: 'section-budget-investissement',
      label: 'Budget investissement',
      type: 'donut'
    },
    {
      id: 'section-comparaison-investissement',
      label: 'Comparaison investissement',
      type: 'bar'
    },
    {
      id: 'section-fiscalite',
      label: 'Fiscalité locale',
      type: 'table'
    },
    {
      id: 'section-indicateurs-financiers',
      label: 'Indicateurs financiers',
      type: 'indicator'
    }
  ];

  // Fonction pour obtenir l'icône SVG selon le type
  function getIcon(type: 'donut' | 'bar' | 'table'): string {
    if (type === 'donut') {
      // Icône donut/camembert
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 13.3132 21.7413 14.6136 21.2388 15.8268C20.7362 17.0401 19.9997 18.1425 19.0711 19.0711C18.1425 19.9997 17.0401 20.7362 15.8268 21.2388C14.6136 21.7413 13.3132 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C4.00035 18.1425 3.26375 17.0401 2.7612 15.8268C2.25866 14.6136 2 13.3132 2 12C2 10.6868 2.25866 9.38642 2.7612 8.17317C3.26375 6.95991 4.00035 5.85752 4.92893 4.92893C5.85752 4.00035 6.95991 3.26375 8.17317 2.7612C9.38642 2.25866 10.6868 2 12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2V12L19.0711 4.92893" stroke="currentColor" stroke-width="2" fill="rgba(46, 139, 87, 0.3)"/>
        </svg>
      `;
    } else if (type === 'bar') {
      // Icône graphique en barres
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.7"/>
          <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor" opacity="0.8"/>
          <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor"/>
          <line x1="2" y1="22" x2="22" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="2" y1="22" x2="2" y2="2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    } else if (type === 'indicator') {
      // Icône graphique en barres
      return `
        <svg class="analysis-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
      `;
    } else {
      // Icône tableau/liste
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor"/>
          <circle cx="6" cy="7" r="1" fill="currentColor"/>
          <circle cx="6" cy="12" r="1" fill="currentColor"/>
          <circle cx="6" cy="17" r="1" fill="currentColor"/>
        </svg>
      `;
    }
  }
  

  // Actions
  function selectItem(itemId: string) {
    activeItem = itemId;
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

<nav class="finance-navigation">
  <div class="nav-header">
    <h3>Navigation Finances</h3>
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
            {@html getIcon(item.type)}
          </span>
          <span class="nav-label">{item.label}</span>
        </button>
      </li>
    {/each}
  </ul>
  
  <div class="nav-footer">
    <div class="nav-indicator">
      <div class="indicator-dot"></div>
      <span class="indicator-text">Section active</span>
    </div>
  </div>
</nav>

<style>
  .finance-navigation {
    position: sticky;
    top: 120px;
    width: 320px;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(46, 139, 87, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    font-family: var(--font-main);
    height: fit-content;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .nav-header {
    padding: 1rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 1rem 1rem 0 0;
  }

  .nav-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
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
    color: var(--primary);
    transition: all 0.3s ease;
  }

  :global(.nav-link.active .nav-icon) {
    color: var(--primary);
    transform: scale(1.1);
  }

  .nav-link:hover .nav-icon {
    transform: scale(1.05);
    color: var(--primary-dark);
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

  .nav-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(46, 139, 87, 0.1);
  }

  .nav-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--gray);
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
    background-color: var(--primary);
    border-radius: 50%;
    animation: blink 1.5s infinite;
    box-shadow: 0 0 0 2px rgba(46, 139, 87, 0.2);
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }

  /* Responsive design */
  @media (max-width: 1400px) {
    .finance-navigation {
      width: 280px;
    }
  }

  @media (max-width: 1200px) {
    .finance-navigation {
      width: 260px;
    }
  }
</style> 