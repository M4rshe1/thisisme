/**
 * About section configuration.
 * Translations: messages/{locale}.ts -> about
 *   - about.title, about.jobTitle, about.location
 *   - about.learning, about.interests, about.languages
 *   - about.description, about.downloadResume
 *   - about.keys.* (labels for the JSON display)
 */

export interface AboutConfig {
  birthday: string;
  image: string;
  resumePath: string;
}

export const ABOUT: AboutConfig = {
  birthday: "2007-01-22",
  image: "/images/me.jpg",
  resumePath: "/resume.pdf",
};
