package com.example.calculator.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CalculatorService {

    public BigDecimal calculate(BigDecimal number1, BigDecimal number2, String operation) {

        return switch (operation.trim()) {

            case "+" -> number1.add(number2);

            case "-" -> number1.subtract(number2);

            case "*" -> number1.multiply(number2);

            case "/" -> {
                if (number2.compareTo(BigDecimal.ZERO) == 0) {
                    throw new IllegalArgumentException(
                            "Division by zero is not allowed"
                    );
                }

                yield number1.divide(
                        number2,
                        10,
                        RoundingMode.HALF_UP
                ).stripTrailingZeros();
            }

            default -> throw new IllegalArgumentException(
                    "Unsupported operation: " + operation
            );
        };
    }
}
