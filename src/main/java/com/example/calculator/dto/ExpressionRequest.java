package com.example.calculator.dto;

import jakarta.validation.constraints.NotBlank;

public record ExpressionRequest(

        @NotBlank(message = "Expression cannot be empty")
        String expression

) {}
