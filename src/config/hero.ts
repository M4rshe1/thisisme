/**
 * Hero section configuration.
 * Translations: messages/{locale}.ts -> hero
 *   - hero.title, hero.welcome, hero.bio, hero.linkText, hero.description
 *
 * Rotary item translations: hero.items.{id}
 *   - hero.items.{id}.title
 *   - hero.items.{id}.linkText
 *   - hero.items.{id}.summary
 */

export interface HeroConfig {
  image: string;
  link: string;
}

export interface HeroRotaryConfig {
  id: string;
  link?: string;
  image: string;
  publishedAt: string;
  newPage?: boolean;
}

export const HERO: HeroConfig = {
  image: "/images/nordkapp.jpg",
  link: "/#readmore",
};

export const HERO_ROTARY: HeroRotaryConfig[] = [
  {
    // trl: hero.items.nordkapp
    id: "nordkapp",
    link: "https://youtu.be/eJs1toIXj5k?si=9PiRkNPdJdO5Xo1a",
    image: "/images/nordkapp.jpg",
    publishedAt: "2025-04-19",
    newPage: true,
  },
  {
    // trl: hero.items.thisisme
    id: "thisisme",
    link: "https://colin.heggli.dev",
    image: "/images/thisisme.png",
    publishedAt: "2025-05-12",
  },
];
