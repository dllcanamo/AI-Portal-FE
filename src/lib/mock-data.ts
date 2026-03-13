import { Agent, Message, WorkflowStep } from "./types";

export const agents: Agent[] = [
  {
    id: "writing-assistant",
    name: "Writing Assistant",
    description:
      "Helps you write, edit, and refine content. From blog posts to emails, get polished text in seconds.",
    type: "chat",
    status: "online",
    icon: "pencil",
    category: "Writing",
    capabilities: [
      "Content generation",
      "Grammar correction",
      "Tone adjustment",
      "Summarization",
    ],
  },
  {
    id: "code-buddy",
    name: "Code Buddy",
    description:
      "Your pair programming partner. Ask questions, debug code, or get implementation suggestions.",
    type: "chat",
    status: "online",
    icon: "code",
    category: "Code",
    capabilities: [
      "Code review",
      "Bug detection",
      "Refactoring advice",
      "Multi-language support",
    ],
  },
  {
    id: "research-analyst",
    name: "Research Analyst",
    description:
      "Dives deep into topics, synthesizes information, and presents structured findings.",
    type: "chat",
    status: "online",
    icon: "search",
    category: "Research",
    capabilities: [
      "Topic research",
      "Data synthesis",
      "Citation finding",
      "Comparison analysis",
    ],
  },
  {
    id: "brainstorm-genie",
    name: "Brainstorm Genie",
    description:
      "Sparks creativity and helps you explore ideas. Perfect for ideation sessions and mind mapping.",
    type: "chat",
    status: "busy",
    icon: "lightbulb",
    category: "Creative",
    capabilities: [
      "Idea generation",
      "Mind mapping",
      "Concept exploration",
      "Creative writing prompts",
    ],
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline Agent",
    description:
      "Automates data extraction, transformation, and loading. Connect sources, define transforms, and get clean data.",
    type: "task",
    status: "online",
    icon: "database",
    category: "Data",
    capabilities: [
      "CSV/JSON processing",
      "Data cleaning",
      "Format conversion",
      "Aggregation",
    ],
  },
  {
    id: "report-generator",
    name: "Report Generator",
    description:
      "Collects data from multiple sources, analyzes trends, and produces formatted reports automatically.",
    type: "task",
    status: "online",
    icon: "file-bar-chart",
    category: "Analytics",
    capabilities: [
      "Data collection",
      "Trend analysis",
      "Chart generation",
      "PDF export",
    ],
  },
  {
    id: "test-runner",
    name: "Test Runner Agent",
    description:
      "Runs automated test suites, identifies failures, and provides detailed logs and fix suggestions.",
    type: "task",
    status: "offline",
    icon: "flask-conical",
    category: "Code",
    capabilities: [
      "Unit testing",
      "Integration testing",
      "Coverage reports",
      "Fix suggestions",
    ],
  },
  {
    id: "deployment-bot",
    name: "Deployment Bot",
    description:
      "Orchestrates deployment workflows. Build, test, stage, and deploy with full visibility into each step.",
    type: "task",
    status: "online",
    icon: "rocket",
    category: "DevOps",
    capabilities: [
      "Build automation",
      "Stage deployment",
      "Health checks",
      "Rollback support",
    ],
  },
];

