package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.Event;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class EventSpecifications {

    //Matches names
    public static Specification<Event> matchName(String name){
        return new Specification<Event>() {
            @Override
            public Predicate toPredicate(Root<Event> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
            }
        };
    }

    //Matches by date
    public static Specification<Event> matchDate(String date){
        return new Specification<Event>() {
            @Override
            public Predicate toPredicate(Root<Event> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.equal(root.get("date"), date);
            }
        };
    }

    public static Specification<Event> dateInRange(String beginning, String end){
        return new Specification<Event>() {
            @Override
            public Predicate toPredicate(Root<Event> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.between(root.<String>get("date"), beginning, end);
            }
        };
    }

    //Matches by category
    public static Specification<Event> matchCategory(String category){
        return ((root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("cat"), "%"+category.toLowerCase()+"%"));
    }
    //Find near a lat
    public static Specification<Event> nearLat(double latitude, double radius){
        return new Specification<Event>() {
            @Override
            public Predicate toPredicate(Root<Event> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                double high =  latitude + radius;
                double low = latitude - radius;
                return criteriaBuilder.between(root.get("latitude"),low, high);
            }
        };
    }
    //Finds near a lng
    public static Specification<Event> nearLng(double longitude, double radius){
        return new Specification<Event>() {
            @Override
            public Predicate toPredicate(Root<Event> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                double high =  longitude + radius;
                double low = longitude - radius;
                return criteriaBuilder.between(root.get("longitude"),low, high);
            }
        };
    }

    //Matches by location containing
    //Mainly just for the Online endpoint
    public static Specification<Event> matchLoc(String locString){
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("loc"), "%"+locString.toLowerCase()+"%");
    }
}
