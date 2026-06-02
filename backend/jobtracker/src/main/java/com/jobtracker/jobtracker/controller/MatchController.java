package com.jobtracker.jobtracker.controller;

import com.jobtracker.jobtracker.model.MatchRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MatchController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @PostMapping("/match")
    public ResponseEntity<String> match(@RequestBody MatchRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = "You are a resume screener. Analyze how well this resume matches the job description.\n\n" +
            "RESUME:\n" + request.getResume() + "\n\n" +
            "JOB DESCRIPTION:\n" + request.getJobDescription() + "\n\n" +
            "Respond ONLY with a valid JSON object in exactly this format, no extra text, no markdown backticks:\n" +
            "{\n" +
            "  \"score\": <number 0-100>,\n" +
            "  \"matchedSkills\": [\"skill1\", \"skill2\"],\n" +
            "  \"missingSkills\": [\"skill1\", \"skill2\"],\n" +
            "  \"summary\": \"2-3 sentence assessment here\"\n" +
            "}";

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class
            );

            Map responseBody = response.getBody();
            List candidates = (List) responseBody.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");
            Map firstPart = (Map) parts.get(0);
            String text = (String) firstPart.get("text");

            // Strip markdown backticks if Gemini adds them
            text = text.trim();
            if (text.startsWith("```")) {
                text = text.replaceAll("```json", "").replaceAll("```", "").trim();
            }

            return ResponseEntity.ok(text);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}