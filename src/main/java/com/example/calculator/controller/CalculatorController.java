package com.example.calculator.controller;

import com.example.calculator.dto.CalculationRequest;
import com.example.calculator.dto.CalculationResponse;
import com.example.calculator.service.CalculatorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {

    private final CalculatorService calculatorService;

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResponse> calculate(
            @Valid @RequestBody CalculationRequest request
    ) {

        var result = calculatorService.calculate(
                request.number1(),
                request.number2(),
                request.operation()
        );

        var response = new CalculationResponse(
                request.number1(),
                request.operation(),
                request.number2(),
                result
        );

        return ResponseEntity.ok(response);
    }
}