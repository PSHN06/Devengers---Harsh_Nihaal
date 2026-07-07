// api/gemini.js
// Secure serverless relay for the Google Gemini 3.5 Flash API

export default async function handler(req, res) {
  // Security check: Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
  }

  const { action, transcript, location, category, language, scheme, age, income, land, occupation, state, draft, history } = req.body;

  // Input validation
  if (!action) {
    return res.status(400).json({ error: 'Action parameter is required.' });
  }

  try {
    let systemInstruction = "";
    let promptText = "";
    let useJson = true;

    if (action === 'analyze_complaint') {
      systemInstruction = `You are JanVaani.ai, an expert Indian Municipal Civic Analyst. 
Analyze the user's transcript describing a civic issue, their location landmark, and category.
Meticulously extract:
1. An official, concise title for the complaint (in English).
2. The corrected department category (choose from: Streetlight, Roads, Waste, Sewage, Water, Administrative).
3. The specific assigned Indian government local body/agency responsible for the area (e.g. Bruhat Bengaluru Mahanagara Palike (BBMP) for Bangalore, Delhi Municipal Corporation (MCD) for Delhi, Greater Chennai Corporation (GCC) for Chennai, etc., or standard state/local body).
4. Timeframe ETA for resolution (e.g. '3 Days', '5 Days', 'Resolved').
5. Realistic latitude and longitude coordinates matching the Indian landmark location.
6. A 6-character unique geocode identifier (e.g. CP-DW-40).
7. An official, formal administrative-grade representation letter draft (in English) addressed to the commissioner or executive engineer of the local department, outlining the issue, safety hazards, and request for repair.
Your response MUST be strictly valid JSON conforming to this schema:
{
  "title": "string",
  "category": "string",
  "agency": "string",
  "eta": "string",
  "lat": "string",
  "lng": "string",
  "geocode": "string",
  "draft": "string"
}`;
      promptText = `Transcript: "${transcript}"\nLocation Landmark: "${location}"\nPre-selected Category: "${category}"`;
      
    } else if (action === 'chat') {
      systemInstruction = `You are JanVaani.ai Civic Companion, a domain-expert Indian civic advisor.
Your goal is to guide citizens on municipal procedures, document application rules (like Aadhaar, PAN card, Ration card, Income certificates), and explain government schemes.
DO NOT respond with generic chat text. Instead, write your responses structured as official bulletins using this precise HTML format:
<div class="advisory-bulletin">
  <div class="bulletin-header">CIVIC ADVISORY BULLETIN</div>
  <p class="bulletin-brief">[Write a brief summary of the answer]</p>
  <ul class="bulletin-list">
    <li><strong>[Action Step 1]:</strong> [Details...]</li>
    <li><strong>[Action Step 2]:</strong> [Details...]</li>
  </ul>
  <p class="bulletin-footer mt-2">[Statutory or helpful closing note]</p>
</div>
Provide responses in the user's requested language (${language || 'English'}). If they type in vernacular, respond in that vernacular.`;
      
      // Pass the historical messages directly to Gemini in its format
      useJson = false;
      
    } else if (action === 'evaluate_scheme') {
      systemInstruction = `You are JanVaani.ai Scheme Evaluator, a central welfare officer in India.
Assess the eligibility of an applicant for the welfare scheme: "${scheme}".
Candidate parameters:
- State: ${state}
- Age: ${age} years
- Family Income: ₹${income} per annum
- Landholdings: ${land} acres
- Occupation: ${occupation}
Calculate:
1. Approval probability percentage (0 to 100).
2. Probability status text (e.g. 'High (Highly Likely)', 'Moderate (Needs Verification)', 'Low (Ineligible)').
3. A brief explanation of why they are or are not eligible based on standard guidelines.
4. A list of 2-3 eligible/fitting parameters.
5. A list of critical exclusions checked or warnings (e.g. taxpayer status, land ceiling checks).
6. A simplified list of 3-4 required documents indicating standard verification status ('checked' for provided parameters, 'unchecked' for physical checks).
Your response MUST be strictly valid JSON conforming to this schema:
{
  "percentage": number,
  "probabilityText": "string",
  "brief": "string",
  "eligibleParams": ["string"],
  "exclusions": ["string"],
  "documents": [
    { "name": "string", "status": "checked" | "unchecked" }
  ]
}`;
      promptText = `Evaluate eligibility for scheme ID: "${scheme}".`;
      
    } else if (action === 'translate_draft') {
      systemInstruction = `You are a professional administrative translator specializing in Indian civic communications.
Translate the provided administrative representation letter into the requested language: "${language}".
Maintain the formal, respectful administrative tone, layout structure, and headings of the original letter.
Your output must be strictly valid JSON conforming to this schema:
{
  "translatedDraft": "string"
}`;
      promptText = `Letter draft to translate: \n"${draft}"`;
      
    } else {
      return res.status(400).json({ error: 'Unknown action specified.' });
    }

    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    
    // Construct request contents body
    let contents = [];
    if (action === 'chat') {
      // Chat uses history array
      contents = history && history.length > 0 ? history : [];
      contents.push({
        role: "user",
        parts: [{ text: promptText || "Hello" }]
      });
    } else {
      contents = [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ];
    }

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.2
      }
    };

    if (useJson) {
      payload.generationConfig.responseMimeType = "application/json";
    }

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error text:", errText);
      return res.status(502).json({ error: 'Failed to fetch response from Gemini API.' });
    }

    const geminiData = await geminiRes.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ error: 'Empty content returned from Gemini model.' });
    }

    if (useJson) {
      // Parse JSON from Gemini response
      try {
        const parsed = JSON.parse(generatedText.trim());
        return res.status(200).json(parsed);
      } catch (jsonErr) {
        console.error("Failed to parse JSON response from Gemini:", generatedText);
        return res.status(500).json({ error: 'Invalid JSON returned from model.', raw: generatedText });
      }
    } else {
      // Standard chat return text
      return res.status(200).json({ reply: generatedText });
    }

  } catch (err) {
    console.error("Serverless route exception:", err);
    return res.status(500).json({ error: 'Internal server error occurred.' });
  }
}
