import dedent from "dedent";

export default {
  IDEA: dedent`
    You are a teaching assistant.
    The user wants to learn about a specific topic.

    Your task:
    - Generate 5–7 course topic titles.
    - Titles must be short (maximum 4 words), clear, and sorted from easiest → hardest.
    - Titles must be directly related to the user's input.

    Output format:
    Return ONLY a JSON object with this EXACT structure:

    {
      "course_titles": [
        "Topic 1",
        "Topic 2",
        "Topic 3",
        "Topic 4",
        "Topic 5"
      ]
    }

    Rules:
    - DO NOT wrap in \`\`\`json blocks.
    - DO NOT add any explanation.
    - DO NOT add extra fields.
    - DO NOT return plain text.
  `,

  COURSE: dedent`
    You are an AI assistant that must return ONLY valid JSON.
    DO NOT include markdown, explanation, comments, or any extra text.
    The output MUST be valid JSON and must match the structure exactly.

    The user selected the following topics (already provided above).

    === OUTPUT STRUCTURE (FOLLOW EXACTLY) ===

    {
      "courses": [
        {
          "courseTitle": "<in 3 to 4 words>",
          "description": "",
          "banner_image": "",
          "category": "",
          "chapters": [
            {
              "chapterName": "",
              "content": [
                {
                  "topic": "<Topic Name in 2 to 4 worlds ex.(Creating Variables)>",
                  "explain": "",
                  "code": "",
                  "example": ""
                }
              ]
            }
          ],
          "quiz": [
            {
              "question": "",
              "options": ["a", "b", "c", "d"],
              "correctAns": ""
            }
          ],
          "flashcards": [
            {
              "front": "",
              "back": ""
            }
          ],
          "qa": [
            {
              "question": "",
              "answer": ""
            }
          ]
        }
      ]
    }

    === REQUIREMENTS ===
    - Create 2 Courses With Course Name, Description
    - Each course must contain 5–7 chapters.
    - Each chapter must contain 3–5 content items.
    - Make sure to add chapters 
    - “explain” must be max 4 sentences (short).
    - “code” must be max 5 lines.
    - “example” must be max 2-3 lines.
    - Do not Just Explain what chapter about, Explain in Detail with Example
    - Also Make Easy, Moderate and Advance Course depends on topics
    - Generate EXACTLY:
        - 10 quiz questions
        - 10 flashcards
        - 10 Q&A items
    - category must be one of:
      ["Tech & Coding","Business & Finance","Health & Fitness","Science & Engineering","Arts & Creativity"]
    - banner_image must be randomly selected from:
      ["/banner1.png","/banner2.png","/banner3.png","/banner4.png","/banner5.png","/banner6.png"]
    - Fill EVERY field fully.
    - DO NOT include markdown, commentary, or code fences.
    - Output must be VALID JSON ONLY.
  `
};
