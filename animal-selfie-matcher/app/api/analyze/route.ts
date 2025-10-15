import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { image, userInfo } = await req.json()

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    const userContext = userInfo?.name
      ? `The person's name is ${userInfo.name}${userInfo.age ? `, they are ${userInfo.age} years old` : ""}${userInfo.country ? `, and they live in ${userInfo.country}` : ""}.`
      : ""

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this selfie and determine which animal the person most resembles based on their facial features, expression, and overall appearance. ${userContext}
              
              Respond ONLY with a JSON object in this exact format (no markdown, no code blocks):
              {
                "animal": "name of the animal",
                "confidence": number between 70-95,
                "description": "a fun, lighthearted 1-2 sentence description of why they match this animal",
                "emoji": "single emoji representing the animal"
              }
              
              Be creative, fun, and positive. Choose from common animals that people would recognize.`,
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    })

    console.log("[v0] AI response:", text)

    // Parse the JSON response
    const result = JSON.parse(text)

    return Response.json(result)
  } catch (error) {
    console.error("[v0] Error in analyze API:", error)
    return Response.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
