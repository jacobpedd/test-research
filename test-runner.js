#!/usr/bin/env node

import Exa, { ResearchModel } from 'exa-js';
import { writeFileSync, rmSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const exa = new Exa(process.env.EXA_API_KEY);

// Test configurations extracted from tests.md
const testConfigs = [
  {
    id: 1,
    name: "Tesla Vehicle Spec Table",
    instructions: "Create a table of Tesla vehicles currently for sale (Model 3, Y, S, X, Cybertruck). For each: body style, base MSRP USD, EPA range miles, and first delivery date.",
    schema: {
      type: "object",
      required: ["vehicles"],
      properties: {
        vehicles: {
          type: "array",
          items: {
            type: "object",
            required: ["model", "bodyStyle", "baseMsrpUsd", "epaRangeMiles", "firstDelivery"],
            properties: {
              model: { type: "string" },
              bodyStyle: { type: "string" },
              baseMsrpUsd: { type: "number" },
              epaRangeMiles: { type: "integer" },
              firstDelivery: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 2,
    name: "US Fast-Casual Market by Cuisine (2024)",
    instructions: "Estimate 2024 US revenue for fast-casual chains, broken down by cuisine (e.g., Mexican, Mediterranean, Pizza, Sandwiches, Asian fusion). Provide your numeric estimate (USD billions) and a one-sentence methodology. Return exactly 6 segments including Mexican, Mediterranean, Pizza, Sandwiches, Asian Fusion, and Other. Any unfilled should be null.",
    schema: {
      type: "object",
      required: ["segments"],
      properties: {
        segments: {
          type: "array",
          items: {
            type: "object",
            required: ["cuisine", "revenueUsdBn", "methodology"],
            properties: {
              cuisine: { type: "string" },
              revenueUsdBn: { type: "number" },
              methodology: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 3,
    name: "Major Earthquakes Timeline 2015-24",
    instructions: "List all earthquakes magnitude ≥7.0 between 2015-01-01 and 2024-12-31. Provide ISO date, magnitude, nearest city, country, and tectonic region (ring-of-fire, mid-ocean-ridge, continental interior, etc.). Include at least 25 earthquake events in your response to ensure comprehensive coverage.",
    schema: {
      type: "object",
      required: ["events"],
      properties: {
        events: {
          type: "array",
          items: {
            type: "object",
            required: ["date", "magnitude", "location", "country", "regionType"],
            properties: {
              date: { type: "string" },
              magnitude: { type: "number" },
              location: { type: "string" },
              country: { type: "string" },
              regionType: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 4,
    name: "Anthropic Funding Rounds",
    instructions: "Create a table of Anthropic's funding rounds. For each round: close date, round label, amount USD, leadInvestor1, leadInvestor2.",
    schema: {
      type: "object",
      required: ["rounds"],
      properties: {
        rounds: {
          type: "array",
          items: {
            type: "object",
            required: ["date", "round", "amountUsd", "leadInvestor1"],
            properties: {
              date: { type: "string" },
              round: { type: "string" },
              amountUsd: { type: "number" },
              leadInvestor1: { type: "string" },
              leadInvestor2: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 5,
    name: "Positive-Revenue / Negative-Profit S&P 500 (FY 2023)",
    instructions: "Which S&P 500 constituents grew revenue YOY in FY 2023 but reported a net loss? Return ticker, company, revenueGrowthPct, netIncomeUsd, sector.",
    schema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            required: ["ticker", "company", "revenueGrowthPct", "netIncomeUsd", "sector"],
            properties: {
              ticker: { type: "string" },
              company: { type: "string" },
              revenueGrowthPct: { type: "number" },
              netIncomeUsd: { type: "number" },
              sector: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 6,
    name: "Paris 2024 Medal Counts",
    instructions: "Summarize medal results for Paris 2024. For each country, list totalGold, totalSilver, totalBronze, topAthleteName, topAthleteSport, and topAthletemedals. Limit to the 10 highest-ranking countries.",
    schema: {
      type: "object",
      required: ["countries"],
      properties: {
        countries: {
          type: "array",
          items: {
            type: "object",
            required: ["country", "gold", "silver", "bronze", "topAthleteName", "topAthleteSport", "topAthletemedals"],
            properties: {
              country: { type: "string" },
              gold: { type: "integer" },
              silver: { type: "integer" },
              bronze: { type: "integer" },
              topAthleteName: { type: "string" },
              topAthleteSport: { type: "string" },
              topAthletemedals: { type: "integer" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 7,
    name: "Human Coronaviruses Classification (Enum)",
    instructions: "List all known human-infecting coronaviruses and classify each as 'Common Cold' or 'Serious' based on typical disease severity.",
    schema: {
      type: "object",
      required: ["viruses"],
      properties: {
        viruses: {
          type: "array",
          items: {
            type: "object",
            required: ["virus", "severityClass"],
            properties: {
              virus: { type: "string" },
              severityClass: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 8,
    name: "Global Air-Travel CO₂ 2022",
    instructions: "Estimate total global CO₂ emitted by commercial aviation in 2022 (million tonnes) and share of global anthropogenic CO₂ (%). Present numeric values and a paragraph-length method summary.",
    schema: {
      type: "object",
      required: ["co2Mt", "percentOfGlobal", "methodology"],
      properties: {
        co2Mt: { type: "number" },
        percentOfGlobal: { type: "number" },
        methodology: { type: "string" }
      },
      additionalProperties: false
    }
  },
  {
    id: 9,
    name: "Public-Domain Images of Grand Prismatic Spring",
    instructions: "Find five high-quality, public-domain photographs of the Grand Prismatic Spring in Yellowstone. Return title, photographer (if available), sourceURL, and license.",
    schema: {
      type: "object",
      required: ["images"],
      properties: {
        images: {
          type: "array",
          items: {
            type: "object",
            required: ["title", "photographer", "sourceUrl", "license"],
            properties: {
              title: { type: "string" },
              photographer: { type: "string" },
              sourceUrl: { type: "string" },
              license: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 10,
    name: "PhD-Holding Fortune 100 CEOs",
    instructions: "Which Fortune 100 company CEOs currently hold a doctoral degree (PhD, MD, JD excluded)? Return company, CEO name, doctoralField, university, yearAwarded. Provide a comprehensive list of at least 5-10 CEOs to ensure thorough coverage of PhD-holding executives.",
    schema: {
      type: "object",
      required: ["ceos"],
      properties: {
        ceos: {
          type: "array",
          items: {
            type: "object",
            required: ["company", "ceo", "doctoralField", "university", "year"],
            properties: {
              company: { type: "string" },
              ceo: { type: "string" },
              doctoralField: { type: "string" },
              university: { type: "string" },
              year: { type: "integer" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 11,
    name: "Netflix Originals – 2024 Top 10",
    instructions: "Using Netflix's 2024 top 10 global viewership list, provide title, releaseYear, runtimeMinutes, and RottenTomatoesScore.",
    schema: {
      type: "object",
      required: ["titles"],
      properties: {
        titles: {
          type: "array",
          items: {
            type: "object",
            required: ["title", "year", "runtime", "rtScore"],
            properties: {
              title: { type: "string" },
              year: { type: "integer" },
              runtime: { type: "integer" },
              rtScore: { type: "integer" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 12,
    name: "Data-Privacy Law Comparison",
    instructions: "Compare GDPR (EU), CCPA (California), and PIPL (China) on five compliance elements: dataSubjectRights, lawfulBasis, breachNotificationWindowDays, extraterritorialScope, maxAdminFineUsd. Return an array sorted by law.",
    schema: {
      type: "object",
      required: ["laws"],
      properties: {
        laws: {
          type: "array",
          items: {
            type: "object",
            required: ["law", "dataSubjectRights", "lawfulBasis", "breachWindowDays", "extraterritorial", "maxFineUsd"],
            properties: {
              law: { type: "string" },
              dataSubjectRights: { type: "string" },
              lawfulBasis: { type: "string" },
              breachWindowDays: { type: "integer" },
              extraterritorial: { type: "boolean" },
              maxFineUsd: { type: "number" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    id: 13,
    name: "Deep Research Agents - SimpleQA Benchmark",
    instructions: "Research deep research agents and their best SimpleQA benchmark scores. For each agent: model name, company, score, date tested, and result URL. Provide at least 5-10 agents to ensure comprehensive coverage of top-performing models.",
    schema: {
      type: "object",
      required: ["agents"],
      properties: {
        agents: {
          type: "array",
          items: {
            type: "object",
            required: ["model", "company", "score", "date", "resultUrl"],
            properties: {
              model: { type: "string" },
              company: { type: "string" },
              score: { type: "number" },
              date: { type: "string" },
              resultUrl: { type: "string" }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    }
  }
];

async function runSingleTest(testConfig) {
  console.log(`\n🧪 Running Test ${testConfig.id}: ${testConfig.name}`);
  console.log('─'.repeat(60));
  
  try {
    // Create Exa research task
    console.log('🔍 Creating research task...');
    const task = await exa.research.createTask({
      model: ResearchModel.exa_research,
      instructions: testConfig.instructions,
      output: { schema: testConfig.schema }
    });

    console.log(`✅ Task created with ID: ${task.id}`);
    
    // Poll for results
    console.log('⏳ Polling for results...');
    const result = await exa.research.pollTask(task.id);
    
    // Save to JSON file
    const filename = `test-results/test-${testConfig.id.toString().padStart(2, '0')}-${testConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    
    const output = {
      testId: testConfig.id,
      testName: testConfig.name,
      timestamp: new Date().toISOString(),
      taskId: task.id,
      instructions: testConfig.instructions,
      result: result.data
    };
    
    writeFileSync(filename, JSON.stringify(output, null, 2));
    
    console.log(`✅ Test ${testConfig.id} completed! Results saved to: ${filename}`);
    
    return { success: true, filename, testId: testConfig.id, testName: testConfig.name };
    
  } catch (error) {
    console.error(`❌ Test ${testConfig.id} failed:`, error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Exa Research API Test Suite');
  console.log(`📊 Running ${testConfigs.length} tests...\n`);
  
  // Clean results directory
  if (existsSync('test-results')) {
    rmSync('test-results', { recursive: true });
  }
  mkdirSync('test-results', { recursive: true });
  
  const results = [];
  
  for (const testConfig of testConfigs) {
    const result = await runSingleTest(testConfig);
    results.push(result);
    
    // Add a small delay between tests to avoid rate limiting
    if (testConfig.id < testConfigs.length) {
      console.log('⏱️  Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Save summary
  const summaryFilename = `test-results/test-summary.json`;
  
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: testConfigs.length,
    results
  };
  
  writeFileSync(summaryFilename, JSON.stringify(summary, null, 2));
  
  console.log('\n🎉 All tests completed successfully!');
  console.log(`💾 Summary saved to: ${summaryFilename}`);
}

// Check if we should run a specific test or all tests
const args = process.argv.slice(2);
if (args.length > 0) {
  const testId = parseInt(args[0]);
  const testConfig = testConfigs.find(t => t.id === testId);
  
  if (testConfig) {
    console.log(`🎯 Running single test: ${testId}`);
    runSingleTest(testConfig);
  } else {
    console.error(`❌ Test ${testId} not found. Available tests: 1-${testConfigs.length}`);
    process.exit(1);
  }
} else {
  runAllTests();
}