<script lang="ts">
  import { formatTimeRange } from "../utils/time-formatting";
  import ShareButtons from "./ShareButtons.svelte";

  export let event: any;
  export let icsDataUrl: string | null = null;

  let downloadsOpen = false;

  // Utilitaires pour les URLs de calendrier
  function toGCalDate(date: Date, time?: string | null): string {
    const d = new Date(date);
    let hours = 0;
    let minutes = 0;
    
    if (time && time.trim() && time.includes("-")) {
      const [h, m] = time.split("-");
      hours = parseInt(h, 10) || 0;
      minutes = parseInt(m, 10) || 0;
    }
    
    d.setHours(hours, minutes, 0, 0);
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function buildGoogleCalendarUrl(): string {
    const start = toGCalDate(event.data.date, event.data.start);
    const end = event.data.end ? toGCalDate(event.data.date, event.data.end) : undefined;
    const dates = end ? `${start}/${end}` : start;
    
    const params = new URLSearchParams({
      text: event.data.title,
      dates,
      details: event.data.description || "",
      location: event.data.place || "",
    });
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  }

  function buildOutlookUrl(): string {
    const start = toGCalDate(event.data.date, event.data.start);
    const end = event.data.end ? toGCalDate(event.data.date, event.data.end) : undefined;
    
    const params = new URLSearchParams({
      subject: event.data.title,
      startdt: start,
      enddt: end || start,
      body: event.data.description || "",
      location: event.data.place || "",
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&${params.toString()}`;
  }

  // Calcul du temps relatif
  function getRelativeTime(eventDate: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays === -1) return "Hier";
    
    if (diffDays > 0) {
      if (diffDays < 7) {
        return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        return remainingDays === 0 
          ? `Dans ${weeks} semaine${weeks > 1 ? 's' : ''}`
          : `Dans ${weeks} semaine${weeks > 1 ? 's' : ''} et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
      } else {
        const months = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;
        return remainingDays === 0 
          ? `Dans ${months} mois`
          : `Dans ${months} mois et ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`;
      }
    } else {
      const absDays = Math.abs(diffDays);
      if (absDays < 7) {
        return `Il y a ${absDays} jour${absDays > 1 ? 's' : ''}`;
      } else if (absDays < 30) {
        const weeks = Math.floor(absDays / 7);
        return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
      } else {
        const months = Math.floor(absDays / 30);
        return `Il y a ${months} mois`;
      }
    }
  }

  // Vérifications pour les champs optionnels
  const hasTime = event.data.start && event.data.start.trim();
  const hasCalendar = event.data.vcalendar && event.data.vcalendar !== null && event.data.vcalendar.trim();
  const hasFlyers = event.data.flyers && event.data.flyers !== null && event.data.flyers.trim();
  const hasImage = event.data.image && event.data.image !== null && event.data.image.trim();
  const hasDownloads = hasFlyers || hasImage;
</script>

<article class="event-card">
  <!-- En-tête avec date -->
  <div class="event-date-header">
    <svg class="date-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="date-info">
      <time datetime={event.data.date.toISOString()}>
        {event.data.date.toLocaleDateString('fr-FR')}
      </time>
      <span class="relative-time">{getRelativeTime(event.data.date)}</span>
    </div>
  </div>

  <!-- Contenu principal -->
  <div class="event-content">
    <h3>{event.data.title}</h3>
    
    <!-- Métadonnées (heure et lieu) -->
    <div class="event-meta">
      {#if hasTime}
        <div class="meta-item">
          <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="event-time">{formatTimeRange(event.data.start, event.data.end)}</span>
        </div>
      {/if}
      
      <div class="meta-item">
        <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
        </svg>
        <p class="event-place">{event.data.place}</p>
      </div>
    </div>
    
    <p class="description">{event.data.description}</p>

    <!-- Bouton de partage -->
    <div class="event-share">
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title={event.data.title}
        description={event.data.description}
      />
    </div>

    <!-- Boutons d'ajout au calendrier -->
    {#if hasCalendar}
      <div class="event-downloads">
        <h4>Ajouter à votre calendrier</h4>
        <div class="download-buttons">
          <a href={buildGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" class="provider-btn gmail">
            <img src="/assets/img/logo/gagenda-icon.png" alt="Google Agenda" width="18" height="18" />
            <span>Google Agenda</span>
          </a>
          <a href={buildOutlookUrl()} target="_blank" rel="noopener noreferrer" class="provider-btn outlook">
            <img src="/assets/img/logo/outlook-icon.png" alt="Outlook" width="18" height="18" />
            <span>Outlook</span>
          </a>
          {#if icsDataUrl}
            <a href={icsDataUrl} class="provider-btn download">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>ICS</span>
            </a>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Accordion pour les téléchargements de flyers -->
    {#if hasDownloads}
      <div class="event-downloads">
        <button class="download-toggle" on:click={() => (downloadsOpen = !downloadsOpen)} class:active={downloadsOpen}>
          <h4>Télécharger le flyer</h4>
          <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="download-content" style={`max-height: ${downloadsOpen ? '200px' : '0'}`}>
          <div class="download-buttons">
            {#if hasFlyers}
              <a href={event.data.flyers} target="_blank" rel="noopener noreferrer" class="download-link">
                <svg class="download-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>PDF</span>
              </a>
            {/if}
            {#if hasImage}
              <a href={event.data.image} target="_blank" rel="noopener noreferrer" class="download-link">
                <svg class="download-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Image</span>
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</article>