export const mockChatResponses: Record<string, string[]> = {
  "writing-assistant": [
    "I'd be happy to help you refine that! Here's a polished version of your text with improved clarity and flow. I've maintained your original tone while tightening the structure.",
    "Great topic! Here's a draft outline for your blog post:\n\n1. **Introduction** — Hook the reader with a compelling statistic\n2. **Background** — Set the context\n3. **Key Points** — Break down the main arguments\n4. **Conclusion** — End with a call to action\n\nWould you like me to expand on any section?",
    "I've reviewed your email draft. Here are my suggestions:\n- The opening could be more direct\n- Consider breaking the second paragraph into bullet points\n- The closing could be warmer\n\nWant me to rewrite it with these changes?",
  ],
  "code-buddy": [
    "I see the issue! The bug is on line 42 — you're comparing with `==` instead of `===`, which causes type coercion. Here's the fix:\n\n```javascript\nif (value === expectedValue) {\n  // strict equality check\n}\n```",
    "Here's a cleaner approach using a `Map` instead of nested if-else statements. It's more maintainable and performs better with O(1) lookups:\n\n```typescript\nconst handlers = new Map([\n  ['create', handleCreate],\n  ['update', handleUpdate],\n  ['delete', handleDelete],\n]);\n```",
    "That's a solid implementation! A few suggestions:\n1. Consider extracting the validation logic into a separate function\n2. The error handling could be more specific\n3. Adding TypeScript generics here would make this reusable\n\nWant me to show you a refactored version?",
  ],
  "research-analyst": [
    "Based on my analysis, here are the key findings:\n\n**Market Overview:**\n- The market has grown 23% year-over-year\n- Three major players control 65% of the market share\n- Emerging technologies are disrupting traditional models\n\nWould you like me to dive deeper into any of these areas?",
    "I've compiled a comparison of the top 5 solutions:\n\n| Feature | Solution A | Solution B | Solution C |\n|---------|-----------|-----------|------------|\n| Price | $$ | $$$ | $ |\n| Ease of Use | High | Medium | High |\n| Scalability | Medium | High | Low |\n\nShall I add more criteria to the comparison?",
    "Here's a structured summary of the research paper:\n\n**Objective:** Investigate the correlation between X and Y\n**Method:** Longitudinal study with 500 participants\n**Key Finding:** Strong positive correlation (r=0.78)\n**Limitation:** Sample bias toward urban populations\n\nI can pull up related studies if you'd like additional context.",
  ],
  "brainstorm-genie": [
    "Love the direction! Here are 5 angles you could explore:\n\n1. 🎯 **The contrarian take** — What if the opposite of the common belief is true?\n2. 🔄 **The mashup** — Combine two unrelated industries\n3. 🎭 **The persona shift** — How would a child / scientist / artist approach this?\n4. 📦 **The constraint** — What if you had to do it with zero budget?\n5. 🌍 **The scale shift** — What if this needed to work for 1 million people?\n\nWhich one sparks something?",
    "Let me help you map this out! Starting from your core idea, I see three promising branches:\n\n**Branch A: Automation** — Remove manual steps entirely\n**Branch B: Community** — Let users contribute and curate\n**Branch C: Personalization** — AI-driven customization\n\nEach has different trade-offs. Want to explore one?",
  ],
};

