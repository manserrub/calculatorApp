package com.example.calculator.dto;

import java.math.BigDecimal;

public record ExpressionResponse(
        String expression,
        BigDecimal result
) {}
