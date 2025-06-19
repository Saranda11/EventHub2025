// Allowed university domains
const ALLOWED_DOMAINS = [
  "umib.net", // University of Mitrovica "Isa Boletini"
  "uni-pr.edu", // University of Pristina
  "uni-pr.edu.usitestat.com", // University of Pristina (additional domain)
  "pr.ac.rs", // University of Priština (North Mitrovica)
  "uni-prizren.com", // University of Prizren "Ukshin Hoti"
  "uni-gjk.org", // University of Gjakova "Fehmi Agani"
  "ushaf.net", // University of Applied Sciences in Ferizaj
];

/**
 * Validates if an email domain is from an allowed university
 * @param email - The email address to validate
 * @returns boolean - true if domain is allowed, false otherwise
 */
export function isValidUniversityDomain(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailLower = email.toLowerCase();
  const domain = emailLower.split("@")[1];

  if (!domain) {
    return false;
  }

  return ALLOWED_DOMAINS.includes(domain);
}

/**
 * Gets the list of allowed domains for display purposes
 * @returns string[] - Array of allowed domains
 */
export function getAllowedDomains(): string[] {
  return [...ALLOWED_DOMAINS];
}
