package com.smartrecommender;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; // IMPORTAÇÃO NECESSÁRIA

@SpringBootApplication(scanBasePackages = "com.smartrecommender")
@EnableAsync // RESOLVE: Habilita a execução assíncrona para o LogisticsService
public class SmartRecommenderApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartRecommenderApplication.class, args);
    }

}