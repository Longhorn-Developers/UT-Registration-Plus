# To Do
*Last Updated: 07/28/19*

## Features: 
- [ ] work on UT Planner & Coursicle
- [ ] work on multiple schedules
- [ ] polish
- [ ] more 'at a glance info'
- [ ] Rearrange Courses
- [ ] Firefox Support
- [ ] RMP (cumulative score for class based off CIS, RMP, grade dist., etc.)
- [ ] Conflict indicator ( Possible different section? )
- [ ] Redesign footer menu
- [ ] Compare classes mode

## Known Bugs:
- [ ] Screenshotting calendar on zoomed browser cuts off image.

## Completed:
- [x] unneeded Logout message on individual course pages
- [x] RMP not working on individual course pages
- [x] Textbook button (amber)
- [x] Calendar popup
- [x] online classes no times in popup link 
- [x] load all courses on first pages
- [x] Location in popup extra info
- [x] Export calendar format 
- [x] import courses from class schedule screen
- [x] all semester's grade distribution
- [x] import into and export from UT registration plus
- [x] Showing the icon on the flags pages
- [x] Easter egg, no course messages
- [x] clean upcalendar export and add more options to screen
- [x] search by unique number
- [x] Fix the update/install bug

for FIXING DB: 

ALTER TABLE agg ADD semesters

update agg
set semesters = (select group_concat(sem) from grades where agg.prof = grades.prof and agg.course_nbr = grades.course_nbr and agg.dept = grades.dept);
