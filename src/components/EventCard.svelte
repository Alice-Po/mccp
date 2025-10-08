<script lang="ts">
  import { formatTimeRange } from "../utils/time-formatting";

  export let event: any;
  export let icsDataUrl: string | null = null;

  let downloadsOpen = false;

  function toGCalDate(date: Date, time?: string) {
    const d = new Date(date);
    let hours = 0;
    let minutes = 0;
    if (time && time.includes("-")) {
      const [h, m] = time.split("-");
      hours = parseInt(h, 10) || 0;
      minutes = parseInt(m, 10) || 0;
    }
    d.setHours(hours, minutes, 0, 0);
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function buildGoogleCalendarUrl() {
    const start = toGCalDate(event.data.date, event.data.start);
    const end = event.data.end ? toGCalDate(event.data.date, event.data.end) : undefined;
    const dates = end ? `${start}/${end}` : start;
    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
      text: event.data.title,
      dates,
      details: event.data.description || "",
      location: event.data.place || "",
    });
    return `${base}&${params.toString()}`;
  }

  function buildOutlookUrl() {
    const start = toGCalDate(event.data.date, event.data.start);
    const end = event.data.end ? toGCalDate(event.data.date, event.data.end) : undefined;
    const base = "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent";
    const params = new URLSearchParams({
      subject: event.data.title,
      startdt: start,
      enddt: end || start,
      body: event.data.description || "",
      location: event.data.place || "",
    });
    return `${base}&${params.toString()}`;
  }
</script>

<article class="event-card">
  <div class="event-date-header">
    <svg class="date-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <time datetime={event.data.date.toISOString()}>
      {event.data.date.toLocaleDateString('fr-FR')}
    </time>
  </div>
  <div class="event-content">
    <h3>{event.data.title}</h3>
    <div class="event-meta">
      {#if event.data.start}
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

    {#if event.data.vcalendar}
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

    {#if event.data.flyers || event.data.image}
      <div class="event-downloads">
        <button class="download-toggle" on:click={() => (downloadsOpen = !downloadsOpen)} class:active={downloadsOpen}>
          <h4>Télécharger le flyer</h4>
          <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="download-content" style={`max-height: ${downloadsOpen ? '200px' : '0'}` }>
          <div class="download-buttons">
            {#if event.data.flyers}
              <a href={event.data.flyers} target="_blank" rel="noopener noreferrer" class="download-link">
                <svg class="download-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>PDF</span>
              </a>
            {/if}
            {#if event.data.image}
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
