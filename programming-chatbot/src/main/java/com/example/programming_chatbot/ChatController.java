package com.example.programming_chatbot;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178","http://localhost:5179"})
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody ChatRequest request) {

        try {
            String reply = chatService.chat(request);

            return ResponseEntity.ok(
                Map.of("reply", reply == null ? "" : reply)
            );

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
            );

        } catch (Exception exception) {
            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).body(
                Map.of(
                    "error",
                    "Unable to generate a response. "
                    + "Check that Spring Boot and Ollama are running."
                )
            );
        }
    }
}