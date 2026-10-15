package com.example.programming_chatbot;

import java.util.List;

public record ChatRequest(
        String message,
        List<ChatMessage> history
) {
    public record ChatMessage(
            String role,
            String content
    ) {
    }
}