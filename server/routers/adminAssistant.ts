import { z } from "zod";
import { invokeLLM, listLLMModels } from "../_core/llm";
import { adminProcedure, router } from "../_core/trpc";

const scope = z.enum(["general", "brand", "vehicle", "content", "visual"]);
const action = z.enum(["review", "open-brand-manager", "open-vehicle-studio", "open-content-studio"]);

const suggestionSchema = z.object({
  summary: z.string().min(4).max(600),
  scope,
  suggestions: z.array(z.object({
    target: scope,
    title: z.string().min(3).max(120),
    change: z.string().min(8).max(900),
    action,
    requiresApproval: z.literal(true),
  }).strict()).min(1).max(5),
}).strict();

const responseSchema = {
  name: "zaverre_admin_suggestions",
  strict: true,
  schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      scope: { type: "string", enum: ["general", "brand", "vehicle", "content", "visual"] },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            target: { type: "string", enum: ["general", "brand", "vehicle", "content", "visual"] },
            title: { type: "string" },
            change: { type: "string" },
            action: { type: "string", enum: ["review", "open-brand-manager", "open-vehicle-studio", "open-content-studio"] },
            requiresApproval: { type: "boolean", enum: [true] },
          },
          required: ["target", "title", "change", "action", "requiresApproval"],
          additionalProperties: false,
        },
      },
    },
    required: ["summary", "scope", "suggestions"],
    additionalProperties: false,
  },
} as const;

export const adminAssistantRouter = router({
  draft: adminProcedure.input(z.object({
    request: z.string().trim().min(4).max(4_000),
    scope,
    context: z.string().trim().max(2_000).optional(),
  }).strict()).mutation(async ({ input }) => {
    const catalog = await listLLMModels();
    const model = catalog.data.find(({ id }) => id === "gpt-5-mini")?.id ?? catalog.data[0]?.id;
    if (!model) throw new Error("No AI model is currently available for the administration assistant.");

    const completion = await invokeLLM({
      model,
      maxTokens: 1600,
      response_format: { type: "json_schema", json_schema: responseSchema },
      messages: [
        {
          role: "system",
          content: "You are the ZAVERRE administration assistant. Return only structured review suggestions for a luxury car rental website. Never claim that a change was already applied, never give shell commands, never request credentials, never change prices, visibility, booking data, or public content automatically. Every suggested change requires administrator approval. Keep suggestions specific, concise, and use the user's language.",
        },
        {
          role: "user",
          content: `Requested scope: ${input.scope}\nAdministrator request: ${input.request}\nCurrent editor context: ${input.context || "none"}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message.content;
    if (typeof raw !== "string") throw new Error("The administration assistant returned no readable proposal.");
    return suggestionSchema.parse(JSON.parse(raw));
  }),
});
