/**
 * Utilitaires pour le formatage des heures et plages horaires
 */

/**
 * Formate une heure au format français
 * @param timeString - Heure au format "HH-MM" (ex: "09-30")
 * @returns Heure formatée en français (ex: "9h30")
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split('-');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  if (minute === 0) {
    return `${hour}h`;
  } else {
    return `${hour}h${minute.toString().padStart(2, '0')}`;
  }
}

/**
 * Formate une plage horaire au format français
 * @param start - Heure de début au format "HH-MM"
 * @param end - Heure de fin au format "HH-MM" (optionnel)
 * @returns Plage horaire formatée en français
 */
export function formatTimeRange(start: string, end?: string): string {
  const startFormatted = formatTime(start);

  if (!end) {
    return `À partir de ${startFormatted}`;
  }

  const endFormatted = formatTime(end);
  return `De ${startFormatted} à ${endFormatted}`;
}



