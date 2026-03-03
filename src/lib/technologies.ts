export interface TechnologyDef {
  name: string;
  icon: string;
  type: string;
  color: string;
}

export type technologyNames = keyof typeof technologies;

export const technologies: Record<string, TechnologyDef> = {
  "prisma": {
    "name": "Prisma",
    "icon": "/images/tech/prisma.png",
    "type": "database",
    "color": "#2D3748"
  },
  "react": {
    "name": "React",
    "icon": "/images/tech/react.svg",
    "type": "frontend",
    "color": "#61DAFB"
  },
  "nextjs": {
    "name": "Next.js",
    "icon": "/images/tech/next.js.png",
    "type": "frontend",
    "color": "#ffffff"
  },
  "typescript": {
    "name": "TypeScript",
    "icon": "/images/tech/typescript.png",
    "type": "language",
    "color": "#007ACC"
  },
  "javascript": {
    "name": "JavaScript",
    "icon": "/images/tech/javascript.svg",
    "type": "language",
    "color": "#F7DF1E"
  },
  "nodejs": {
    "name": "Node.js",
    "icon": "/images/tech/node.js.png",
    "type": "backend",
    "color": "#8CC84B"
  },
  "npm": {
    "name": "npm",
    "icon": "/images/tech/npm.png",
    "type": "package manager",
    "color": "#CB3837"
  },
  "tailwindcss": {
    "name": "Tailwind CSS",
    "icon": "/images/tech/tailwind.svg",
    "type": "css framework",
    "color": "#38bdf8"
  },
  "express": {
    "name": "Express",
    "icon": "/images/tech/express.png",
    "type": "backend",
    "color": "#000000"
  },
  "mongodb": {
    "name": "MongoDB",
    "icon": "/images/tech/mongodb.png",
    "type": "database",
    "color": "#47A248"
  },
  "graphql": {
    "name": "GraphQL",
    "icon": "/images/tech/graphql.png",
    "type": "api",
    "color": "#E10098"
  },
  "docker": {
    "name": "Docker",
    "icon": "/images/tech/docker.png",
    "type": "containerization",
    "color": "#2496ED"
  },
  "postgresql": {
    "name": "PostgreSQL",
    "icon": "/images/tech/postgresql.png",
    "type": "database",
    "color": "#336791"
  },
  "redis": {
    "name": "Redis",
    "icon": "/images/tech/redis.png",
    "type": "database",
    "color": "#D82C20"
  },
  "vuejs": {
    "name": "Vue.js",
    "icon": "/images/tech/vue.js.png",
    "type": "frontend",
    "color": "#42B883"
  },
  "angular": {
    "name": "Angular",
    "icon": "/images/tech/angular.png",
    "type": "frontend",
    "color": "#DD0031"
  },
  "lucide": {
    "name": "Lucide",
    "icon": "/images/tech/lucide.png",
    "type": "icons",
    "color": "#f56565"
  },
  "flutter": {
    "name": "Flutter",
    "icon": "/images/tech/flutter.png",
    "type": "mobile",
    "color": "#02569B"
  },
  "kotlin": {
    "name": "Kotlin",
    "icon": "/images/tech/kotlin.png",
    "type": "language",
    "color": "#F18E33"
  },
  "swift": {
    "name": "Swift",
    "icon": "/images/tech/swift.png",
    "type": "language",
    "color": "#F05138"
  },
  "php": {
    "name": "PHP",
    "icon": "/images/tech/php.png",
    "type": "language",
    "color": "#777BB4"
  },
  "ruby": {
    "name": "Ruby",
    "icon": "/images/tech/ruby.png",
    "type": "language",
    "color": "#CC342D"
  },
  "go": {
    "name": "Go",
    "icon": "/images/tech/go.png",
    "type": "language",
    "color": "#00ADD8"
  },
  "dart": {
    "name": "Dart",
    "icon": "/images/tech/dart.png",
    "type": "language",
    "color": "#00BFFF"
  },
  "rust": {
    "name": "Rust",
    "icon": "/images/tech/rust.png",
    "type": "language",
    "color": "#000000"
  },
  "powershell": {
    "name": "PowerShell",
    "icon": "/images/tech/powershell.png",
    "type": "scripting",
    "color": "#5391FE"
  },
  "bash": {
    "name": "Bash",
    "icon": "/images/tech/bash.png",
    "type": "scripting",
    "color": "#4EAA25"
  },
  "html": {
    "name": "HTML",
    "icon": "/images/tech/html.png",
    "type": "markup",
    "color": "#E34F26"
  },
  "css": {
    "name": "CSS",
    "icon": "/images/tech/css.png",
    "type": "css",
    "color": "#306af1"
  },
  "mysql": {
    "name": "MySQL",
    "icon": "/images/tech/mysql.png",
    "type": "database",
    "color": "#4479A1"
  },
  "mssql": {
    "name": "MSSQL",
    "icon": "/images/tech/mssql.png",
    "type": "database",
    "color": "#CC2927"
  },
  "sqlite": {
    "name": "SQLite",
    "icon": "/images/tech/mssql.png",
    "type": "database",
    "color": "#003B57"
  },
  "firebase": {
    "name": "Firebase",
    "icon": "/images/tech/firebase.png",
    "type": "backend",
    "color": "#FFCA28"
  },
  "word": {
    "name": "Word",
    "icon": "/images/tech/word.png",
    "type": "document",
    "color": "#2B579A"
  },
  "excel": {
    "name": "Excel",
    "icon": "/images/tech/excel.png",
    "type": "spreadsheet",
    "color": "#217346"
  },
  "powerpoint": {
    "name": "PowerPoint",
    "icon": "/images/tech/powerpoint.png",
    "type": "presentation",
    "color": "#C94D00"
  },
  "microsoft": {
    "name": "Microsoft",
    "icon": "/images/tech/microsoft.png",
    "type": "software",
    "color": "#F25022"
  },
  "office": {
    "name": "Office",
    "icon": "/images/tech/office.png",
    "type": "software",
    "color": "#a94dde"
  },
  "windows": {
    "name": "Windows",
    "icon": "/images/tech/windows.svg",
    "type": "os",
    "color": "#0078D6"
  },
  "linux": {
    "name": "Linux",
    "icon": "/images/tech/linux.png",
    "type": "os",
    "color": "#FCC624"
  },
  "rhel": {
    "name": "Red Hat",
    "icon": "/images/tech/red hat.png",
    "type": "os",
    "color": "#CC0000"
  },
  "debian": {
    "name": "Debian",
    "icon": "/images/tech/debian.png",
    "type": "os",
    "color": "#A81D33"
  },
  "ubuntu": {
    "name": "Ubuntu",
    "icon": "/images/tech/ubuntu.png",
    "type": "os",
    "color": "#E95420"
  },
  "c": {
    "name": "C",
    "icon": "/images/tech/c.svg",
    "type": "language",
    "color": "#a4b4c7"
  },
  "cplusplus": {
    "name": "C++",
    "icon": "/images/tech/c++.png",
    "type": "language",
    "color": "#00599C"
  },
  "csharp": {
    "name": "C#",
    "icon": "/images/tech/csharp.png",
    "type": "language",
    "color": "#360092"
  },
  "java": {
    "name": "Java",
    "icon": "/images/tech/java.png",
    "type": "language",
    "color": "#f29020"
  },
  "dotnet": {
    "name": ".NET",
    "icon": "/images/tech/.net.png",
    "type": "framework",
    "color": "#512BD4"
  },
  "git": {
    "name": "Git",
    "icon": "/images/tech/git.png",
    "type": "version control",
    "color": "#F05032"
  },
  "github": {
    "name": "GitHub",
    "icon": "/images/tech/github.svg",
    "type": "version control",
    "color": "#181717"
  },
  "gitlab": {
    "name": "GitLab",
    "icon": "/images/tech/gitlab.png",
    "type": "version control",
    "color": "#FC6D26"
  },
  "i18n": {
    "name": "i18n",
    "icon": "/images/tech/i18n.png",
    "type": "internationalization",
    "color": "#7986cb"
  },
  "eslint": {
    "name": "ESLint",
    "icon": "/images/tech/eslint.png",
    "type": "linting",
    "color": "#4B32C3"
  },
  "prettier": {
    "name": "Prettier",
    "icon": "/images/tech/prettier.png",
    "type": "formatting",
    "color": "#F7B93E"
  },
  "vercel": {
    "name": "Vercel",
    "icon": "/images/tech/vercel.png",
    "type": "hosting",
    "color": "#ffffff"
  },
  "shadcnui": {
    "name": "Shadcn UI",
    "icon": "/images/tech/shadcn ui.png",
    "type": "ui library",
    "color": "#ffffff"
  },
  "turbopack": {
    "name": "Turbopack",
    "icon": "/images/tech/turbopack.png",
    "type": "build tool",
    "color": "#fe1e57"
  },
  "stripe": {
    "name": "Stripe",
    "icon": "/images/tech/stripe.png",
    "type": "payment",
    "color": "#6772E5"
  },
  "drizzle": {
    "name": "Drizzle ORM",
    "icon": "/images/tech/drizzle orm.png",
    "type": "database",
    "color": "#bfef4d"
  },
  "discord": {
    "name": "Discord",
    "icon": "/images/tech/discord.png",
    "type": "communication",
    "color": "#7289DA"
  },
  "webpack": {
    "name": "Webpack",
    "icon": "/images/tech/webpack.png",
    "type": "build tool",
    "color": "#2376b5"
  },
  "wordpress": {
    "name": "WordPress",
    "icon": "/images/tech/wordpress.png",
    "type": "cms",
    "color": "#21759B"
  },
  "python": {
    "name": "Python",
    "icon": "/images/tech/python.png",
    "type": "language",
    "color": "#3776AB"
  },
  "raspberrypi": {
    "name": "Raspberry Pi",
    "icon": "/images/tech/raspberrypi.png",
    "type": "hardware",
    "color": "#A22846"
  },
  "powerbi": {
    "name": "Power BI",
    "icon": "/images/tech/powerbi.png",
    "type": "business intelligence",
    "color": "#F2C94C"
  },
  "figma": {
    "name": "Figma",
    "icon": "/images/tech/figma.png",
    "type": "design",
    "color": "#874fff"
  },
  "google": {
    "name": "Google",
    "icon": "/images/tech/google.png",
    "type": "search engine",
    "color": "#4285F4"
  },
  "cloudflare": {
    "name": "Cloudflare",
    "icon": "/images/tech/cloudflare.png",
    "type": "security",
    "color": "#F38020"
  },
  "vscode": {
    "name": "VS Code",
    "icon": "/images/tech/visual studio code.png",
    "type": "editor",
    "color": "#007ACC"
  },
  "visualstudio": {
    "name": "Visual Studio",
    "icon": "/images/tech/visualstudio.svg",
    "type": "editor",
    "color": "#5C2D91"
  },
  "jetbrains": {
    "name": "JetBrains",
    "icon": "/images/tech/jetbrains.png",
    "type": "editor",
    "color": "#fd2f55"
  },
  "webstorm": {
    "name": "WebStorm",
    "icon": "/images/tech/webstorm.png",
    "type": "editor",
    "color": "#12bbf4"
  },
  "android": {
    "name": "Android",
    "icon": "/images/tech/android.png",
    "type": "mobile",
    "color": "#3DDC84"
  },
  "pycharm": {
    "name": "PyCharm",
    "icon": "/images/tech/pycharm.png",
    "type": "editor",
    "color": "#28d890"
  },
  "intellij": {
    "name": "IntelliJ IDEA",
    "icon": "/images/tech/intellij.png",
    "type": "editor",
    "color": "#fe7f27"
  },
  "phpstorm": {
    "name": "PhpStorm",
    "icon": "/images/tech/phpstorm.png",
    "type": "editor",
    "color": "#b14df2"
  },
  "goland": {
    "name": "GoLand",
    "icon": "/images/tech/goland.png",
    "type": "editor",
    "color": "#08aec3"
  },
  "rubymine": {
    "name": "RubyMine",
    "icon": "/images/tech/rubymine.png",
    "type": "editor",
    "color": "#ff2658"
  },
  "clion": {
    "name": "CLion",
    "icon": "/images/tech/clion.png",
    "type": "editor",
    "color": "#29d993"
  },
  "rider": {
    "name": "Rider",
    "icon": "/images/tech/rider.png",
    "type": "editor",
    "color": "#e77136"
  },
  "zabbix": {
    "name": "Zabbix",
    "icon": "/images/tech/zabbix.webp",
    "type": "monitoring",
    "color": "#d50808"
  },
  "powerplatform": {
    "name": "Power Platform",
    "icon": "/images/tech/powerplatform.png",
    "type": "business intelligence",
    "color": "#33b67b"
  },
  "servicenow": {
    "name": "ServiceNow",
    "icon": "/images/tech/servicenow.png",
    "type": "business intelligence",
    "color": "#62d84e"
  },
  "codabix": {
    "name": "CodaBix",
    "icon": "/images/tech/codabix.png",
    "type": "business intelligence",
    "color": "#f5a623"
  },
  "azure": {
    "name": "Azure",
    "icon": "/images/tech/azure.png",
    "type": "cloud",
    "color": "#0089D6"
  },
  "azuredevops": {
    "name": "Azure DevOps",
    "icon": "/images/tech/azuredevops.svg",
    "type": "cloud",
    "color": "#0078D4"
  },
  "aws": {
    "name": "AWS",
    "icon": "/images/tech/aws.png",
    "type": "cloud",
    "color": "#FF9900"
  },
  "cursor": {
    "name": "Cursor",
    "icon": "/images/tech/cursor.png",
    "type": "editor",
    "color": "#ffffff"
  },
  "eclipse": {
    "name": "Eclipse",
    "icon": "/images/tech/eclipse.png",
    "type": "editor",
    "color": "#2c2255"
  },
  "subversion": {
    "name": "Subversion",
    "icon": "/images/tech/subversion.png",
    "type": "version control",
    "color": "#7e9cc8"
  },
  "oracle": {
    "name": "Oracle",
    "icon": "/images/tech/oracle.png",
    "type": "database",
    "color": "#f80000"
  },
  "typst": {
    "name": "Typst",
    "icon": "/images/tech/typst.png",
    "type": "document",
    "color": "#36b2a9"
  },
  "yml": {
    "name": "YAML",
    "icon": "/images/tech/yaml.png",
    "type": "language",
    "color": "#cc1018"
  },
  "nixos": {
    "name": "NixOS",
    "icon": "/images/tech/nixos.png",
    "type": "os",
    "color": "#5277C3"
  },
  "bun": {
    "name": "Bun",
    "icon": "/images/tech/bun.png",
    "type": "package manager",
    "color": "#fbf0df"
  }
}