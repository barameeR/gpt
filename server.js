import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const inference = new HfInference(process.env.HF_ACCESS_TOKEN);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  console.log("Hello World!");
  res.status(200).send("Hello World!");
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body.prompt);
    const prompt = req.body.prompt;
    const stream = inference.chatCompletionStream({
      model: process.env.HF_ACCESS_TOKEN,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    let responseText = "";
    for await (const chunk of stream) {
      responseText += chunk.choices[0]?.delta?.content || "";
    }

    console.log(responseText);
    res.status(200).send(responseText);
  } catch (error) {
    res.status(500).send(`Error: ${error}\nMessage: ${error.message}`);
  }
});

app.listen(5000, () => console.log("Server is running on port 5000"));
