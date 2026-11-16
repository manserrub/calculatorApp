package com.example.calculator.controller;

import com.example.calculator.dto.ExpressionRequest;
import com.example.calculator.dto.ExpressionResponse;
import com.example.calculator.service.ExpressionCalculatorService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculator")
public class ExpressionController {

    private final ExpressionCalculatorService expressionService;

    public ExpressionController(
            ExpressionCalculatorService expressionService
    ) {
        this.expressionService = expressionService;
    }

    @PostMapping("/expression")
    public ResponseEntity<ExpressionResponse> evaluate(
            @Valid @RequestBody ExpressionRequest request
    ) {

        var result = expressionService.evaluate(
                request.expression()
        );

        var response = new ExpressionResponse(
                request.expression(),
                result
        );

        return ResponseEntity.ok(response);
    }
}
