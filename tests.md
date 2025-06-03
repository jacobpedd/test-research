# Exa Research API • 12 End-to-End Sample Tasks  
_These examples are meant to “stress-test” different capabilities of Exa’s Research pipeline: fact retrieval, numerical aggregation, reasoning, timeline construction, enum handling, nested objects, array limits, and citation coverage._

| # | Focus Area | One-sentence Goal |
|---|------------|------------------|
| 1 | Simple table | Compare key specs of Tesla’s current vehicle lineup |
| 2 | Enum + numeric reasoning | Size the 2024 US fast-casual restaurant market by cuisine |
| 3 | Timeline & grouping | Chronology of large (> M7.0) earthquakes 2015-24, grouped by region |
| 4 | Deep dive on one entity | Profile Anthropic: funding rounds, lead investors, amount |
| 5 | Bool filter + math | Which S&P 500 firms had **positive YOY revenue** but **negative YOY profit** in 2023? |
| 6 | Nested arrays | Detail 2024 Olympics medal counts by sport, country & athlete |
| 7 | Enum validation | List all known human coronaviruses; classify as “common cold” or “serious” |
| 8 | Multi-step calc | Estimate global CO₂ emissions from air travel in 2022 (tonnes & % of total) |
| 9 | Image meta | Return top 5 publicly licensed images of Yellowstone’s Grand Prismatic Spring |
|10 | Boolean presence | Which Fortune 100 CEOs publicly hold a PhD? |
|11 | Streaming media | Extract runtime, release year & Rotten Tomatoes score for the 10 most-watched Netflix originals (2024) |
|12 | Multi-doc synthesis | Compare GDPR, CCPA & China’s PIPL on five key compliance requirements |

Below are the **request bodies** (instructions + `output.schema`) and a **truncated expected output shape** for each task.  
Copy-paste the JSON into your `POST /research/v0/tasks` call, replacing `$EXA_API_KEY`.

---

## 1 · Tesla Vehicle Spec Table
<details>
<summary>Open JSON</summary>

