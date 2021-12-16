-- https://github.com/UT-Natural-Sciences-Council/database
create table utrp_grades as select * from grades where 0;
insert into utrp_grades select sem,prof,dept,course_nbr,course_name,sum(a1),sum(a2),sum(a3),sum(b1),sum(b2),sum(b3),sum(c1),sum(c2),sum(c3),sum(d1),sum(d2),sum(d3),sum(f) from grades group by sem,prof,dept,course_nbr;

create table utrp_agg as select * from agg where 0;
alter table utrp_agg add column sems text;
insert into utrp_agg select "Aggregate",prof,dept,course_nbr,course_name,sum(a1),sum(a2),sum(a3),sum(b1),sum(b2),sum(b3),sum(c1),sum(c2),sum(c3),sum(d1),sum(d2),sum(d3),sum(f),group_concat(distinct sem) from grades group by prof,dept,course_nbr;

