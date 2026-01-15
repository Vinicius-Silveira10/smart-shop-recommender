package com.smartrecommender.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;

@Configuration
public class AwsConfig {

    // Injeta a região da AWS a partir do application.yml
    @Value("${aws.region}")
    private String awsRegion;

    /**
     * Cria um bean para o S3Client.
     * Este cliente será usado para interagir com o Amazon S3, por exemplo,
     * para salvar artefatos de modelo ou datasets de interações[cite: 202].
     * As credenciais são obtidas automaticamente do ambiente (ex: IAM Role da instância EC2/ECS),
     * seguindo as melhores práticas de segurança[cite: 257].
     */
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    /**
     * Cria um bean para o SecretsManagerClient.
     * Este cliente será usado para buscar segredos, como senhas de banco de dados,
     * de forma segura do AWS Secrets Manager, conforme definido nos requisitos de segurança[cite: 258].
     */
    @Bean
    public SecretsManagerClient secretsManagerClient() {
        return SecretsManagerClient.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
}