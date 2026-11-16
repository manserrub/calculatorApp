package com.example.calculator.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExpressionCalculatorService {

    private static final Pattern TOKEN_PATTERN =
            Pattern.compile("(?:\\d+(?:\\.\\d*)?|\\.\\d+)|[()+\\-*/]");

    public BigDecimal evaluate(String expression) {

        if (expression == null || expression.isBlank()) {
            throw new IllegalArgumentException("Expression cannot be empty");
        }

        List<String> tokens = tokenize(expression);
        List<String> postfix = convertToPostfix(tokens);

        return evaluatePostfix(postfix);
    }

    private List<String> tokenize(String expression) {

        String input = expression.replaceAll("\\s+", "");

        List<String> tokens = new ArrayList<>();
        Matcher matcher = TOKEN_PATTERN.matcher(input);

        int position = 0;
        boolean expectOperand = true;

        while (matcher.find()) {

            if (matcher.start() != position) {
                throw new IllegalArgumentException("Invalid expression");
            }

            String token = matcher.group();

            if (isNumber(token)) {

                if (!expectOperand) {
                    throw new IllegalArgumentException("Missing operator");
                }

                tokens.add(token);
                expectOperand = false;

            } else if (token.equals("(")) {

                if (!expectOperand) {
                    throw new IllegalArgumentException("Invalid parenthesis");
                }

                tokens.add(token);
                expectOperand = true;

            } else if (token.equals(")")) {

                if (expectOperand) {
                    throw new IllegalArgumentException("Missing operand");
                }

                tokens.add(token);
                expectOperand = false;

            } else {

                if (expectOperand) {

                    if (token.equals("-")) {
                        tokens.add("NEG");
                    } else {
                        throw new IllegalArgumentException(
                                "Invalid operator position"
                        );
                    }

                } else {

                    tokens.add(token);
                    expectOperand = true;
                }
            }

            position = matcher.end();
        }

        if (position != input.length() || expectOperand) {
            throw new IllegalArgumentException("Invalid expression");
        }

        return tokens;
    }

    private List<String> convertToPostfix(List<String> tokens) {

        List<String> output = new ArrayList<>();
        Deque<String> operators = new ArrayDeque<>();

        for (String token : tokens) {

            if (isNumber(token)) {

                output.add(token);

            } else if (token.equals("(")) {

                operators.push(token);

            } else if (token.equals(")")) {

                while (!operators.isEmpty()
                        && !operators.peek().equals("(")) {

                    output.add(operators.pop());
                }

                if (operators.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Mismatched parentheses"
                    );
                }

                operators.pop();

                if (!operators.isEmpty()
                        && operators.peek().equals("NEG")) {

                    output.add(operators.pop());
                }

            } else {

                while (!operators.isEmpty()
                        && !operators.peek().equals("(")
                        && (
                        precedence(operators.peek()) > precedence(token)
                                || (
                                precedence(operators.peek()) == precedence(token)
                                        && !token.equals("NEG")
                        )
                )) {

                    output.add(operators.pop());
                }

                operators.push(token);
            }
        }

        while (!operators.isEmpty()) {

            String operator = operators.pop();

            if (operator.equals("(")) {
                throw new IllegalArgumentException(
                        "Mismatched parentheses"
                );
            }

            output.add(operator);
        }

        return output;
    }

    private BigDecimal evaluatePostfix(List<String> tokens) {

        Deque<BigDecimal> stack = new ArrayDeque<>();

        for (String token : tokens) {

            if (isNumber(token)) {

                stack.push(new BigDecimal(token));

            } else if (token.equals("NEG")) {

                if (stack.isEmpty()) {
                    throw new IllegalArgumentException("Invalid expression");
                }

                stack.push(stack.pop().negate());

            } else {

                if (stack.size() < 2) {
                    throw new IllegalArgumentException("Invalid expression");
                }

                BigDecimal right = stack.pop();
                BigDecimal left = stack.pop();

                BigDecimal result = switch (token) {

                    case "+" -> left.add(right);

                    case "-" -> left.subtract(right);

                    case "*" -> left.multiply(right);

                    case "/" -> {
                        if (right.compareTo(BigDecimal.ZERO) == 0) {
                            throw new IllegalArgumentException(
                                    "Division by zero"
                            );
                        }

                        yield left.divide(
                                right,
                                10,
                                RoundingMode.HALF_UP
                        ).stripTrailingZeros();
                    }

                    default -> throw new IllegalArgumentException(
                            "Unsupported operator"
                    );
                };

                stack.push(result);
            }
        }

        if (stack.size() != 1) {
            throw new IllegalArgumentException("Invalid expression");
        }

        return stack.pop();
    }

    private boolean isNumber(String token) {
        return token.matches("(?:\\d+(?:\\.\\d*)?|\\.\\d+)");
    }

    private int precedence(String operator) {

        return switch (operator) {
            case "NEG" -> 3;
            case "*", "/" -> 2;
            case "+", "-" -> 1;
            default -> 0;
        };
    }
}
