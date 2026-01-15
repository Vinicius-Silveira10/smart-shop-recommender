package com.smartrecommender.util;

import org.modelmapper.ModelMapper;

public class MapperUtils {
    private static final ModelMapper mapper = new ModelMapper();
    public static <S, T> T map(S source, Class<T> targetClass) {
        return mapper.map(source, targetClass);
    }
}
