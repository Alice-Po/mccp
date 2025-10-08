<script lang="ts">
  import ShareButtons from "./ShareButtons.svelte";

  export let title: string;
  export let url: string;
  export let description: string = "";
</script>

<div class="article-share-card">
  <div class="share-card-content">
   
    <div class="share-card-text">
      <h3>Vous avez apprécié ce contenu ?</h3>
      <p>Partagez-le à vos proches</p>
    </div>
    
    <div class="share-card-action">
      <ShareButtons 
        {title}
        {url}
        {description}
      />
    </div>
  </div>
</div>

<style>
  .article-share-card {
    margin: 3rem 0;
    padding: 2rem;
    background: var(--primary);
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: visible;
  }

  .share-card-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    z-index: 1;
  }

  

  .share-card-text {
    flex-grow: 1;
    color: white;
  }

  .share-card-text h3 {
    margin: 0 0 0.4rem 0;
    font-size: 1.6rem;
    font-weight: 700;
    font-family: var(--font-main);
    letter-spacing: 0.2px;
    color: var(--white);
  }

  .share-card-text p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
    font-weight: 500;
    color: var(--white);
  }

  .share-card-action {
    flex-shrink: 0;
    min-width: 200px;
  }

  /* Amélioration CTA (scopé localement au composant) */
  .share-card-action :global(.share-button) {
    width: auto;
    padding: 0.6rem 1.25rem;
    font-size: 1rem;
    background: var(--white);
    color: var(--primary);
    border: 0;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
    backdrop-filter: saturate(120%);
  }

  .share-card-action :global(.share-button:hover) {
    transform: translateY(-2px);
    filter: brightness(0.95);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .article-share-card {
      margin: 2rem 0;
      padding: 1.5rem;
    }

    .share-card-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    

    .share-card-text h3 {
      font-size: 1.2rem;
    }

    .share-card-action {
      min-width: auto;
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .article-share-card {
      padding: 1rem;
    }

    .share-card-content {
      gap: 0.8rem;
    }

    

    .share-card-text h3 {
      font-size: 1.1rem;
    }

    .share-card-text p {
      font-size: 0.9rem;
    }
  }
</style>

