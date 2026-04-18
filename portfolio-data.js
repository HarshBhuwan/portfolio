/* ==========================================================================
   HARSH Portfolio - Central Data Structure
   This file contains all site content in a structured JSON object.
   You can edit this file directly or use the Admin Panel to update it.
   ========================================================================== */

const portfolioData = {
  settings: {
    contactEmail: "hk6396420@gmail.com",
    socialLinks: [
      { platform: "github", name: "GitHub", url: "https://github.com/repos?q=owner%3A%40me" },
      { platform: "linkedin", name: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
      { platform: "twitter", name: "Twitter", url: "https://twitter.com/yourusername" }
    ]
  },
  stats: [
    { label: "Projects Delivered", value: 10+, suffix: "" },
    { label: "Client Satisfaction", value: 98, suffix: "%" },
    
   
  ],
  skills: [
    {
      id: "n8n-ai",
      title: "n8n & AI Agents",
      icon: "🤖",
      description: "Custom AI Agents & n8n Workflows. I build autonomous systems that handle lead generation, data scraping, and automated email replies using n8n and Claude/Ollama",
      tech: ["n8n", "Ollama", "Webhooks","api integration"],
      featured: true
    },
    {
      id: "frontend",
      title: "Frontend",
      icon: "⚡",
      description: "Modern React, Vue, and vanilla JS with CSS mastery. Performance-first, accessibility-aware.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      featured: false
    },
    
    {
      id: "automation",
      title: "Process Automation",
      icon: "⚙️",
      description: "End-to-end workflow automation. Zapier, Make, and custom solutions that scale.",
      tech: ["Zapier", "Make.com", "RPA", "Puppeteer"],
      featured: false
    },
    {
      id: "cloud-devops",
      title: "Cloud & DevOps",
      icon: "☁️",
      description: "AWS, Docker, and CI/CD pipelines. Infrastructure that's reliable and cost-effective.",
      tech: ["AWS", "Docker", "GitHub Actions", "Terraform"],
      featured: false
    }
  ],
  projects: [
    {
      id: "email-ai",
      title: "Smart Inbox Assistant",
      badge: "Email AI",
      icon: "📧",
      description: "AI-powered email management system that auto-categorizes, drafts responses, and prioritizes critical messages. Reduced inbox time by 70%.",
      tech: ["OpenAI API", "Gmail API", "n8n", "Express.js"],
      url: "https://example.com/email-ai",
      previewUrl: "https://example.com/email-ai-preview",
      featured: true,
      order: 1
    },
    {
      id: "lead-scraper",
      title: "Automated Lead Scraper",
      badge: "Lead Gen",
      icon: "🔍",
      description: "Intelligent web scraper that extracts and qualifies B2B leads from multiple sources. Integrated with CRM for seamless handoff.",
      tech: ["Puppeteer", "Python", "HubSpot API", "AWS Lambda"],
      url: "https://example.com/lead-scraper",
      previewUrl: "https://example.com/lead-scraper-preview",
      featured: false,
      order: 2
    },
    {
      id: "predictive-dashboard",
      title: "Predictive Analytics Dashboard",
      badge: "Analytics",
      icon: "📊",
      description: "Real-time analytics dashboard with ML-powered predictions. Helps e-commerce clients forecast demand and optimize inventory.",
      tech: ["React", "TensorFlow.js", "PostgreSQL", "D3.js"],
      url: "https://example.com/dashboard",
      previewUrl: "https://example.com/dashboard-preview",
      featured: true,
      order: 3
    },
    {
      id: "ecommerce-automation",
      title: "E-commerce Automation Suite",
      badge: "Automation",
      icon: "⚡",
      description: "Complete n8n workflow automation for order processing, inventory sync, and customer notifications across multiple platforms.",
      tech: ["n8n", "Shopify API", "Webhooks", "Slack"],
      url: "https://example.com/automation",
      previewUrl: "",
      featured: false,
      order: 4
    }
  ]
};