export const mockWorkflows: Record<string, WorkflowStep[]> = {
  "data-pipeline": [
    {
      id: "step-1",
      label: "Connect to Data Source",
      description: "Establishing connection to the configured data source and validating credentials.",
      status: "pending",
      output: "Connected to PostgreSQL database at db.example.com:5432",
      duration: 2000,
    },
    {
      id: "step-2",
      label: "Extract Raw Data",
      description: "Pulling raw records from the source tables based on the query parameters.",
      status: "pending",
      output: "Extracted 15,420 records from 3 tables (users, orders, products)",
      duration: 4000,
    },
    {
      id: "step-3",
      label: "Transform & Clean",
      description: "Applying data cleaning rules, handling nulls, normalizing formats.",
      status: "pending",
      output: "Cleaned 15,420 records. Removed 23 duplicates. Normalized 8 date columns.",
      duration: 3000,
    },
    {
      id: "step-4",
      label: "Validate Output",
      description: "Running validation checks against the schema and business rules.",
      status: "pending",
      output: "All validation checks passed. Schema compliance: 100%",
      duration: 1500,
    },
    {
      id: "step-5",
      label: "Load to Destination",
      description: "Writing the processed data to the target destination.",
      status: "pending",
      output: "Successfully loaded 15,397 records to the data warehouse.",
      duration: 3000,
    },
  ],
  "report-generator": [
    {
      id: "step-1",
      label: "Gather Data Sources",
      description: "Collecting data from APIs, databases, and file uploads.",
      status: "pending",
      output: "Gathered data from 4 sources: Sales API, CRM database, Google Analytics, uploaded CSV",
      duration: 3000,
    },
    {
      id: "step-2",
      label: "Analyze Trends",
      description: "Running statistical analysis and identifying key trends.",
      status: "pending",
      output: "Identified 3 major trends: 15% revenue growth, 8% churn reduction, 22% increase in new signups",
      duration: 5000,
    },
    {
      id: "step-3",
      label: "Generate Visualizations",
      description: "Creating charts, graphs, and visual summaries.",
      status: "pending",
      output: "Generated 6 charts: revenue timeline, funnel analysis, cohort retention, geo distribution, top products, MoM comparison",
      duration: 4000,
    },
    {
      id: "step-4",
      label: "Compile Report",
      description: "Assembling the final report with narrative and visuals.",
      status: "pending",
      output: "Report compiled: 12 pages, executive summary included. PDF ready for download.",
      duration: 2000,
    },
  ],
  "test-runner": [
    {
      id: "step-1",
      label: "Detect Test Files",
      description: "Scanning the project for test files and test configurations.",
      status: "pending",
      output: "Found 47 test files across 12 modules. Using Jest configuration from jest.config.ts",
      duration: 1500,
    },
    {
      id: "step-2",
      label: "Run Unit Tests",
      description: "Executing unit test suites in parallel.",
      status: "pending",
      output: "142 unit tests: 139 passed, 3 failed\n\nFailed:\n- UserService.test.ts: expected 200, got 401\n- CartModule.test.ts: timeout after 5000ms\n- PaymentHelper.test.ts: assertion error on line 88",
      duration: 8000,
    },
    {
      id: "step-3",
      label: "Run Integration Tests",
      description: "Running integration tests with mocked external services.",
      status: "pending",
      output: "28 integration tests: 28 passed. All external service mocks responded correctly.",
      duration: 12000,
    },
    {
      id: "step-4",
      label: "Generate Coverage Report",
      description: "Computing code coverage metrics.",
      status: "pending",
      output: "Overall coverage: 84.2%\n- Statements: 86.1%\n- Branches: 79.3%\n- Functions: 88.7%\n- Lines: 84.2%",
      duration: 2000,
    },
    {
      id: "step-5",
      label: "Suggest Fixes",
      description: "Analyzing failures and recommending fixes.",
      status: "pending",
      output: "Fix suggestions generated for 3 failing tests. Most likely causes: expired auth token mock, async timeout too low, outdated snapshot.",
      duration: 3000,
    },
  ],
  "deployment-bot": [
    {
      id: "step-1",
      label: "Build Application",
      description: "Compiling the application and generating production artifacts.",
      status: "pending",
      output: "Build completed in 45s. Bundle size: 2.3MB (gzipped: 680KB). No warnings.",
      duration: 5000,
    },
    {
      id: "step-2",
      label: "Run Pre-deploy Tests",
      description: "Executing smoke tests before deployment.",
      status: "pending",
      output: "All 18 smoke tests passed. API health check: OK. Database migration: compatible.",
      duration: 4000,
    },
    {
      id: "step-3",
      label: "Deploy to Staging",
      description: "Deploying to the staging environment for final verification.",
      status: "pending",
      output: "Deployed to staging-app.example.com. 3 instances running. Load balancer configured.",
      duration: 6000,
    },
    {
      id: "step-4",
      label: "Health Check",
      description: "Verifying the staging deployment is healthy.",
      status: "pending",
      output: "Health check passed. Response time: 120ms avg. Memory: 256MB/512MB. CPU: 12%.",
      duration: 3000,
    },
    {
      id: "step-5",
      label: "Promote to Production",
      description: "Promoting the staging build to production with blue-green deployment.",
      status: "pending",
      output: "Production deployment complete. Blue-green swap successful. Old version retained for rollback.",
      duration: 4000,
    },
  ],
};

/**
 * Returns a random mock response for a given agent.
 */
export function getMockResponse(agentId: string): string {
  const responses = mockChatResponses[agentId];
  if (!responses || responses.length === 0) {
    return "I'm here to help! Could you give me more details about what you'd like to work on?";
  }
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Looks up an agent by its ID.
 */
export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id);
}

/**
 * Returns the workflow steps template for a task agent.
 */
export function getWorkflowSteps(agentId: string): WorkflowStep[] {
  const steps = mockWorkflows[agentId];
  if (!steps) return [];
  return steps.map((step) => ({ ...step, status: "pending" as const }));
}
