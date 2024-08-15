"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const firstMessage =
    "Hi there! I'm the Headstarter virtual assistant. How can I help?";
  const [history, setHistory] = useState([]);
  // const [messages, setMessages] = useState([
  // {
  // role: 'assistant',
  // content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
  // },
  // ])

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setHistory((history) => [
      ...history,
      { role: "user", parts: [{ text: message }] },
    ]);
    setMessage(""); // Clear the input field

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ...history,
          { role: "user", parts: [{ text: message }] },
        ]),
      });
      const data = await response.json();

      setHistory((history) => [
        ...history,
        { role: "model", parts: [{ text: data }] },
      ]);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >      
        <Typography variant="h5" display = "flex" align = "center" >Bot Assistant</Typography>
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          <Box display="flex" justifyContent="flex-start">
            <Box bgcolor="secondary.main" color="white" borderRadius={16} p={3}>
              {firstMessage}
            </Box>
          </Box>

          {history.map((textObject, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                textObject.role === "user" ? "flex-end" : "flex-start"
              }
            >
              <Box
                bgcolor={
                  textObject.role === "user" ? "primary.main" : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {textObject.parts[0].text}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
