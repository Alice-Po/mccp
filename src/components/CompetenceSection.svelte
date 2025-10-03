<script>
  import { createEventDispatcher } from 'svelte';
  
  let { title, children, isOpen = false } = $props();
  
  const dispatch = createEventDispatcher();
  
  function toggle() {
    dispatch('toggle', { title, isOpen: !isOpen });
  }
  
  // Gérer l'accordion du texte de référence
  function handleReferenceToggle(event) {
    const button = event.target.closest('.reference-header');
    if (button) {
      const content = document.getElementById('reference-content');
      const icon = button.querySelector('.toggle-icon');
      
      if (content && icon) {
        const currentDisplay = content.style.display;
        if (currentDisplay === 'none' || currentDisplay === '') {
          content.style.display = 'block';
          icon.style.transform = 'rotate(180deg)';
        } else {
          content.style.display = 'none';
          icon.style.transform = 'rotate(0deg)';
        }
      }
    }
  }
</script>

<div class="competence-section" id="content-{title}">
  <button 
    class="competence-header" 
    class:open={isOpen}
    onclick={toggle}
    aria-expanded={isOpen}
    aria-controls="content-{title}"
  >
    <h3>{title}</h3>
    <svg 
      class="toggle-icon" 
      style="transform: {isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}"
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
  
  {#if isOpen}
    <div class="competence-content" onclick={handleReferenceToggle} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && handleReferenceToggle(e)}>
      <div class="competence-inner">
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>

<style>
  .competence-section {
    border: 1px solid #eaeaea;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .competence-header {
    width: 100%;
    padding: 1.5rem;
    background: white;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    transition: all 0.2s ease;
    position: relative;
    border-bottom: 1px solid #eaeaea;
  }
  
  .competence-header:hover {
    background-color: rgba(46, 139, 87, 0.05);
  }
  
  .competence-header h3 {
    margin: 0;
    font-size: 1.4rem;
    color: var(--secondary);
    font-family: var(--font-main);
    font-weight: 600;
  }
  
  .toggle-icon {
    color: var(--primary);
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  
  .competence-content {
    overflow: hidden;
    transition: all 0.3s ease;
    border-top: 1px solid #eaeaea;
  }
  
  .competence-inner {
    padding: 1.5rem;
    color: var(--secondary);
    line-height: 1.6;
  }
  
  .competence-inner :global(h4) {
    font-size: 1.2rem;
    color: var(--primary);
    margin: 1.5rem 0 0.8rem 0;
    font-family: var(--font-main);
    font-weight: 600;
  }
  
  .competence-inner :global(h4:first-child) {
    margin-top: 0;
  }
  
  .competence-inner :global(h5) {
    font-size: 1.1rem;
    color: var(--secondary);
    margin: 1.2rem 0 0.6rem 0;
    font-family: var(--font-main);
    font-weight: 500;
  }
  
  .competence-inner :global(p) {
    margin: 0.8rem 0;
    font-size: 1rem;
  }
  
  .competence-inner :global(.example) {
    background: rgba(46, 139, 87, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    border-left: 4px solid var(--primary);
    font-style: italic;
  }
  
  .competence-inner :global(.example::before) {
    content: "💡 ";
    font-style: normal;
  }
  
  @media (max-width: 768px) {
    .competence-header {
      padding: 1rem;
    }
    
    .competence-header h3 {
      font-size: 1.2rem;
    }
    
    .competence-inner {
      padding: 1rem;
    }
    
    .competence-inner :global(h4) {
      font-size: 1.1rem;
    }
    
    .competence-inner :global(h5) {
      font-size: 1rem;
    }
  }
</style>

