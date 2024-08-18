"use client";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";


export default function Home() {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are an AI customer support assistant for HeadstarterAI, a platform that conducts AI-powered interviews for software engineering jobs. Your primary role is to assist users with questions about the platform, troubleshoot issues, and provide guidance on using HeadstarterAI effectively. Key responsibilities: Answer questions about HeadstarterAI's features, pricing, and interview process. Assist users with account-related issues, such as registration, login problems, and subscription management. Provide technical support for any platform-related issues users may encounter during their interviews. Offer guidance on how to prepare for AI-powered interviews and make the most of the HeadstarterAI platform. Explain the benefits of using HeadstarterAI for both job seekers and employers. Address concerns about AI bias, data privacy, and the fairness of AI-powered interviews. Collect user feedback and suggestions for improving the platform. Guidelines: Always maintain a professional, friendly, and helpful tone. Provide clear and concise answers, offering to elaborate when necessary. If you don't have an answer, admit it and offer to escalate the issue to human support. Use simple language and avoid technical jargon unless specifically asked about technical details. Respect user privacy and never ask for sensitive information like passwords or payment details. Encourage users to visit the HeadstarterAI website or documentation for in-depth information on specific topics. If users express frustration, empathize with their situation and focus on finding solutions. Remember, your goal is to ensure users have a positive experience with HeadstarterAI and feel supported throughout their journey on the platform.",
  });

  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Hi, I'm the Headstarter support agent. How can I assist you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const endOfMessagesRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "model", content: "..." },
    ]);

    const result = await model.generateContent(
      JSON.stringify([...messages, { role: "user", content: message }])
    );

    const res = await result.response.text();
    const parsedRes = JSON.parse(res);

    let response = "";
    if (Array.isArray(parsedRes)) {
      response = parsedRes[0]?.content;
    } else {
      response = parsedRes.content;
    }

    setMessages((messages) => {
      let otherMessages = messages.slice(0, messages.length - 1);
      return [
        ...otherMessages,
        {
          role: "model",
          content: response,
        },
      ];
    });
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box className="flex flex-col h-screen bg-background text-white">
      <header className="bg-purple-800 text-white p-4 shadow-md">
        <Typography variant="h4" component="h1" className="font-bold text-center">
          AI Customer Support
        </Typography>
      </header>
      <Box className="flex-1 flex justify-center items-center p-4">
        <Stack
          className="bg-purple-900 rounded-lg shadow-lg flex-1 max-w-4xl"
          width="100%"
          height="100%"
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            p={4}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}
              >
                <Box
                  className={`p-3 rounded-md text-white ${msg.role === 'model' ? 'bg-purple-700' : 'bg-lavender'}`}
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
            <div ref={endOfMessagesRef} />
          </Stack>
          <form
            className="flex items-center p-4 border-t border-gray-700"
            onSubmit={sendMessage}
          >
            <TextField
              className="flex-1 bg-gray-700 text-white border-gray-600 rounded-lg"
              label="Message"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              className="ml-2 bg-purple-700 hover:bg-purple-600"
              variant="contained"
              onClick={sendMessage}
            >
              Send
            </Button>
          </form>
        </Stack>
      </Box>
    </Box>
  );
}