package com.neighborhood.npulse.data.entity;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;


//Actually Unneeded but good to have for the future
@Converter
public class DateConverter implements AttributeConverter<Date, String> {

    @Override
    public String convertToDatabaseColumn(Date date) {
        return new SimpleDateFormat("yyyy-MM-dd").format(date);
    }

    @Override
    public Date convertToEntityAttribute(String s) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date date;
        try {
            date = format.parse(s);
        } catch (ParseException e){
            date = null;
        }
        return date;
    }
}
