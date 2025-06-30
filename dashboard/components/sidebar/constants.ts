import {
  IconDashboard,
  IconSparkles,
  IconFileText,
  IconCamera,
  IconFileDescription,
  IconFileAi,
  IconSettings,
  IconHelp,
  IconSearch,
  IconFolder,
} from "@tabler/icons-react";
export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: IconSparkles,
    },
    {
      title: "Documentation",
      url: "#",
      icon: IconFileText,
    },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Team",
    //   url: "#",
    //   icon: IconUsers,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  apps: [
    {
      id: "graphrag",
      name: "GraphRag",
      url: "/dashboard/app/graphrag",
      icon: IconFolder,
    },
    {
      id: "ai-todo-app",
      name: "AI Todo App",
      url: "/dashboard/app/ai-todo-app",
      icon: IconFolder,
    },
    {
      id: "ai-email-assistant-app",
      name: "Ai Email Assistant App",
      url: "/dashboard/app/ai-email-assistant-app",
      icon: IconFolder,
    },
  ],
};
