/**
 * Career configuration.
 * Translations: messages/{locale}.ts -> career.items.{id}
 *
 * Experience items:
 *   - career.items.{id}.company
 *   - career.items.{id}.department
 *   - career.items.{id}.role
 *   - career.items.{id}.description
 *
 * Education items:
 *   - career.items.{id}.school
 *   - career.items.{id}.degree
 *   - career.items.{id}.description
 */

export interface ExperienceConfig {
  id: string;
  startDate: string;
  endDate?: string;
  /** Technology keys from src/lib/technologies.ts */
  tech: string[];
}

export interface EducationConfig {
  id: string;
  startDate: string;
  endDate?: string;
}

export const EXPERIENCE: ExperienceConfig[] = [
  {
    // trl: career.items.wibilea
    id: "wibilea",
    startDate: "2022-08-01",
    endDate: "2023-07-31",
    tech: [
      "office",
      "excel",
      "word",
      "powerpoint",
      "html",
      "css",
      "javascript",
      "php",
      "mysql",
    ],
  },
  {
    // trl: career.items.gfLocalIt
    id: "gfLocalIt",
    startDate: "2023-08-01",
    endDate: "2024-07-31",
    tech: ["office", "excel", "word", "servicenow", "powershell"],
  },
  {
    // trl: career.items.gfOpex
    id: "gfOpex",
    startDate: "2024-08-01",
    endDate: "2025-07-31",
    tech: [
      "python",
      "sql",
      "excel",
      "zabbix",
      "powershell",
      "powerplatform",
      "mssql",
      "docker",
      "windows",
      "debian",
      "linux",
      "rhel",
      "powerbi",
      "codabix",
      "azuredevops",
      "csharp",
    ],
  },
  {
    // trl: career.items.gfDzs
    id: "gfDzs",
    startDate: "2025-08-01",
    endDate: "2026-07-31",
    tech: [
      "java",
      "oracle",
      "visualstudio",
      "zabbix",
      "rhel",
      "powershell",
      "mssql",
      "postgresql",
      "subversion",
      "docker",
      "windows",
      "debian",
      "typst",
      "linux",
      "eclipse",
      "nixos",
    ],
  },
];

export const EDUCATION: EducationConfig[] = [
  {
    // trl: career.items.bbz
    id: "bbz",
    startDate: "2022-08-01",
    endDate: "2026-07-31",
  },
];
