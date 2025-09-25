<!--
  =============================================================================
  COMPOSANT: ARROW ICON - ICÔNE DE FLÈCHE RÉUTILISABLE
  =============================================================================
  
  Composant SVG réutilisable pour afficher une flèche simple
  Utilisé dans les titres et sections pour indiquer une direction ou un pointage
-->

<script lang="ts">
  interface Props {
    color?: string;
    size?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  }

  let { 
    color = '#2e8b57',
    size = 16,
    direction = 'right'
  }: Props = $props();

  // Calcul des transformations selon la direction
  const getTransform = (dir: string) => {
    switch (dir) {
      case 'up': return 'rotate(-90deg)';
      case 'down': return 'rotate(90deg)';
      case 'left': return 'rotate(180deg)';
      case 'right': 
      default: return 'rotate(0deg)';
    }
  };
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  style="transform: {getTransform(direction)}; transform-origin: center; transition: transform .18s ease;"
>
  <path 
    d="M9 18L15 12L9 6" 
    stroke={color} 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  />
</svg>