```jsonc
{
  "instructions": "Create a table of Tesla vehicles currently for sale (Model 3, Y, S, X, Cybertruck). For each: body style, base MSRP USD, EPA range miles, and first delivery date.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["vehicles"],
      "properties": {
        "vehicles": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["model", "bodyStyle", "baseMsrpUsd", "epaRangeMiles", "firstDelivery"],
            "properties": {
              "model": { "type": "string" },
              "bodyStyle": { "type": "string", "enum": ["Sedan","SUV","Pickup"] },
              "baseMsrpUsd": { "type": "number" },
              "epaRangeMiles": { "type": "integer" },
              "firstDelivery": { "type": "string", "format": "date" }
            }
          }
        }
      },
      "additionalProperties": false
    }
  }
}

Expected shape

{
  "vehicles": [
    {
      "model": "Model 3 Long Range",
      "bodyStyle": "Sedan",
      "baseMsrpUsd": 47990,
      "epaRangeMiles": 341,
      "firstDelivery": "2017-07-28",
      "citations": { ... }
    },
    …
  ]
}

</details>



⸻

2 · US Fast-Casual Market by Cuisine (2024)

<details><summary>JSON</summary>


{
  "instructions": "Estimate 2024 US revenue for fast-casual chains, broken down by cuisine (e.g., Mexican, Mediterranean, Pizza, Sandwiches, Asian fusion). Provide your numeric estimate (USD billions) and a one-sentence methodology. Use an enum list of cuisines below; any unfilled should be null.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["segments"],
      "properties": {
        "segments": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["cuisine", "revenueUsdBn", "methodology"],
            "properties": {
              "cuisine": {
                "type": "string",
                "enum": ["Mexican","Mediterranean","Pizza","Sandwiches","Asian Fusion","Other"]
              },
              "revenueUsdBn": { "type": "number" },
              "methodology": { "type": "string" }
            }
          },
          "minItems": 6,
          "maxItems": 6
        }
      }
    }
  }
}

Expected result: array of six cuisine buckets with numeric revenue and short method, each root field cited.

</details>



⸻

3 · Major Earthquakes Timeline 2015-24

<details><summary>JSON</summary>


{
  "instructions": "List all earthquakes magnitude ≥7.0 between 2015-01-01 and 2024-12-31. Provide ISO date, magnitude, nearest city, country, and tectonic region (ring-of-fire, mid-ocean-ridge, continental interior, etc.).",
  "output": {
    "schema": {
      "type": "object",
      "required": ["events"],
      "properties": {
        "events": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["date","magnitude","location","country","regionType"],
            "properties": {
              "date": { "type": "string", "format": "date" },
              "magnitude": { "type": "number" },
              "location": { "type": "string" },
              "country": { "type": "string" },
              "regionType": {
                "type": "string",
                "enum": ["Ring of Fire","Mid-Ocean Ridge","Continental Interior","Other"]
              }
            }
          }
        }
      }
    }
  }
}

Expected: ~25-35 entries, chronologically sorted.

</details>



⸻

4 · Anthropic Funding Rounds

<details><summary>JSON</summary>


{
  "instructions": "Create a table of Anthropic's funding rounds. For each round: close date, round label, amount USD, lead investors (array).",
  "output": {
    "schema": {
      "type": "object",
      "required": ["rounds"],
      "properties": {
        "rounds": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["date","round","amountUsd","leadInvestors"],
            "properties": {
              "date": { "type": "string", "format": "date" },
              "round": { "type": "string" },
              "amountUsd": { "type": "number" },
              "leadInvestors": {
                "type": "array",
                "items": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}

Expected: rounds from 2021 seed to 2024 Series F, each with citations.

</details>



⸻

5 · Positive-Revenue / Negative-Profit S&P 500 (FY 2023)

<details><summary>JSON</summary>


{
  "instructions": "Which S&P 500 constituents grew revenue YOY in FY 2023 but reported a net loss? Return ticker, company, revenueGrowthPct, netIncomeUsd, sector.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["companies"],
      "properties": {
        "companies": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["ticker","company","revenueGrowthPct","netIncomeUsd","sector"],
            "properties": {
              "ticker": { "type": "string" },
              "company": { "type": "string" },
              "revenueGrowthPct": { "type": "number" },
              "netIncomeUsd": { "type": "number" },
              "sector": { "type": "string" }
            }
          }
        }
      }
    }
  }
}

Expected: list likely incl. AMZN, CRM, etc.

</details>



⸻

6 · Paris 2024 Medal Counts (Nested)

<details><summary>JSON</summary>


{
  "instructions": "Summarize medal results for Paris 2024. For each country, list totalGold, totalSilver, totalBronze, and a nested array of top-performing athletes (name, sport, medalsWon). Limit to the 10 highest-ranking countries.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["countries"],
      "properties": {
        "countries": {
          "type": "array",
          "minItems": 10,
          "maxItems": 10,
          "items": {
            "type": "object",
            "required": ["country","gold","silver","bronze","athletes"],
            "properties": {
              "country": { "type": "string" },
              "gold": { "type": "integer" },
              "silver": { "type": "integer" },
              "bronze": { "type": "integer" },
              "athletes": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name","sport","medals"],
                  "properties": {
                    "name": { "type": "string" },
                    "sport": { "type": "string" },
                    "medals": { "type": "integer" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

Expected: nested medal table for USA, CHN, etc.

</details>



⸻

7 · Human Coronaviruses Classification (Enum)

<details><summary>JSON</summary>


{
  "instructions": "List all known human-infecting coronaviruses and classify each as 'Common Cold' or 'Serious' based on typical disease severity.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["viruses"],
      "properties": {
        "viruses": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["virus","severityClass"],
            "properties": {
              "virus": { "type": "string" },
              "severityClass": {
                "type": "string",
                "enum": ["Common Cold","Serious"]
              }
            }
          }
        }
      }
    }
  }
}

Expected viruses: 229E, NL63, OC43, HKU1 (cold); SARS-CoV, MERS-CoV, SARS-CoV-2 (serious).

</details>



⸻

8 · Global Air-Travel CO₂ 2022

<details><summary>JSON</summary>


{
  "instructions": "Estimate total global CO₂ emitted by commercial aviation in 2022 (million tonnes) and share of global anthropogenic CO₂ (%). Present numeric values and a paragraph-length method summary.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["co2Mt","percentOfGlobal","methodology"],
      "properties": {
        "co2Mt": { "type": "number" },
        "percentOfGlobal": { "type": "number" },
        "methodology": { "type": "string" }
      }
    }
  }
}

Expected: ~900 Mt, ≈2.2 %.

</details>



⸻

9 · Public-Domain Images of Grand Prismatic Spring

<details><summary>JSON</summary>


{
  "instructions": "Find five high-quality, public-domain photographs of the Grand Prismatic Spring in Yellowstone. Return title, photographer (if available), sourceURL, and license.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["images"],
      "properties": {
        "images": {
          "type": "array",
          "minItems": 5,
          "maxItems": 5,
          "items": {
            "type": "object",
            "required": ["title","photographer","sourceUrl","license"],
            "properties": {
              "title": { "type": "string" },
              "photographer": { "type": "string","nullable": true },
              "sourceUrl": { "type": "string","format": "uri" },
              "license": { "type": "string" }
            }
          }
        }
      }
    }
  }
}

Expected: Five CC0 / public-domain images.

</details>



⸻

10 · PhD-Holding Fortune 100 CEOs

<details><summary>JSON</summary>


{
  "instructions": "Which Fortune 100 company CEOs currently hold a doctoral degree (PhD, MD, JD excluded)? Return company, CEO name, doctoralField, university, yearAwarded.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["ceos"],
      "properties": {
        "ceos": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["company","ceo","doctoralField","university","year"],
            "properties": {
              "company": { "type": "string" },
              "ceo": { "type": "string" },
              "doctoralField": { "type": "string" },
              "university": { "type": "string" },
              "year": { "type": "integer" }
            }
          }
        }
      }
    }
  }
}

Expected: e.g., Arvind Krishna (IBM, PhD EE, 1991).

</details>



⸻

11 · Netflix Originals – 2024 Top 10

<details><summary>JSON</summary>


{
  "instructions": "Using Netflix's 2024 top 10 global viewership list, provide title, releaseYear, runtimeMinutes, and RottenTomatoesScore.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["titles"],
      "properties": {
        "titles": {
          "type": "array",
          "minItems": 10,
          "maxItems": 10,
          "items": {
            "type": "object",
            "required": ["title","year","runtime","rtScore"],
            "properties": {
              "title": { "type": "string" },
              "year": { "type": "integer" },
              "runtime": { "type": "integer" },
              "rtScore": { "type": "integer","minimum": 0,"maximum": 100 }
            }
          }
        }
      }
    }
  }
}

Expected: The 10 most-watched originals, each with runtime & RT score.

</details>



⸻

12 · Data-Privacy Law Comparison

<details><summary>JSON</summary>


{
  "instructions": "Compare GDPR (EU), CCPA (California), and PIPL (China) on five compliance elements: dataSubjectRights, lawfulBasis, breachNotificationWindowDays, extraterritorialScope, maxAdminFineUsd. Return an array sorted by law.",
  "output": {
    "schema": {
      "type": "object",
      "required": ["laws"],
      "properties": {
        "laws": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "items": {
            "type": "object",
            "required": ["law","dataSubjectRights","lawfulBasis","breachWindowDays","extraterritorial","maxFineUsd"],
            "properties": {
              "law": { "type": "string","enum": ["GDPR","CCPA","PIPL"] },
              "dataSubjectRights": { "type": "string" },
              "lawfulBasis": { "type": "string" },
              "breachWindowDays": { "type": "integer" },
              "extraterritorial": { "type": "boolean" },
              "maxFineUsd": { "type": "number" }
            }
          }
        }
      }
    }
  }
}

Expected fines: GDPR ≈ $22 M or 4 % global turnover; PIPL ≈ $7 M or 5 % revenue; CCPA ≈ $7.5 k per record.

</details>



⸻

Tips for Using These Samples
	•	Start small: test one or two examples to validate your integration before bulk-loading.
	•	Check citations: every root-level field will include a citations object—surface it in your UI.
	•	Iterate on scopes: tighten instructions or add enums if accuracy drifts.
	•	Parallelize: create many tasks asynchronously; poll /tasks/{id} for completion.

Happy researching!


