package com.example.calculator.dto;

import java.math.BigDecimal;

public record CalculationResponse(

        BigDecimal number1,
        String operation,
        BigDecimal number2,
        BigDecimal result

) {}
