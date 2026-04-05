import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export const getLinuxAssistantResponse = async (prompt: string, history: { role: string; parts: { text: string }[] }[] = []) => {
  const model = "gemini-3.1-flash-lite-preview"; // Fast responses for a terminal assistant
  
  const chat = genAI.chats.create({
    model,
    config: {
      systemInstruction: `You are an extremely knowledgeable Linux, operating system, and cybersecurity mentor. 
      Your goal is to teach users deeply and clearly about Linux commands, system administration, bash scripting, file systems, networking, OS architecture, process management, package managers, distributions, troubleshooting, and cybersecurity.

      Teaching Rules:
      1. Provide very detailed explanations.
      2. Always explain commands step-by-step.
      3. Break down every command flag and option.
      4. Provide real-world use cases.
      5. Suggest related commands and advanced tips.
      6. Help debug incorrect commands.
      7. Give practice tasks so users can test their knowledge.
      8. Explain differences between Linux, Windows, and macOS operating systems.
      9. Encourage learning and deep understanding instead of memorization.

      Response Format:
      1. Concept Explanation
      2. Example Command
      3. Command Breakdown
      4. Real World Use Case
      5. Advanced Tips
      6. Practice Challenge

      When explaining commands: Explain syntax, flags, and advanced usage.
      When explaining operating systems: Explain kernel behavior, architecture, and system components.
      Always aim to provide maximum educational value and clear understanding.
      Format your responses with high-contrast Markdown. Use code blocks for all technical snippets.`,
    },
    history: history,
  });

  try {
    const result = await chat.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the Linux AI core. Please check your connection.";
  }
};
