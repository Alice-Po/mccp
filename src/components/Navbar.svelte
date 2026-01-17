<script>
  import { onMount } from 'svelte';

  export let currentPath = '/';

  // Définir les liens de navigation
  const navLinks = [
    { href: "/", text: "Accueil" },
    { href: "/blog", text: "Actualités" },
    { href: "/retroplanning", text: "Rétro-planning" },
    { href: "/conseils-municipaux", text: "Conseils Municipaux" },
    { href: "/finances", text: "Finances" },
    { href: "/cartes", text: "Cartes" },
    // {
    //   text: "Suivis Municipal",
    //   dropdown: [
    //     { href: "/finances", text: "Finances" },
    //     { href: "/conseils-municipaux", text: "Conseils Municipaux" }
    //   ]
    // }
  ];

  let mobileMenuOpen = false;
  let activeDropdown = null;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  function toggleDropdown(index) {
    activeDropdown = activeDropdown === index ? null : index;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    document.body.classList.remove('menu-open');
    activeDropdown = null;
  }

  // Fermer les menus lors du clic à l'extérieur
  onMount(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.main-nav')) {
        activeDropdown = null;
      }
    }

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function isActivePath(href) {
    return currentPath === href;
  }

  function isActiveDropdown(dropdown) {
    return dropdown.some(item => currentPath === item.href);
  }
</script>

<header class="site-header">
  <div class="container">
    <div class="logo">
      <a href="/">
        <img src="/assets/img/logo/logo.png" alt="MCCP Putanges-le-Lac" />
      </a>
    </div>
    
    <nav class="main-nav">
      <button 
        class="mobile-menu-toggle" 
        class:open={mobileMenuOpen}
        aria-label="Menu"
        on:click={toggleMobileMenu}
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      
      <ul class="nav-links" class:open={mobileMenuOpen}>
        {#each navLinks as link, index}
          <li class:has-dropdown={link.dropdown}>
            {#if link.dropdown}
              <a 
                href="#" 
                class:active={isActiveDropdown(link.dropdown)}
                on:click|preventDefault={() => toggleDropdown(index)}
                aria-expanded={activeDropdown === index}
              >
                {link.text}
                <span class="dropdown-arrow">▼</span>
              </a>
              
              {#if activeDropdown === index}
                <ul class="dropdown-menu">
                  {#each link.dropdown as subLink}
                    <li>
                      <a 
                        href={subLink.href} 
                        class:active={isActivePath(subLink.href)}
                        on:click={closeMobileMenu}
                      >
                        {subLink.text}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            {:else}
              <a 
                href={link.href} 
                class:active={isActivePath(link.href)}
                on:click={closeMobileMenu}
              >
                {link.text}
              </a>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

<style>
  /* Logo styles */
  .logo img {
    height: 50px;
    width: auto;
    display: block;
    transition: opacity 0.3s ease;
  }
  
  .logo a {
    display: flex;
    align-items: center;
  }
  
  .logo img:hover {
    opacity: 0.85;
  }
  
  @media (max-width: 768px) {
    .logo img {
      height: 40px;
    }
  }
  
  /* Styles spécifiques au dropdown uniquement */
  li.has-dropdown {
    position: relative;
  }

  .dropdown-arrow {
    font-size: 0.7rem;
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  li.has-dropdown a[aria-expanded="true"] .dropdown-arrow {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    list-style: none;
    margin: 0.5rem 0 0 0;
    padding: 0.5rem 0;
    z-index: 1001;
  }

  .dropdown-menu li {
    margin: 0;
  }

  .dropdown-menu a {
    display: block;
    padding: 0.8rem 1.2rem;
    color: var(--secondary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .dropdown-menu a:hover,
  .dropdown-menu a.active {
    background: #f8f9fa;
    color: var(--primary-dark);
  }

  /* Mobile styles pour le dropdown */
  @media (max-width: 768px) {
    .dropdown-menu {
      position: static;
      box-shadow: none;
      margin: 0;
      border-radius: 0;
    }

    .dropdown-menu a {
      color: var(--primary);
      padding-left: 2.5rem;
    }

    .dropdown-menu a:hover,
    .dropdown-menu a.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
  }
</style> 