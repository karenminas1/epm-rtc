import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, sanitize } from "@/app/utils/";
import { Roles } from "@/app/enums";

export async function POST(request: NextRequest) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  try {
    let requestBody;
    let sanitizedRequestBody = [];
    try {
      requestBody = await request.json();
      sanitizedRequestBody = sanitize(requestBody);
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      throw new Error("Invalid request body");
    }

    let aiResponse = "";
    try {
      const chatIterator = await getOpenAIClient().listChatCompletions(
        process.env.NEXT_PUBLIC_OPENAI_VERSION!,
        sanitizedRequestBody
      );

      for await (const event of chatIterator) {
        for (const choice of event.choices) {
          const delta = choice.delta?.content;
          if (delta !== undefined) {
            aiResponse += delta;
          }
        }
      }

      writer.write(
        `data: ${JSON.stringify({
          id: uuidv4(),
          role: Roles.Assistant,
          content: aiResponse,
        })}\n\n`
      );
      writer.close();
    } catch (apiError) {
      console.error("Error interacting with OpenAI:", apiError);
      throw new Error("OpenAI service unavailable");
    }

    return new Response(responseStream.readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Encoding": "none",
      },
    });
  } catch (err) {
    console.error("Unhandled error in POST function:", err);

    return new NextResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
