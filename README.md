# AITesterBluePrint — Repository Overview

This repository contains practice materials and projects for AI-assisted QA and test automation. The README below summarizes each chapter and practice work present in the repository.

## Chapters found

- Chapter02_Prompt_Engineering
  - Focus: Prompt engineering for test-case generation and anti-hallucination guardrails.
  - Key files:
    - AntiHallucinationRule.md — Mandatory verification rules and output format to avoid AI hallucinations.
    - ChecklistOFPromptComplete.md — Prompt completeness checklist (Role, Context, Task, Constraints, Output, Terminology).
    - Template/01_TestCaseGeneration_prompt.md — Basic test-case generation template.
    - Template/03_TestCaseGeneration_For_API.md — API test-case generation template and coverage guidance.
    - Template/02_TestCaseGeneration_from_PRD.md, 04_Negative_TestCaseOnly.md, 05_Security_TestCaseGeneration.md, 06_RegressionSuit_TestCaseGeneration.md — Additional templates.
    - Project01_TC_Generation/RICE_POT_FRAMEWORK/RicePot.md — RICE-POT prompt builder and worked examples (Role, Instructions, Context, Example, Parameters, Output, Tone).
    - Project01_TC_Generation/ouput — Generated CSV test cases (examples).
    - Project02_Selenium — Selenium project planning and an in-progress Maven-based framework (AdvanceSeleniumFrameword).

## Other top-level files

- README.md — This file.

## Projects / Practice (details)

- Project01_TC_Generation/RICE_POT_FRAMEWORK
  - Purpose: Build high-quality prompts using the RICE-POT framework to generate reproducible test cases and CSV outputs.
  - Outputs: CSV files under `Project01_TC_Generation/ouput/`.

- Project02_Selenium/AdvanceSeleniumFrameword
  - Maven-based Selenium automation skeleton with page objects and example tests under `src/test/java`.
  - To run tests locally (requires Java + Maven):
    - Open a terminal in `Chapter02_Prompt_Engineering\Project02_Selenium\AdvanceSeleniumFrameword`
    - Use the included Maven wrapper: `mvnw.cmd test` on Windows or `./mvnw test` on Unix-like systems.

## How to use these materials

- Learn RICE-POT: read `Chapter02_Prompt_Engineering\Project01_TC_Generation\RICE_POT_FRAMEWORK\RicePot.md` and use templates in `Chapter02_Prompt_Engineering\Template\`.
- Generate test cases by adapting the templates and running prompts against an LLM following the anti-hallucination rules.
- Inspect Selenium code in `Chapter02_Prompt_Engineering\Project02_Selenium\AdvanceSeleniumFrameword\src` for examples of page objects and tests.

## Missing chapters

- No other Chapter folders (e.g., Chapter01, Chapter03) were found at the repository root. If additional chapters exist elsewhere, provide their paths and they will be added to this README.

---

_Last updated: 2026-05-25_
