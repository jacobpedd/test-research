# Exa Research API Test Suite

A comprehensive test suite for evaluating the Exa Research API across diverse research domains and data structures. This project implements 13 different test cases designed to stress-test various API capabilities including structured data retrieval, multi-document synthesis, timeline analysis, and complex schema handling.

## Quick Start

1. **Setup Environment**
   ```bash
   npm install
   cp .env.example .env  # Add your EXA_API_KEY
   ```

2. **Run All Tests**
   ```bash
   node test-runner.js
   ```

3. **Run Individual Tests**
   ```bash
   node test-runner.js 1    # Tesla Vehicle Specs
   node test-runner.js 5    # S&P 500 Analysis
   node test-runner.js 12   # Privacy Law Comparison
   ```

## Test Categories

The test suite covers 13 different research domains:

| Test | Domain | Focus |
|------|--------|-------|
| 1 | Tesla Vehicle Specs | Simple structured data |
| 2 | Fast-Casual Market Analysis | Enum + numeric reasoning |
| 3 | Earthquake Timeline 2015-24 | Historical data aggregation |
| 4 | Anthropic Funding Rounds | Deep entity profiling |
| 5 | S&P 500 Revenue/Profit Analysis | Boolean filtering + math |
| 6 | Paris 2024 Olympics | Complex nested data |
| 7 | Human Coronaviruses | Enum validation |
| 8 | Aviation CO₂ Emissions | Multi-step calculations |
| 9 | Yellowstone Images | Media metadata search |
| 10 | Fortune 100 PhD CEOs | Executive background research |
| 11 | Netflix Top 10 Originals | Streaming media analysis |
| 12 | Privacy Law Comparison | Multi-document synthesis |
| 13 | AI Benchmark Research | Cutting-edge domain testing |

## Output

- **Individual Results**: `test-results/test-XX-[name].json`
- **Summary Report**: `test-results/test-summary.json`
- **Analysis Document**: `results.md` (comprehensive evaluation)

Each test result includes:
- Test metadata (ID, name, timestamp, task ID)
- Original instructions and schema
- Complete API response data
- Execution details

## Key Features

- **Comprehensive Coverage**: 13 tests across diverse research domains
- **Schema Validation**: All tests include detailed JSON schemas
- **Error Handling**: Graceful failure handling with detailed error reporting
- **Result Analysis**: Automated generation of performance analysis
- **Individual Test Execution**: Run specific tests by ID
- **Rate Limiting**: Built-in delays between tests to avoid API limits

## Test Results Summary

Based on our comprehensive evaluation:

- **Success Rate**: 100% (13/13 tests)
- **Total Tests**: 13
- **Successful**: 13 tests
- **Failed**: 0 tests

### Key Findings

1. **Instruction Clarity Matters**: Specifying exact count requirements (min/max) significantly improves results for comprehensive datasets
2. **Domain Strengths**: API excels with mainstream, well-documented research topics
3. **Schema Compliance**: Consistent adherence to provided JSON schemas
4. **Data Quality**: High accuracy and completeness for successful tests

## Requirements

- Node.js 16+ with ES modules support
- `.env` file with `EXA_API_KEY`
- Internet connection for API calls

## Project Structure

```
test-research/
├── test-runner.js          # Main test execution script
├── tests.md               # Original test specifications
├── results.md             # Comprehensive results analysis
├── test-results/          # Individual test outputs
├── package.json           # Dependencies and scripts
├── .env.example           # Environment template
└── README.md             # This file
```

## API Usage Patterns

The test suite demonstrates several optimal usage patterns:

1. **Clear Instructions**: Specify exact requirements and expected output counts
2. **Structured Schemas**: Use detailed JSON schemas with proper validation
3. **Domain Selection**: Focus on well-documented, mainstream research topics
4. **Error Handling**: Implement robust error handling and retry logic

## Contributing

This test suite serves as both a validation tool and a reference implementation for Exa Research API integration. The `results.md` document provides detailed analysis and recommendations for optimal API usage.

## License

MIT