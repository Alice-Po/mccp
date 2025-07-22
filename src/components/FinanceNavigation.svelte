<!-- Navigation fixe pour les finances (SVELTE 5) -->

<script lang="ts">
  interface NavItem {
    id: string;
    label: string;
  }

  // État local réactif avec $state
  let activeItem = $state('section-fonctionnement');

  // Navigation items (constante, pas besoin de rune)
  const navItems: NavItem[] = [
    {
      id: 'section-budget-fonctionnement',
      label: 'Budget fonctionnement'
    },
    {
      id: 'section-comparaison-fonctionnement',
      label: 'Comparaison fonctionnement'
    },
    {
      id: 'section-budget-investissement',
      label: 'Budget investissement'
    },
    {
      id: 'section-comparaison-investissement',
      label: 'Comparaison investissement'
    }
  ];

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
    padding: 0.5rem 1rem;
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
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    flex: 1;
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