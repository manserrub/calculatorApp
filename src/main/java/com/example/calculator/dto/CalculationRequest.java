package com.example.calculator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CalculationRequest(

        @NotNull(message = "First number is required")
        BigDecimal number1,

        @NotNull(message = "Second number is required")
        BigDecimal number2,

        @NotBlank(message = "Operation is required")
        String operation

) {}
