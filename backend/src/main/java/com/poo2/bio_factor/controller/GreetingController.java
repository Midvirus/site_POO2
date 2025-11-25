package com.poo2.bio_factor.controller;

/*
    handles web requests
    defines a RESTful web service endpoint
*/

// java
import java.util.Collections;
import java.util.Map;

// spring
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// '/api' is the base path for all endpoints in this controller
@RestController
@RequestMapping("/api")
public class GreetingController {

    @GetMapping("/hello")
    public Map<String, String> helloWorld() {
        return Collections.singletonMap("message", "hello world from backend");
    }
}
